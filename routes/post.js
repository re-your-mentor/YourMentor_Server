const express = require('express');
const multer = require('multer');
const fs = require('fs');

const { getPostWithComments } = require('../controllers/');
const { 
  processImage, 
  afterUploadImage, 
  uploadPost, 
  updatePost, deletePost} = require('../controllers/post');
const { verifyToken } = require('../middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const storage = multer.memoryStorage(); // 메모리 저장 (sharp 적용 위해)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});

// GET /post
router.get('/:id', getPostWithComments);

// POST /post/img
router.post('/img', verifyToken, upload.single('img'), processImage, afterUploadImage);

// POST /post
const upload2 = multer(); // multer()를 실행해서 인스턴스 생성
router.post('/', verifyToken, upload2.none(), uploadPost);

// PUT /post/:id
router.put('/:id', verifyToken, updatePost);

// DELETE /post/:id
router.delete('/:id', verifyToken, deletePost);

module.exports = router;
