const { Post, Hashtag } = require('../models');

// 이미지 업로드 후 URL을 반환하는 컨트롤러 함수
exports.afterUploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '파일 업로드에 실패했습니다.' });
    }
    res.json({ success: true, url: `/img/${req.file.filename}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '이미지 업로드 처리 중 오류가 발생했습니다.' });
  }
};

// 게시글 업로드
exports.uploadPost = async (req, res) => {
  try {
    if (!req.body.content || !req.body.post_nick) {
      return res.status(400).json({ success: false, message: '게시글 내용과 닉네임은 필수입니다.' });
    }

    const post = await Post.create({
      post_nick: req.body.post_nick,
      content: req.body.content,
      img: req.body.url || null,
      UserId: req.user?.id, // req.user가 없을 경우 null 처리
    });

    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag =>
          Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        )
      );
      await post.addHashtags(result.map(r => r[0]));
    }

    res.json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '게시글 업로드 중 오류가 발생했습니다.' });
  }
};

// 게시글 삭제
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).json({ success: false, message: '삭제할 게시글을 찾을 수 없습니다.' });
    }

    if (!req.user || post.UserId !== req.user.id) {
      return res.status(403).json({ success: false, message: '게시글 삭제 권한이 없습니다.' });
    }

    await post.destroy();
    res.json({ success: true, message: '게시글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '게시글 삭제 중 오류가 발생했습니다.' });
  }
};

// 게시글 수정
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).json({ success: false, message: '수정할 게시글을 찾을 수 없습니다.' });
    }

    if (!req.user || post.UserId !== req.user.id) {
      return res.status(403).json({ success: false, message: '게시글 수정 권한이 없습니다.' });
    }

    await post.update({
      content: req.body.content || post.content, // 기존 값 유지
      img: req.body.url || post.img,
    });

    res.json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '게시글 수정 중 오류가 발생했습니다.' });
  }
};
