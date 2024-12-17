const express = require('express');
const { verifyToken } = require('../middlewares');
const { createToken, tokenTest } = require('../controllers/token');

const router = express.Router();

// POST /token - JWT 토큰 생성
router.post('/token', createToken);

// GET /test - JWT 토큰 검증
router.get('/test', verifyToken, tokenTest);

module.exports = router;
