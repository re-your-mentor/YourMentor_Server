const express = require('express');
const { verifyToken } = require('../middlewares');
const { updateUser, getUserInfo, deleteUser } = require('../controllers/user');

const router = express.Router();

// PUT /user/fix/:userId - 유저 정보 변경
router.put('/edit/:userId', verifyToken, updateUser);

// DELETE /user/withdraw - 유저 삭제
router.delete('/withdraw', verifyToken, deleteUser);

// GET /user/profile/:userId - 유저 정보 읽기
router.get('/profile/:userId', getUserInfo);


module.exports = router;
