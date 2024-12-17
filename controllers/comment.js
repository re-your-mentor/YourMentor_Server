const { Comment, Post, User } = require('../models');

// 댓글 생성 (Create)
exports.createComment = async (req, res) => {
  const { postId, content, post_nick } = req.body;
  const userId = req.user.id; // 로그인한 사용자의 id (JWT 토큰에서 가져오기)

  try {
    const post = await Post.findByPk(postId); // 게시글 존재 여부 확인
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = await Comment.create({
      content,
      post_nick,
      postId,
      userId,
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating comment' });
  }
};

// 댓글 조회 (Read)
exports.getComment = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.findAll({
      where: { postId },
      include: [
        { model: User, attributes: ['nick'] }, // 댓글 작성자의 닉네임
      ],
    });

    // 모든 댓글을 리스트 형식으로 변환
    const commentList = comments.map(comment => ({
      content: comment.content,
      nick: comment.User ? comment.User.nick : null,
    }));

    res.status(200).json(commentList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};


// 댓글 수정 (Update)
exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content, post_nick } = req.body;

  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // 댓글 작성자만 수정 가능
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only edit your own comment' });
    }

    // `content`와 `post_nick`을 수정
    comment.content = content;
    comment.post_nick = post_nick;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating comment' });
  }
};

// 댓글 삭제 (Delete)
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // 댓글 작성자만 삭제 가능
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own comment' });
    }

    await comment.destroy();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
};
