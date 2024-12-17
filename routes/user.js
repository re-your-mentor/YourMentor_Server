const express = require('express');
const { isLoggedIn, verifyToken } = require('../middlewares');
const { follow, updateUser, getUserInfo, getAllUsers } = require('../controllers/user');

const router = express.Router();

// POST /user/:id/follow - 팔로우 처리
router.post('/:id/follow', isLoggedIn, follow);

// PUT /user/fix/:userId - 유저 정보 변경
router.put('/fix/:userId', verifyToken, isLoggedIn, updateUser);

// PUT /user/get/:userId - 유저 정보 읽기
router.get('/get/:userId', getUserInfo);

// Get /user/get-all - 유저 정보 읽기
router.get('/get-all', verifyToken, isLoggedIn, getAllUsers);

module.exports = router;
