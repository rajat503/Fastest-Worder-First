$(document).ready(function() {

    $('#loadingDiv').hide();
    $('#gameOn').hide();
    $('#gamePlay').hide();
    $('#result').hide();
    $('#scores').hide();
    var firstUser=0;
    var score=0;
    var otherScore=0;
    var scoreset=0;
    var otherScoreset=0;

    console.log("Ready.");

    var socket = io.connect('http://localhost:8081');

    $('#submitButton').on('click', function(e) {
        e.preventDefault();
        $('#formDiv').hide();
        socket.emit('nick', $('#nameField').val()
        );
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
    socket.on('demandanswers', function(data){
        socket.emit('answers', $('#answerField').val());
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
        score=data.score;
        otherScoreset=1;
        $("#scores").append("<h4 id='oppScore'>"+otherScore+"</h4>");
        checkVictory();
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
