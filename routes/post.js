const express = require('express');
const multer = require('multer');
const fs = require('fs');

//const {  } = require('../controllers');
const { 
  uploadPost, getPostWithComments,
  updatePost, deletePost 
} = require('../controllers/post');
const { addPostLike, removePostLike } = require('../controllers/like');
const { verifyToken } = require('../middlewares');

const router = express.Router ({ mergeParams: true }); // 상위 라우트의 params를 병합

// POST /post - 게시글 생성
const upload2 = multer(); // multer()를 실행해서 인스턴스 생성
router.post('/', verifyToken, upload2.none(), uploadPost);

// GET /post/:id - 게시글 세부조회 
router.get('/:id', getPostWithComments); // getPostWithComments가 undefined인지 확인

// PUT /post/:id/like
router.put('/:postId/like', verifyToken, addPostLike);

// DELETE /post/:id/like
router.delete('/:postId/like', verifyToken, removePostLike);

// PUT /post/:id - 게시글 수정
router.put('/:id', verifyToken, updatePost);

// DELETE /post/:id - 게시글 삭제
router.delete('/:id', verifyToken, deletePost);

module.exports = router;