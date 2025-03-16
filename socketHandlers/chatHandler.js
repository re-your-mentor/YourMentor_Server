// socketHandlers/chatHandler.js
const { Room, User, Message, RoomUsers } = require('../models');

module.exports = (io) => {
  // 소켓 인증 미들웨어
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      // 토큰 검증 로직 (예: JWT)
      const user = await User.findByPk(decodedToken.userId); 
      if (!user) throw new Error('Unauthorized');
      
      socket.userId = user.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User ${socket.userId} connected`);

    // 채팅방 입장 핸들러
    socket.on('joinRoom', async (roomId) => {
      try {
        // 1. 방 존재 여부 확인
        const room = await Room.findByPk(roomId);
        if (!room) {
          return socket.emit('error', 'Room not found');
        }

        // 2. 사용자가 방에 속해있는지 확인
        const isMember = await RoomUsers.findOne({
          where: { userId: socket.userId, roomId }
        });
        
        if (!isMember) {
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

      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    // 메시지 전송 핸들러
    socket.on('sendMessage', async ({ roomId, content }) => {
      try {
        // 1. 방 멤버인지 재확인
        const isMember = await RoomUsers.findOne({
          where: { userId: socket.userId, roomId }
        });

        if (!isMember) {
          return socket.emit('error', 'Not authorized to send messages');
        }

        // 2. 메시지 저장
        const message = await Message.create({
          content,
          userId: socket.userId,
          roomId
        });

        // 3. 사용자 정보 조회
        const user = await User.findByPk(socket.userId, {
          attributes: ['id', 'nick', 'profile_pic']
        });

        // 4. 해당 방에만 메시지 브로드캐스트
        io.to(roomId).emit('newMessage', {
          ...message.toJSON(),
          User: user.toJSON()
        });

      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    // 연결 해제 핸들러
    socket.on('disconnect', () => {
      console.log(`❌ User ${socket.userId} disconnected`);
    });
  });
};