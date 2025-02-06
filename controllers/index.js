const { 
  User,
  Post, 
  Hashtag, 
  Comment } = require('../models'); // User, Post, Hashtag 모델을 가져옴

exports.renderMain = async (req, res) => {
  try {
    // 모든 게시글 조회 (작성자 정보 및 해시태그 포함)
    const posts = await Post.findAll({
      include: [
        { model: User, attributes: ['id', 'nick'] },
        { model: Hashtag, attributes: ['id', 'name'], through: { attributes: [] } }, // 해시태그 정보 포함
      ],
    });

    // posts가 null 또는 undefined인 경우 빈 배열로 초기화
    const safePosts = posts || [];

    // 게시글 데이터 포맷
    const postData = safePosts.map(post => {
      if (!post || !post.User) return null; // post 또는 post.User가 null이면 null 반환
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        img: post.img,
        createdAt: post.createdAt,
        user: {
          id: post.User.id,
          nick: post.User.nick,
        },
        hashtags: post.Hashtags.map(hashtag => ({ // 해시태그 정보 추가
          id: hashtag.id,
          name: hashtag.name,
        })),
      };
    }).filter(post => post !== null); // null인 요소 제거

    res.status(200).json(postData); // 데이터 반환
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
          { model: Hashtag, attributes: ['id', 'name'], 
            through: { attributes: [] } }, // 해시태그 정보 포함
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
        { model: Comment, include: 
          [{ model: User, attributes: ['id', 'nick'] }], required: false },
        { model: Hashtag, attributes: ['id', 'name'], 
          through: { attributes: [] } }, // 해시태그 정보 포함
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