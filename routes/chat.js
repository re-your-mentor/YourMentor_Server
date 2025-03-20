const express = require('express');
const { verifyToken } = require('../middlewares');
const { makeChatRoom, 
    getAllChatRooms, 
    editChatRoom,
    deleteChatRoom, 
    joinChatRoom
} = require('../controllers/chat');
const router = express.Router();

// POST chat/rooms
router.post('/rooms', verifyToken, makeChatRoom);

// GET chat/rooms
router.get('/rooms', verifyToken, getAllChatRooms);

// PUT chat/rooms
router.put('/rooms/:id', verifyToken, editChatRoom);

// DELETE chat/rooms
router.delete('/rooms/:id', verifyToken, deleteChatRoom);

// POST chat/rooms/:roomId/join
router.post('/rooms/:roomId/join', verifyToken, joinChatRoom); // 경로 수정

module.exports = router;