const express = require('express');
const {
  renderHashtag, renderMain, getPostWithComments
} = require('../controllers');

const router = express.Router();

// GET 
router.get('/', renderMain);

// GET /hashtag
router.get('/hashtag', renderHashtag);

module.exports = router;
