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

    if (user.hasRoom === true || user.hasRoom === 1) {
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
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    // 1. 사용자 해시태그 조회 (삭제된 것 제외)
    const user = await User.findOne({
      where: { id: userId },
      include: [{
        model: Hashtag,
        as: 'hashtags',
        through: { attributes: [] }
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userHashtagIds = user.hashtags.map(hashtag => hashtag.id);

    // 2. 검색 조건
    const searchTerms = search.split(',').filter(Boolean).map(t => t.trim());
    const hashtagWhere = searchTerms.length ? {
      [Sequelize.Op.or]: searchTerms.map(term => ({
        name: { [Sequelize.Op.like]: `%${term}%` }
      }))
    } : {};

    // 3. 방 목록 조회 (중복 제거 및 삭제된 방 제외)
    const rooms = await Room.findAll({
      distinct: true, // 중복 제거
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'nick', 'profile_pic']
        },
        {
          model: Hashtag,
          as: 'hashtags',
          where: hashtagWhere,
          required: false,
          through: { attributes: [] }
        }
      ],
      order: userHashtagIds.length > 0 ? [
        [Sequelize.literal(`(
          SELECT COUNT(*) 
          FROM ChatroomHashtag 
          WHERE ChatroomHashtag.roomId = Room.id 
          AND ChatroomHashtag.hashtagId IN (${userHashtagIds.join(',')})
        )`), 'DESC'],
        ['createdAt', 'DESC']
      ] : [['createdAt', 'DESC']],
      limit: +limit,
      offset: offset,
      subQuery: false
    });

    // 4. 총 방 수 조회 (별도로 수행)
    const totalRooms = await Room.count({
      include: [{
        model: Hashtag,
        as: 'hashtags',
        where: hashtagWhere,
        required: false
      }]
    });

    // 5. 응답 데이터 구성
    res.json({
      rooms: rooms.map(room => ({
        id: room.id,
        name: room.name,
        description: room.description,
        creator: room.creator,
        hashtags: room.hashtags,
        createdAt: room.createdAt
      })),
      totalRooms,
      totalPages: Math.ceil(totalRooms / limit),
      currentPage: +page
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

    // 4. 해시태그 업데이트 - 수정된 부분
    // req.body.hashtag 또는 req.body.hashtags 중 하나를 사용
    const hashtagIds = req.body.hashtag || req.body.hashtags;
    
    if (hashtagIds && Array.isArray(hashtagIds)) {
      // 숫자로 변환
      const numericIds = hashtagIds.map(Number);
      console.log('해시태그 ID:', numericIds);
      
      // 해시태그 찾기
      const hashtags = await Hashtag.findAll({
        where: { id: numericIds },
        transaction
      });
      
      console.log(`찾은 해시태그: ${hashtags.length}개`);
      
      // 한 번에 관계 설정 (기존 관계는 자동으로 제거됨)
      await room.setHashtags(hashtags, { transaction });
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

    // hasRoom 필드 0으로 업데이트하기
    await User.update({
      hasRoom: 0
    }, {
      where: { id: req.user.id },
      transaction
    });

    await transaction.commit();
    res.json({ success: true, message: '채팅방이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting room:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.joinChatRoom = async (req, res) => {
  const t = await sequelize.transaction(); // 트랜잭션 시작
  try {
    const roomId = req.params.roomId;
    const userId = req.user.id;

    // 1. 채팅방 조회
    const room = await Room.findByPk(roomId, {
      include: [
        { 
          model: User, 
          as: 'members',
          attributes: ['id', 'nick'] 
        },
        { 
          model: User, 
          as: 'creator',
          attributes: ['id', 'nick'] 
        }
      ],
      transaction: t // 트랜잭션 적용
    });

    if (!room) {
      await t.rollback();
      return res.status(404).json({ error: '채팅방을 찾을 수 없습니다' });
    }

    // 2. 사용자 확인
    const user = await User.findByPk(userId, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
    }

    // 3. 참여 여부 확인
    const isMember = room.members.some(member => member.id === userId);
    if (isMember) {
      await t.rollback();
      return res.status(400).json({ error: "이미 참여 중입니다" });
    }

    // 4. 참여자 추가
    await room.addMembers(user, { transaction: t });

    // 5. 성공 응답
    await t.commit(); // 트랜잭션 커밋
    res.json({
      success: true,
      roomId: room.id,
      title: room.name,
      socketEvent: 'joinRoom',
      message: '채팅방 참여 성공. 소켓 연결을 진행해주세요.',
      members: room.members
    });

  } catch (error) {
    await t.rollback(); // 에러 발생 시 롤백
    res.status(500).json({ error: error.message });
  }
};
