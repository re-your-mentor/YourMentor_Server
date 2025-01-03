const { User, Post, Hashtag, Comment } = require('../models'); // User, Post, Hashtag 모델을 가져옴

// 모든 게시물을 가져옴
exports.renderMain = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']], 
    });

    const twits = posts.map(({ post_nick, id, content, createdAt, User: { id: userId, nick } }) => ({
      post_nick,
      id,
      content,
      createdAt,
      user: {
        id: userId,
        nick,
      },
    }));

    // 성공 응답
    res.status(200).json({
      success: true,
      title: 'NodeBird',
      twits,
    });
  } catch (err) {
    console.error('Error fetching posts:', err.message);
    next(err); 
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
      content: post.content,
      createdAt: post.createdAt,
      user: {
        id: post.User.id,
        nick: post.User.nick,
      },
    }));

    return res.status(200).json({
      success: true,
      title: `${query} | NodeBird`,
      twits: twits,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

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
        post_nick: post.post_nick,
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
          attributes: ['id', 'nick'],
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
        post_nick: post.post_nick,
        id: post.id,
        content: post.content,
        img: post.img,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: {
          id: post.User.id,
          nick: post.User.nick,
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
