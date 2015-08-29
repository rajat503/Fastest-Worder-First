var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

var nicks = [];
var numClients = 0;
var sockets = [];

app.get('/', function (req,res) {
    res.send('./public/index.html');
});

server.listen(8081);
console.log("Listening at 8081");

io.on('connection', function(socket){
  console.log('A user has connected.');
  socket.on('nick', function(data) {

        nicks.push(data);
        sockets.push(socket);
        numClients++;

        if(numClients % 2 != 0) {
            socket.emit('callback', {done: "First User", data: data});
        } else {
            sockets[numClients - 2].emit('callback', {done: "Second User", data: data});
            socket.emit('callback', {done: "Second User", data: data});
        }


   });
});
