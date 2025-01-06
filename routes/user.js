const express = require('express');
const { verifyToken } = require('../middlewares');
const { updateUser, getUserInfo } = require('../controllers/user');

const router = express.Router();

// PUT /user/fix/:userId - 유저 정보 변경
router.put('/edit/:userId', verifyToken, updateUser);

// GET /user/get/:userId - 유저 정보 읽기
router.get('/get/:userId', getUserInfo);

module.exports = router;
