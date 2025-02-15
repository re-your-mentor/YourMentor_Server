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
      'likesCount', // likesCount만 정의
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
        include: [includeLikes], // likesCount만 포함
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

