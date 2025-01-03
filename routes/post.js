const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost, updatePost, deletePost } = require('../controllers/post');
const { isLoggedIn, verifyToken } = require('../middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /post/img
router.post('/img', verifyToken, isLoggedIn, upload.single('img'), afterUploadImage);

// POST /post
const upload2 = multer();
router.post('/', verifyToken, isLoggedIn, upload2.none(), uploadPost);

// PUT /post/:id
router.patch('/:id', verifyToken, isLoggedIn, updatePost);

// DELETE /post/:id
router.delete('/:id', verifyToken, isLoggedIn, deletePost);

module.exports = router;
