const { Comment, User, Post} = require('../models');

// 댓글 생성 및 대댓글 생성
exports.createComment = async (req, res) => {
  const { content, postId, reply_to } = req.body;

  try {
    // 토큰에서 userId 파싱
    const userId = req.user.id;

    // 사용자 정보 조회
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 부모 댓글이 있으면 대댓글로, 없으면 일반 댓글로 처리
    const comment = await Comment.create({
      content,
      postId,
      userId, // 토큰에서 파싱한 userId 사용
      reply_to: reply_to || null, // reply_to가 있으면 대댓글, 없으면 일반 댓글
    });

    // 응답 객체에 user_nick 추가
    const responseComment = {
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      reply_to: comment.reply_to,
      user_nick: user.nick, // 사용자 닉네임 추가
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };

    res.status(201).json({
      message: reply_to ? 'Reply created successfully!' : 'Comment created successfully!',
      comment: responseComment, // user_nick이 포함된 응답 객체
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