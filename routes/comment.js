const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares');
const { 
    getCommentsByPostId, 
    createComment } = require('../controllers/comment');

// 댓글 생성( & 대댓글) /comment/
router.post('/', verifyToken, createComment);

// 조회 /comment/:postId
//router.get('/', getCommentsByPostId);

// 댓글 삭제
//router.delete(':commentId',verifyToken);

module.exports = router;