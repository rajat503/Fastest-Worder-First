$(document).ready(function() {

    $('#loadingDiv').hide();
    $('#gameOn').hide();
    $('#gamePlay').hide();
    $('#result').hide();
    $('#scores').hide();
    $('#discon').hide();
    var firstUser=0;
    var score=0;
    var otherScore=0;
    var scoreset=0;
    var otherScoreset=0;

    console.log("Ready.");

    var socket = io.connect('http://10.3.14.107:8081');

    $('#submitButton').on('click', function(e) {
        e.preventDefault();
        $('#formDiv').hide();
        socket.emit('nick', $('#nameField').val());
        $('#formDiv').remove();
    });

    socket.on('callback', function(data) {
        if(data.done === "First User") {
            $('#loadingDiv').show();
            firstUser=1;
        } else {
            $('#loadingDiv').hide();
            $('#gameOn').show();
        }
    });
    socket.on('letter', function(data) {
             $('#gameOn').hide();
             $('#gamePlay').show();
             $("#gamePlay").append("<h4>"+data.alpha+"</h4>");
    });
    socket.on('opponent', function(data) {
             $("#gamePlay").append("<h4> Opponent: "+data.nick+"</h4>");
    });

    socket.on('demandanswers', function(data){
        socket.emit('answers', {answers: $('#answerField').val(), first: firstUser});
        $('#gamePlay').hide();
        $('#scores').show();
    });
    socket.on('score', function(data){
        score=data.score;
        scoreset=1;
        $("#scores").append("<h4 id='ownScore'>"+score+"</h4>");
        checkVictory();
    });
    socket.on('otherScore', function(data){
        otherScore=data.score;
        otherScoreset=1;
        $("#scores").append("<h4 id='oppScore'>"+otherScore+"</h4>");
        checkVictory();
    });
    socket.on('disconnecteduser', function(data){
        $('#discon').show();
        $('#gamePlay').hide();
        socket.close();
    });
    function checkVictory()
    {
        if(otherScoreset==1 && scoreset==1)
        {
            $('#result').show();
            if(otherScore>score)
            {
                $("#result").append("<h4> You Lose </h4>");
            }
            if(otherScore<score)
            {
                $("#result").append("<h4> You Win </h4>");
            }
            if(otherScore==score)
            {
                $("#result").append("<h4> Game Tied </h4>");
            }
        }
    }
});
