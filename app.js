var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

var nicks = [];
var numClients = 0;
var sockets = [];
var letter = [];

app.get('/', function (req,res) {
    res.send('./public/index.html');
});

server.listen(8081);
console.log("Listening at 8081");

io.on('connection', function(socket){
  console.log('A user has connected.');

  socket.on('nick', function(data) {
        var current=++numClients;
        nicks.push(data);
        sockets.push(socket);
        if(current % 2 != 0) {
            socket.emit('callback', {done: "First User", data: data});
        }
        else {
            sockets[current - 2].emit('callback', {done: "Second User", data: data});
            socket.emit('callback', {done: "Second User", data: data});
            letter[current-2]=String.fromCharCode(65+(Math.floor((Math.random() * 26))));
            letter[current-1]=letter[current-2];
            sockets[current - 2].emit('letter', {alpha: letter[current-2]});
            sockets[current - 1].emit('letter', {alpha: letter[current-2]});
            setTimeout(function()
            {
                sockets[current - 2].emit('demandanswers', {timeover: "yes"});
                sockets[current - 1].emit('demandanswers', {timeover: "yes"});
            }, 61000);

        }
   });

   socket.on('answers', function(data){
       var i=sockets.indexOf(socket);
       var score=computeScore(data.answers);
       socket.emit("score",score : score);
       if(data.first==1)
       {
           sockets[i+1].emit("otherScore",score : score);
       }
       else
       {
           sockets[i-1].emit("otherScore",score: score);
       }
   });
});
