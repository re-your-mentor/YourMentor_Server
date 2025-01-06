const { Post, Hashtag, User } = require('../models');

// 이미지 업로드 후 URL을 반환하는 컨트롤러 함수
exports.afterUploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '파일 업로드에 실패했습니다.' });
    }
    res.json({ success: true, img: `${req.file.filename}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '이미지 업로드 처리 중 오류가 발생했습니다.' });
  }
};

// 게시글 업로드
exports.uploadPost = async (req, res) => {
  try {
    if (!req.body.content || !req.body.title) {
      if(!req.body.content)
        return res.status(400).json({ success: false, message: '게시글 본문은 필수사항 입니다.' });
      else if(!req.body.title)
        return res.status(400).json({success:false, message: '게시글 제목은 필수사항 입니다.'});
      else
        return res.status(400).json({success:false, message: '게시글 제목과 본문은 필수사항 입니다.'});
    }
    
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    const userNick = user.nick;

    
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      img: req.body.img || null,
      userId: req.user.id, // 로그인한 사용자의 ID
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
      title: req.body.title || post.title,
      content: req.body.content || post.content, // 기존 값 유지
      img: req.body.url ? req.body.url : (post.img ? post.img : null),
    });

    res.json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '게시글 수정 중 오류 발생' });
  }
};
