const path = require('path');
const Sequelize = require('sequelize');
const { sequelize } = require('../models'); // Sequelize 인스턴스 가져오기
const fs = require('fs');
const { Post, Hashtag, User, Room, Message } = require('../models');

exports.makeChatRoom = async (req, res) => {
  try {
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (user.hasRoom) {
      return res.status(400).json({ error: 'You already have a room' });
    }

    // 1. 방 생성
    const room = await Room.create({
      name: req.body.name,
      description: req.body.description,
      userId: user.id
    });

    console.log(room);

    // 2. 해시태그 연결
    if (req.body.hashtag && Array.isArray(req.body.hashtag)) {
      const hashtagIds = req.body.hashtag.map(Number);
      const hashtags = await Hashtag.findAll({
        where: { id: hashtagIds }
      });
      await room.addHashtags(hashtags);
    }

    // 3. 생성된 방 정보 + 해시태그 조회
    const roomWithHashtags = await Room.findByPk(room.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'email', 'nick', 'profile_pic'] // ✅ 필요한 필드만 선택
        },
        {
          model: Hashtag,
          as: 'hashtags',
          through: { attributes: [] } // 중간 테이블 필드 제외
        }
      ]
    });

    await user.update({ hasRoom: true });
    res.json({ room: roomWithHashtags });
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllChatRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 1. 사용자의 해시태그 조회
    const user = await User.findByPk(userId, {
      include: [{
        model: Hashtag,
        as: 'Hashtags',
        through: { attributes: [] }
      }]
    });

    const userHashtagIds = user.Hashtags.map(hashtag => hashtag.id); // 사용자의 해시태그 ID 배열

    // 2. 여러 검색어 분리 및 OR 조건 생성
    const searchTerm = req.query.search || '';
    const searchTerms = searchTerm.split(',').map(term => term.trim()); // 쉼표로 구분된 검색어를 배열로 분리
    const hashtagCondition = searchTerms.length > 0
      ? {
        [Sequelize.Op.or]: searchTerms.map(term => ({
          name: { [Sequelize.Op.like]: `%${term}%` }
        }))
      }
      : {};

    // 3. 방 목록 조회
    const rooms = await Room.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['nick']
        },
        {
          model: Hashtag,
          as: 'hashtags',
          where: hashtagCondition, // 해시태그 이름으로 필터링 (OR 조건)
          through: { attributes: [] }
        }
      ],
      order: userHashtagIds.length > 0
        ? [
          [Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM ChatroomHashtag 
              WHERE ChatroomHashtag.roomId = Room.id 
              AND ChatroomHashtag.hashtagId IN (${userHashtagIds.join(',')})
            )`), 'DESC']
        ]
        : [['createdAt', 'DESC']], // 해시태그가 없는 경우, 생성일자 기준 정렬
      limit: limit,
      offset: offset
    });

    // 4. 총 방 수 조회
    const totalRooms = await Room.count({
      include: [{
        model: Hashtag,
        as: 'hashtags',
        where: hashtagCondition // 해시태그 이름으로 필터링 (OR 조건)
      }]
    });

    // 5. 응답 반환
    res.json({
      rooms,
      totalRooms,
      totalPages: Math.ceil(totalRooms / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching rooms:', error); // 에러 로그
    res.status(500).json({ error: error.message });
  }
};

exports.editChatRoom = async (req, res) => {
  const transaction = await sequelize.transaction(); // 트랜잭션 시작
  try {
    const roomId = req.params.id;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: '방 ID가 제공되지 않았습니다.'
      });
    }

    const room = await Room.findOne({
      where: { id: roomId },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['nick', 'email', 'profile_pic']
        },
        {
          model: Hashtag,
          as: 'hashtags',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ],
      transaction // 트랜잭션 적용
    });

    // 1. 방이 존재하지 않는 경우
    if (!room) {
      await transaction.rollback(); // 트랜잭션 롤백
      return res.status(404).json({
        success: false,
        message: '수정할 채팅방을 찾을 수 없습니다.'
      });
    }

    // 2. 수정 권한이 없는 경우
    if (!req.user || room.userId !== req.user.id) {
      await transaction.rollback(); // 트랜잭션 롤백
      return res.status(403).json({
        success: false,
        message: '채팅방 수정 권한이 없습니다.'
      });
    }

    // 3. 방 이름 및 설명 업데이트
    await room.update({
      name: req.body.name || room.name,
      description: req.body.description || room.description
    }, { transaction });

    // 4. 해시태그 업데이트
    if (req.body.hashtags && Array.isArray(req.body.hashtags)) {
      // 기존 해시태그 관계 제거
      await room.setHashtags([], { transaction });

      // 새로운 해시태그 관계 설정
      const hashtags = await Hashtag.findAll({
        where: { id: req.body.hashtags },
        transaction // 트랜잭션 적용
      });

      if (hashtags.length > 0) {
        await room.setHashtags(hashtags, { transaction });
      }
    }

    // 5. 업데이트된 방 정보 반환 (해시태그 포함)
    const updatedRoom = await Room.findByPk(room.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['nick', 'email', 'profile_pic']
        },
        {
          model: Hashtag,
          as: 'hashtags',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ],
      transaction // 트랜잭션 적용
    });

    await transaction.commit(); // 트랜잭션 커밋
    res.json({ success: true, room: updatedRoom });
  } catch (error) {
    await transaction.rollback(); // 트랜잭션 롤백
    console.error('Error updating room:', error); // 에러 로그
    res.status(500).json({ error: error.message });
  }
};

exports.deleteChatRoom = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const roomId = req.params.id;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: '방 ID가 제공되지 않았습니다.'
      });
    }

    const room = await Room.findOne({
      where: { id: roomId },
      transaction
    });

    if (!room) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: '삭제할 채팅방을 찾을 수 없습니다.'
      });
    }

    if (!req.user || room.userId !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: '채팅방 삭제 권한이 없습니다.'
      });
    }

    // Room 삭제 시 연관된 데이터도 자동으로 삭제되도록 설정
    await room.destroy({ transaction });

    await transaction.commit();
    res.json({ success: true, message: '채팅방이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting room:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.joinChatRoom = async (req, res) => {
  try {
    const userId = req.params.id;

    const room = await Room.findByPk(userId);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    if (room.userId == userId)
      return res.status({ error: 'creator is same as person who wants to join ' });

    // 여기에 참여 로직 추가 (예: 참여자 목록 관리)
    res.json({ message: 'Joined room successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}