const { User, Post, Hashtag, Comment } = require('../models'); // User, Post, Hashtag 모델을 가져옴

exports.renderMain = async (req, res) => {
  try {
    // 모든 게시글 조회 (작성자 정보 포함)
    const posts = await Post.findAll({
      include: [{ model: User, attributes: ['id', 'nick'] }]
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
      posts = await hashtag.getPosts({ include: [{ model: User }] });
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

// post 세부 조회
exports.getPostById = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: User, // User 정보를 포함
          attributes: ['id', 'nick'],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    return res.status(200).json({
      success: true,
      post: {
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        user: {
          id: post.User.id,
          nick: post.User.nick,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message }); // 오류 발생 시 JSON 형식으로 반환
  }
};

//게시물 단일 조회
exports.getPostWithComments = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findOne({
      where: { id },
      include: [
        {
          model: User, 
          attributes: ['id', 'nick', 'profile_pic'],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'nick'],
            },
          ],
          required: false,
        },
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
        content: post.content,
        img: post.img,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: {
          id: post.User.id,
          nick: post.User.nick,
          img: post.User.profile_pic
        },
        comments: post.Comments.map(comment => ({
          comment_nick: comment.post_nick,
          id: comment.id,
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
    console.error('Error fetching post with comments:', err.message); // 에러 로그
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
    });
  }
};
