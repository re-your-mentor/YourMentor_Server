const express = require('express');
const multer = require('multer');
const fs = require('fs');

const { getPostWithComments } = require('../controllers/comment');
const { 
  processImage, 
  afterUploadImage, 
  uploadPost, 
  updatePost, deletePost 
} = require('../controllers/post');
const { addPostLike, removePostLike } = require('../controllers/like');
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

// POST /post/img - 이미지 업로드
router.post('/img', verifyToken, upload.single('img'), processImage, afterUploadImage);

// POST /post - 게시글 생성
const upload2 = multer(); // multer()를 실행해서 인스턴스 생성
router.post('/', verifyToken, upload2.none(), uploadPost);

// GET /post/:id - 게시글 세부조회 
router.get('/:id', getPostWithComments);

// PUT /post/:id - 게시글 수정
router.put('/:id', verifyToken, updatePost);

// DELETE /post/:id - 게시글 삭제
router.delete('/:id', verifyToken, deletePost);

module.exports = router;
