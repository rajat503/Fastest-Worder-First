var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');

app.use(express.static(__dirname + '/public'));

var nicks = [];
var numClients = 0;
var sockets = [];
var letter = [];
var dictionary = fs.readFileSync('dictionary.txt').toString().toUpperCase().split("\n");
dictionary.pop();

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
            }, 60000);
        }
   });

   socket.on('disconnect', function()
   {
        var i=sockets.indexOf(socket);
        if(i==-1)
        {
            return;
        }
        if(i%2==0 && sockets[i+1]!==undefined)
        {
            sockets[i+1].emit("disconnecteduser", nicks[i]);
        }
        else {
            if(i%2==1)
            {
                sockets[i-1].emit("disconnecteduser", nicks[i]);
            }
            else {
                nicks.pop();
                sockets.pop();
                numClients--;
            }
        }

   });

   socket.on('answers', function(data){
       var i=sockets.indexOf(socket);
       var score=0;
       var answers=data.answers.toString().toUpperCase().split("\n");
       for( j in answers)
       {
           var present=0;
           if(answers[j].substring(0,1)===letter[i])
           {
               var flag=0;
               for(k=0;k<j;k++)
               {
                   if(answers[j]===answers[k])
                   {
                       flag=1;
                       break;
                   }
               }
               if(flag===0)
               {
                  var mid=Math.floor(dictionary.length/2);
                  var l=0,u=dictionary.length;
                  do {
                      if(dictionary[mid]===answers[j])
                      {
                          present=1;
                          break;
                      }
                      if(dictionary[mid]>answers[j])
                      {
                          u=mid-1;
                      }
                      else {
                          l=mid+1;
                      }
                      mid=Math.floor((l+u)/2);
                  }
                  while (l<=u);
               }
           }
           if(present===1)
           {
               score++;
           }
     }
     socket.emit("score",{score: score});
     if(data.first==1)
     {
         sockets[i+1].emit("otherScore",{score: score});
     }
     else
     {
         sockets[i-1].emit("otherScore",{score: score});
     }
   });
});
