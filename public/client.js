angular.module('socketsApp', [])
    .controller('socketsController', function ($scope) {
        
        var socket = io();
        
        $scope.newArtist = null;
        $scope.newTitle = null;
        $scope.albums = [];
        $scope.addAlbum = function () {
            var album = {
                artist: $scope.newArtist,
                title: $scope.newTitle
            };
            socket.emit('add-album', album);
            $scope.albums.push(album);
            $scope.newArtist = null;
            $scope.newTitle = null;
        };
        
        socket.on('add-album', function (album) {
            $scope.$apply(function () {
                $scope.albums.push(album);
            });
        });
    });