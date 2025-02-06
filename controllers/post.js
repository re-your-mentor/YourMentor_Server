const sharp = require('sharp');
const path = require('path');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const { Post, Hashtag, User } = require('../models');

// 이미지 업로드 후 URL을 반환하는 컨트롤러 함수
exports.afterUploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '업로드한 파일이 존재하지 않습니다.' });
    }
    res.json({ success: true, img: `${req.file.filename}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '이미지 업로드 처리 중 오류가 발생했습니다.' });
  }
};

// 2️⃣ 이미지 처리 미들웨어 (sharp 사용하여 자동 압축 & 저장)
exports.processImage = async (req, res, next) => {
  if (!req.file) return next(); // 파일 없으면 패스

  try {
    const fileExt = path.extname(req.file.originalname); // 확장자 추출
    const randomName = crypto.randomBytes(10).toString('hex'); // 랜덤 파일명
    const fileName = `${randomName}${fileExt}`;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);

    await sharp(req.file.buffer)
      .resize({ width: 800 }) // 최대 너비 800px로 조정
      .jpeg({ quality: 70 }) // JPEG 변환 & 품질 70%
      .toFile(filePath); // 저장

    req.file.filename = fileName; // 저장된 파일명 추가
    req.file.path = filePath; // 경로 추가
    next();
  } catch (error) {
    console.error('이미지 처리 중 오류 발생:', error);
    return res.status(500).json({ error: '이미지 처리 실패' });
  }
}

exports.uploadPost = async (req, res) => {
  try {
    // 필수 필드 검증
    if (!req.body.content || !req.body.title) {
      return res.status(400).json({ success: false, message: '게시글 제목과 본문은 필수사항 입니다.' });
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId);
    const userNick = user.nick;

    // 게시글 생성
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      img: req.body.img || null,
      userId,
      user_nick: userNick,
    });

    // 해시태그 처리
    if (req.body.hashtags && Array.isArray(req.body.hashtags)) {
      const hashtagIndexes = req.body.hashtags.map(Number); // 문자열을 숫자로 변환
      console.log('Hashtag IDs:', hashtagIndexes);

      // 해시태그 조회
      const existingTags = await Hashtag.findAll({
        where: { id: { [Sequelize.Op.in]: hashtagIndexes } }, // 'in' 조건 사용
        logging: console.log, // SQL 쿼리 로그 출력
      });

      console.log('Found hashtags:', existingTags);

      // 게시글과 해시태그 관계 설정 (관계 테이블에 자동으로 추가됨)
      if (existingTags.length > 0) {
        await post.addHashtags(existingTags); // addHashtags는 자동으로 관계 테이블을 처리합니다.
      }
    }

    // 해시태그 포함하여 응답 반환
    const postWithHashtags = await Post.findByPk(post.id, {
      include: [{ model: Hashtag, through: { attributes: [] } }],
    });

    res.json({ success: true, post: postWithHashtags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '게시글 업로드 중 오류가 발생했습니다.' });
  }
};

// 게시글 수정
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
      include: [{ model: Hashtag }], // 해시태그 관계 포함
    });

    if (!post) {
      return res.status(404).json({ success: false, message: '수정할 게시글을 찾을 수 없습니다.' });
    }

    if (!req.user || post.userId !== req.user.id) {
      console.log(req.user, post.userId);
      return res.status(403).json({ success: false, message: '게시글 수정 권한이 없습니다.' });
    }

    // 게시글 기본 정보 업데이트
    await post.update({
      title: req.body.title || post.title,
      content: req.body.content || post.content,
      img: req.body.img ? req.body.img : (post.img ? post.img : null),
    });

    // 해시태그 업데이트
    if (req.body.hashtags && Array.isArray(req.body.hashtags)) {
      // 기존 해시태그 관계 제거
      await post.setHashtags([]);

      // 새로운 해시태그 관계 설정
      const hashtags = await Hashtag.findAll({
        where: { id: req.body.hashtags }, // 요청으로 받은 해시태그 ID로 검색
      });
      await post.setHashtags(hashtags); // 새로운 해시태그 관계 설정
    }

    // 업데이트된 게시글 정보 반환 (해시태그 포함)
    const updatedPost = await Post.findOne({
      where: { id: req.params.id },
      include: [{ model: Hashtag }], // 해시태그 관계 포함
    });

    res.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '게시글 수정 중 오류 발생' });
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
