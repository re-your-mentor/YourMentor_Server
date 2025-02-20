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