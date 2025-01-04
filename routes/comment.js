const express = require('express');
const router = express.Router();
const { createComment, getComment, updateComment, deleteComment } = require('../controllers/comment');
const { verifyToken } = require('../middlewares');

// 댓글 생성 (Create)
router.post('/', verifyToken, createComment);

// 게시글에 대한 댓글 조회 (Read)
router.get('/post/:postId', verifyToken, getComment);

// 댓글 삭제 (Delete)
router.delete('/delete/:commentId', verifyToken, deleteComment);

module.exports = router;
