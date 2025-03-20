const { Room, User, Message, RoomUsers } = require('../models');

module.exports = (io) => {
  // 소켓 인증 미들웨어
  io.use(async (socket, next) => {
    try {
      console.log("Auth attempt with:", socket.handshake.auth, socket.handshake.query);
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (!token) {
        console.error('No token provided');
        return next(new Error('No token provided'));
      }
      
      const jwt = require('jsonwebtoken');
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decodedToken);
      
      const user = await User.findByPk(decodedToken.id);
      if (!user) {
        console.error('User not found');
        throw new Error('Unauthorized');
      }
      
      socket.userId = user.id;
      console.log('User authenticated:', user.id);
      next(); 
    } catch (error) {
      console.error("Auth error details:", error);
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    console.log(`🔌 New connection: ${socket.id}, userId: ${socket.userId}`);
    
    // 채팅방 입장 핸들러
    socket.on('joinRoom', async (roomId, callback) => {
      try {
        console.log(`시도: 유저 ${socket.userId}가 방 ${roomId}에 입장 요청`);
        
        // 1. 방 존재 여부 확인 및 멤버십 확인
        const room = await Room.findByPk(roomId, {
          include: [{
            model: User,
            as: 'members',
            where: { id: socket.userId },
            required: false
          }]
        });
    
        if (!room) {
          console.log(`방 ${roomId} 찾을 수 없음`);
          if (typeof callback === 'function') {
            callback({ success: false, error: 'Room not found' });
          }
          return socket.emit('error', 'Room not found');
        }
        
        // 2. 사용자가 방에 속해있는지 확인 (members 배열 확인)
        const isMemberOfRoom = room.members && room.members.length > 0;
        
        if (!isMemberOfRoom) {
          console.log(`유저 ${socket.userId}는 방 ${roomId}의 멤버가 아님`);
          if (typeof callback === 'function') {
            callback({ success: false, error: 'Not a room member' });
          }
          return socket.emit('error', 'Not a room member');
        }
    
        // 3. 소켓 룸 가입
        socket.join(roomId);
        console.log(`🚪 User ${socket.userId} joined room ${roomId}`);
    
        // 4. 이전 메시지 전송
        const messages = await Message.findAll({
          where: { roomId },
          include: [{
            model: User,
            attributes: ['id', 'nick', 'profile_pic']
          }],
          order: [['createdAt', 'ASC']]
        });
    
        socket.emit('previousMessages', messages);
    
        if (typeof callback === 'function') {
          console.log(`방 ${roomId} 입장 성공, 콜백 전송`);
          callback({ success: true, roomId });
        } else {
          console.log(`방 ${roomId} 입장 성공, 콜백 없음`);
        }
      } catch (error) {
        console.error("Join room error:", error);
        socket.emit('error', error.message);
        if (typeof callback === 'function') {
          callback({ success: false, error: error.message });
        }
      }
    });

    socket.on('sendMessage', async ({ roomId, content }) => {
      try {
        console.log(`메시지 전송 시도: ${roomId} - ${content}`);
        
        // roomId를 문자열로 변환
        const roomIdStr = String(roomId);
        
        // 1. 방 멤버인지 재확인
        const room = await Room.findByPk(roomId, {
          include: [{
            model: User,
            as: 'members',
            where: { id: socket.userId },
            required: false
          }]
        });
        
        // 디버깅을 위한 로그 추가
        console.log('방 조회 결과:', room ? '찾음' : '찾을 수 없음');
        if (room && room.members) {
          console.log('멤버 수:', room.members.length);
        }
        
        // 멤버가 아니면 오류 메시지 반환
        if (!room || !room.members || room.members.length === 0) {
          console.log(`사용자 ${socket.userId}는 방 ${roomId}에 권한이 없음`);
          return socket.emit('error', 'Not authorized to send messages');
        }
        
        // 소켓이 방에 참여했는지 확인하고, 참여하지 않았다면 참여시킴
        if (!socket.rooms.has(roomIdStr)) {
          socket.join(roomIdStr);
          console.log(`소켓 ${socket.id}가 방 ${roomIdStr}에 참여함`);
        }
        
        // 2. 메시지 저장
        const message = await Message.create({
          content,
          userId: socket.userId,
          roomId
        });
        console.log('메시지 저장됨:', message.id);
        
        // 3. 사용자 정보 조회
        const user = await User.findByPk(socket.userId, {
          attributes: ['id', 'nick', 'profile_pic']
        });
        
        // 4. 해당 방에만 메시지 브로드캐스트 (문자열 roomId 사용)
        const messageData = {
          ...message.toJSON(),
          User: user.toJSON()
        };
        
        console.log(`방 ${roomIdStr}에 메시지 전송:`, messageData);
        io.to(roomIdStr).emit('newMessage', messageData);
        
        // 메시지 전송 성공 응답
        socket.emit('messageSent', { success: true, messageId: message.id });
        
      } catch (error) {
        console.error("Send message error:", error);
        socket.emit('error', error.message);
      }
    });
    

    socket.on('disconnect', () => {
      console.log(`❌ User ${socket.userId} disconnected`);
      // 연결 해제 시 필요한 정리 작업
    });
  });
};
