const express = require('express');
const router = express.Router();
const { createComment, getComment, updateComment, deleteComment } = require('../controllers/comment');
const { isLoggedIn, verifyToken } = require('../middlewares');

// 댓글 생성 (Create)
router.post('/', verifyToken, isLoggedIn, createComment);

// 게시글에 대한 댓글 조회 (Read)
router.get('/post/:postId', verifyToken, getComment);

// 댓글 삭제 (Delete)
router.delete('/delete/:commentId', verifyToken, isLoggedIn, deleteComment);

module.exports = router;
