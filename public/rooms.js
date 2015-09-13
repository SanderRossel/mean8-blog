angular.module('roomsApp', [])
    .controller('roomsController', function ($scope) {
        
        var socket = io();
        
        $scope.rooms = [];
        $scope.joinedRooms = [];
        $scope.newRoom = null;
        
        var findRoom = function (arr, name) {
            return arr.filter(function (r) {
                return r.name == name;
            });
        }
        
        $scope.createRoom = function () {
            var room = {
                name: $scope.newRoom,
                newMessage: '',
                messages: []
            };
            socket.emit('add-room', room);
            $scope.rooms.push(room);
            $scope.joinedRooms.push(room);
            $scope.newRoom = null;
        };
        
        $scope.joinRoom = function(room) {
            if (findRoom($scope.joinedRooms, room.name).length == 0) {
                $scope.joinedRooms.push(room);
                socket.emit('join-room', room.name);
            }
        };
        
        $scope.leaveRoom = function (room) {
            $scope.joinedRooms.splice($scope.joinedRooms.indexOf(room), 1);
            socket.emit('leave-room', room.name);
        };
        
        $scope.sendMessage = function (room) {
            room.messages.push(room.newMessage);
            socket.emit('send-message', {
                roomName: room.name,
                message: room.newMessage
            });
            room.newMessage = null;
        };
        
        socket.on('add-room', function (room) {
            if (findRoom($scope.rooms, room.name).length == 0) {
                $scope.$apply(function () {
                    $scope.rooms.push(room);
                });
            }
        });
        
        socket.on('receive-message', function (message) {
            $scope.$apply(function () {
                var rooms = findRoom($scope.joinedRooms, message.roomName);
                if (rooms) {
                    rooms[0].messages.push(message.message);
                };
            });
        });
    });