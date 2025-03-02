module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    // 방 입장 처리
    socket.on('joinRoom', async (roomId) => {
      // 기존 방에서 나가기
      socket.rooms.forEach(room => {
        if (room !== socket.id) socket.leave(room);
      });

      socket.join(roomId);
      console.log(`User joined room ${roomId}`);
    });

    // 메시지 처리
    socket.on('sendMessage', async ({ roomId, content }) => {
      try {
        const message = await Message.create({
          content,
          userId: socket.user.id, // 사용자 정보는 인증에서 가져와야 함
          chatRoomId: roomId
        });

        io.to(roomId).emit('newMessage', message);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};