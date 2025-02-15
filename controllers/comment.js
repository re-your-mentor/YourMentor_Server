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

exports.deleteComment = async (req, res) => {
  const { id } = req.params; // 삭제할 댓글 ID
  const userId = req.user.id; // 현재 로그인한 사용자 ID

  try {
    // 삭제할 댓글 조회
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    // 댓글 작성자와 현재 사용자가 일치하는지 확인
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this comment.' });
    }

    // 부모 댓글인 경우 (reply_to가 null인 경우)
    if (comment.reply_to === null) {
      // 해당 댓글에 달린 모든 대댓글 삭제
      await Comment.destroy({
        where: {
          reply_to: comment.id, // 부모 댓글의 ID를 참조하는 대댓글들
        },
      });
    }

    // 댓글 삭제
    await comment.destroy();

    res.status(200).json({ message: 'Comment and its replies deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete comment.', error });
  }
};