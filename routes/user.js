const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../middlewares');
const { 
    updateUserNick, 
    getUserInfo, 
    deleteUser, 
    updateUserProfile } = require('../controllers/user');

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
  //5MB
  limits: { fileSize: 5 * 1024 * 1024 },
});

// PUT /user/edit/:userId - 유저 닉네임 변경
router.put('/edit/:userId', verifyToken, updateUserNick);

// PUT /user/edit/:userId - 유저 프로필 사진 변경
router.put('/edit/:userId', verifyToken, updateUserProfile);

// DELETE /user/withdraw - 유저 삭제
router.delete('/withdraw', verifyToken, deleteUser);

// GET /user/profile/:userId - 유저 정보 읽기
router.get('/profile/:userId', getUserInfo);


module.exports = router;
