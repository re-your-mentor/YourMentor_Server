const {
  User,
  Post,
  Hashtag,
  Comment 
} = require('../models');
const Sequelize = require('sequelize');

exports.renderMain = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    let sort = req.query.sort || 'latest';

    if (page < 1) page = 1;
    pageSize = Math.min(pageSize, 50);

    let order = [['createdAt', 'DESC']]; // 기본 최신순 정렬

    // 좋아요 수 기준 정렬 처리
    const includeLikes = [
      Sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.postId = Post.id)'),
      'likesCount',
    ];

    if (sort === 'popular') {
      order = [[Sequelize.literal('likesCount'), 'DESC']]; // 인기순 정렬
    }

    // 게시글 조회
    const { count, rows: posts } = await Post.findAndCountAll({
      include: [
        { model: User, attributes: ['id', 'nick'] },
        { model: Hashtag, attributes: ['id', 'name'], through: { attributes: [] } },
      ],
      attributes: {
        include: [includeLikes], // 좋아요 개수 추가
      },
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order,
      subQuery: false, // ORDER BY에서 likesCount를 사용 가능하게 설정
    });

    res.status(200).json({ count, posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};



// 해시태그 검색 결과 반환
exports.renderHashtag = async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Hashtag query parameter is missing' });
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];

    if (hashtag) {
      posts = await hashtag.getPosts({
        include: [
          { model: User, attributes: ['id', 'nick'] },
          {
            model: Hashtag, attributes: ['id', 'name'],
            through: { attributes: [] }
          }, // 해시태그 정보 포함
        ],
      });
    }

    // 검색된 게시물 데이터를 JSON 형식으로 반환
    const twits = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      user: {
        id: post.User.id,
        nick: post.User.nick,
      },
      hashtags: post.Hashtags.map(hashtag => ({ // 해시태그 정보 추가
        id: hashtag.id,
        name: hashtag.name,
      })),
    }));

    return res.status(200).json({
      success: true,
      title: `${query} | Ur_mento`,
      twits: twits,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadPost = async (req, res) => {
  try {
    if (!req.body.content || !req.body.title) {
      return res.status(400).json({ success: false, message: '게시글 제목과 본문은 필수사항입니다.' });
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId);
    const userNick = user.nick;

    // 1️⃣ 게시글 생성
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      img: req.body.img || null,
      userId: req.user.id,
      user_nick: userNick,
    });

    // 2️⃣ 해시태그 처리
    const hashtagIndexes = req.body.hashtags; // "hashtags" 키로 명확히 지정
    if (hashtagIndexes && Array.isArray(hashtagIndexes)) {
      console.log('📌 요청한 해시태그 ID:', hashtagIndexes);

      const existingTags = await Hashtag.findAll({
        where: { id: hashtagIndexes },
      });

      console.log('📌 DB에서 찾은 해시태그:', existingTags);

      if (existingTags.length) {
        await post.addHashtags(existingTags); // ✅ 복수형 메서드 사용
        console.log('해시태그 추가 완료');
      } else {
        console.log('DB에서 해당 ID의 해시태그를 찾지 못함');
      }
    }

    // 3️⃣ 저장된 해시태그 포함하여 다시 조회
    const fullPost = await Post.findByPk(post.id, {
      include: [{
        model: Hashtag,
        through: { attributes: [] }, // 중간 테이블 필드 제외
      }],
    });

    res.json({ success: true, post: fullPost });
  } catch (error) {
    console.error('업로드 중 오류 발생:', error);
    res.status(500).json({ success: false, message: '게시글 업로드 중 오류가 발생했습니다.' });
  }
};



// 게시물 세부 조회 ( 게시글 + 댓글 )
exports.getPostWithComments = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findOne({
      where: { id },
      include: [
        { model: User, attributes: ['id', 'nick', 'profile_pic'] },
        {
          model: Comment, include:
            [{ model: User, attributes: ['id', 'nick'] }], required: false
        },
        {
          model: Hashtag, attributes: ['id', 'name'],
          through: { attributes: [] }
        }, // 해시태그 정보 포함
      ],
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    return res.status(200).json({
      success: true,
      post: {
        user_nick: post.User.nick,
        id: post.id,
        title: post.title,
        content: post.content,
        img: post.img,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: {
          id: post.User.id,
          nick: post.User.nick,
          img: post.User.profile_pic,
        },
        hashtags: post.Hashtags.map(hashtag => ({ // 해시태그 정보 추가
          id: hashtag.id,
          name: hashtag.name,
        })),
        comments: post.Comments.map(comment => ({
          id: comment.id,
          reply_to: comment.reply_to,
          comment_nick: comment.post_nick,
          content: comment.content,
          createdAt: comment.createdAt,
          user: {
            id: comment.User.id,
            nick: comment.User.nick,
          },
        })),
      },
    });
  } catch (err) {
    console.error('Error fetching post with comments:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
    });
  }
};