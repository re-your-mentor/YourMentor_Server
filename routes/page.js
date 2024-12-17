const express = require('express');
const {
  renderHashtag, renderMain, getPostWithComments
} = require('../controllers/page');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user?.Followers?.length || 0;
  res.locals.followingCount = req.user?.Followings?.length || 0;
  res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
  next();
});

// GET 
router.get('/', renderMain);


// GET /hashtag
router.get('/hashtag', renderHashtag);

// GET /{id}
router.get('/:id', getPostWithComments);

module.exports = router;
