const { v4: uuidv4 } = require('uuid');

const matchQueue = [];
const users = new Map();
const rooms = new Map();
const express = require('express');
const router = express.Router();

const handleSocket = (io) => {
    io.on('connection', function (socket) {
        console.log(socket.id, ' connected...');
        
        // broadcasting a entering message to everyone who is in the chatroom
        io.emit('msg', `${socket.id} has entered the chatroom.`);
      
        // message receives
        socket.on('msg', function (data) {
            console.log(socket.id,': ', data);
            // broadcasting a message to everyone except for the sender
            socket.broadcast.emit('msg', `${socket.id}: ${data}`);
        });
    
        // user connection lost
        socket.on('disconnect', function (data) {
            io.emit('msg', `${socket.id} has left the chatroom.`);
        });
    });

};

module.exports = handleSocket;
