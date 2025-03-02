const express = require('express');
const { verifyToken } = require('../middlewares');
const { makeChatRoom, 
    getAllChatRooms, 
    editChatRoom,
    deleteChatRoom, 
    joinChatRoom
} = require('../controllers/chat');
const router = express.Router();

// POST
router.post('/rooms', verifyToken, makeChatRoom);

// GET
router.get('/rooms', getAllChatRooms);

// PUT
router.put('/rooms', verifyToken, editChatRoom);

// DELETE
router.delete('/rooms', verifyToken, deleteChatRoom);


// POST
router.post('/rooms/:id/join', verifyToken, joinChatRoom);
   


module.exports = router;