const { Like, Post, User } = require('../models');

// 좋아요 추가
exports.addPostLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
    }

    const like = await Like.findOne({ where: { postId, userId } });
    if (like) {
      return res.status(400).json({ success: false, message: '이미 좋아요를 눌렀습니다.' });
    }

    await Like.create({ postId, userId });
    res.json({ success: true, message: '좋아요를 눌렀습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '좋아요 추가 중 오류가 발생했습니다.' });
  }

};

// 좋아요 취소
exports.removePostLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const like = await Like.findOne({ where: { postId, userId } });
    if (!like) {
      return res.status(404).json({ success: false, message: '좋아요를 찾을 수 없습니다.' });
    }

    await like.destroy();
    res.json({ success: true, message: '좋아요를 취소했습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '좋아요 취소 중 오류가 발생했습니다.' });
  }

};