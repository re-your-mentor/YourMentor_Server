const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares');
const { 
    createComment,
    deleteComment
} = require('../controllers/comment');

// 댓글 생성( & 대댓글) comment/
router.post('/', verifyToken, createComment);

// DELETE /comment/{commentId}
router.delete('/:id', verifyToken, deleteComment);

module.exports = router;