var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get(['/', '/index'], function (req, res) {
    res.sendFile(__dirname + '/public/rooms.html');
});

io.on('connection', function(socket){
    console.log('A user connected!');
    socket.on('disconnect', function () {
        console.log('A user disconnected...');
    });
    socket.on('add-room', function (room) {
        console.log('Added:');
        console.log(room);
        socket.join(room.name);
        socket.broadcast.emit('add-room', room);
    });
    socket.on('join-room', function (roomName) {
        console.log('Joined: ' + roomName);
        socket.join(roomName);
    });
    socket.on('send-message', function (message) {
        console.log('Send:');
        console.log(message);
        socket.broadcast.to(message.roomName).emit('receive-message', message);
    });
    socket.on('leave-room', function (roomName) {
        console.log('Leave: ' + roomName);
        socket.leave(roomName);
    });
});

http.listen(80, '127.0.0.1');