const { Like, Post, User } = require('../models');

// 좋아요 추가
// controllers/like.js
exports.addPostLike = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id; // 클라이언트에서 사용자 ID를 전달받음

  console.log(postId);
  console.log(userId);

  try {
    // 이미 좋아요를 눌렀는지 확인
    const existingLike = await Like.findOne({
      where: { postId, userId },
    });

    if (existingLike) {
      return res.status(400).json({ message: '이미 좋아요를 눌렀습니다.' });
    }

    // 좋아요 추가
    await Like.create({ postId, userId });

    // 게시글의 좋아요 수 증가
    //await Post.increment('likeCount', { where: { id: postId } });

    res.status(201).json({ message: '좋아요 추가됨' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 좋아요 취소
exports.removePostLike = async (req, res) => {
  const { postId } = req.params;
  const  userId  = req.user.id; // 클라이언트에서 사용자 ID를 전달받음

  try {
    // 좋아요 기록 찾기
    const like = await Like.findOne({
      where: { postId, userId },
    });

    if (!like) {
      return res.status(404).json({ message: '좋아요 기록이 없습니다.' });
    }

    // 좋아요 삭제
    await like.destroy();

    // 게시글의 좋아요 수 감소
    //await Post.decrement('likeCount', { where: { id: postId } });

    res.status(200).json({ message: '좋아요 삭제됨' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
};