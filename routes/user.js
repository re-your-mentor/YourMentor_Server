const express = require('express');
const { verifyToken } = require('../middlewares');
const { updateUser, getUserInfo } = require('../controllers/user');

const router = express.Router();

// PUT /user/fix/:userId - 유저 정보 변경
router.put('/edit/:userId', verifyToken, updateUser);

// GET /user/profile/:userId - 유저 정보 읽기
router.get('/profile/:userId', getUserInfo);

// DELETE /user/delete/:userId - 유저 삭제
//router.delete('delete/:userId', );

module.exports = router;
