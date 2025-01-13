const express = require('express');
const { verifyToken } = require('../middlewares');
const {} = require('../controllers/user');
const handleSocket = require('../controllers/socket');
const { Server } = require('socket.io');
//const io = require('../app');

const router = express.Router();

// const io = new Server(server, {
//   cors: {
//       origin: "*",
//       methods: ["GET", "POST"]
//   }
// });

// GET /chat - 채팅 시작
//router.get('/', verifyToken, handleSocket(io));

module.exports = router;
