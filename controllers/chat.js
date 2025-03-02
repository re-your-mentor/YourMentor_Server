const path = require('path');
const Sequelize = require('sequelize');
const fs = require('fs');
const { Post, Hashtag, User } = require('../models');

exports.makeChatRoom = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findByPk(userId);

  try {
    if (user.hasRoom) {
      return res.status(400).json({ error: 'You already have a room' });
    }

    const newRoom = await ChatRoom.create({
      roomName: req.body.name,
      hashtags: req.body.hashtags,
      creatorId: user.id,
      createrName: user.name
    });

    await user.update({ hasRoom: true });
    res.json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.getAllChatRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.findAll({
      include: [{
        model: User,
        as: 'creator',
        attributes: ['username']
      }],
      where: {
        name: {
          [Sequelize.Op.like]: `%${req.query.search || ''}%`
        }
      }
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.editChatRoom = async (req, res) => {
  
}

exports.deleteChatRoom = async (req, res) => {

}

exports.joinChatRoom = async (req, res) => {
  try {
    const room = await ChatRoom.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    // 여기에 참여 로직 추가 (예: 참여자 목록 관리)
    res.json({ message: 'Joined room successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}