const express = require('express');
const { renderHashtag, renderMain } = require('../controllers');
const { processImage, afterUploadImage } = require('../controllers/upload');
const { verifyToken } = require('../middlewares');
const fs = require('fs');
const multer = require('multer')

const router = express.Router();

// uploads 폴더 생성
try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

// Multer 설정
const storage = multer.memoryStorage(); // 메모리 저장 (sharp 적용 위해)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});

// POST upload/img - 이미지 업로드
router.post('/upload/img', verifyToken, upload.single('img'), processImage, afterUploadImage);

// GET 
router.get('/', renderMain);

// GET /hashtag
router.get('/hashtag', renderHashtag);

module.exports = router;
