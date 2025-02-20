const express = require('express');

const { verifyToken } = require('../middlewares');
const { makeChatRoom } = require('../controllers/chat');
const router = express.Router();

router.post('/rooms', verifyToken, makeChatRoom);


module.exports = router;