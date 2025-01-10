const { Comment, User } = require('../models');

// 댓글 생성 및 대댓글 생성
exports.createComment = async (req, res) => {
  const { content, postId, userId, reply_to } = req.body;
  const user = await User.findByPk(userId);

  try {
    // 부모 댓글이 있으면 대댓글로, 없으면 일반 댓글로 처리
    const comment = await Comment.create({
      content,
      postId,
      userId,
      reply_to: reply_to || null, // reply_to가 있으면 대댓글, 없으면 일반 댓글
    });

    // 사용자 닉네임을 추가
    comment.user_nick = user.nick;

    res.status(201).json({
      message: reply_to ? 'Reply created successfully!' : 'Comment created successfully!',
      comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create comment.', error });
  }
};

// 특정 게시글의 댓글 조회
exports.getCommentsByPostId = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.findAll({
      where: { postId, reply_to: null },
      include: [
        {
          model: Comment,
          as: 'Replies',
          include: [
            {
              model: User,
              attributes: ['id', 'nick'],
            },
          ],
        },
        {
          model: User,
          attributes: ['id', 'nick'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json({
      message: 'Comments fetched successfully!',
      comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch comments.', error });
  }
};