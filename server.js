var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get(['/', '/index'], function (req, res) {
    res.sendFile(__dirname + '/public/client.html');
});

io.on('connection', function(socket){
    console.log('A user connected!');
    socket.on('disconnect', function () {
        console.log('A user disconnected...');
    });
    socket.on('add-album', function (album) {
        console.log(album);
        socket.broadcast.emit('add-album', album);
    });
});

http.listen(80, '127.0.0.1');