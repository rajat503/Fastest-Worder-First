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
    var oppname;

    var socket = io.connect('http://10.3.14.107:8081');

    $('#submitButton').on('click', function(e) {
        e.preventDefault();
        if($('#nameField').val()!="")
        {
            $('#formDiv').hide();
            socket.emit('nick', $('#nameField').val());
            $('#formDiv').remove();
            $('#index-banner').remove();
            $('.not-there-at-first').css('opacity', '1.0');
        }
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
             $("#letterAssigned").text(data.alpha);
    });
    socket.on('opponent', function(data) {
             $("#opponentName").text(data.nick);
             oppname=data.nick;
    });

    socket.on('demandanswers', function(data){
        socket.emit('answers', {answers: $('#answerField').val(), first: firstUser});
        $('#gamePlay').hide();
        $('#scores').show();
    });
    socket.on('score', function(data){
        score=data.score;
        scoreset=1;
        $("#ownScore").text("You scored: "+score);
        checkVictory();
    });
    socket.on('otherScore', function(data){
        otherScore=data.score;
        otherScoreset=1;
        $("#opponentScore").text(oppname+" scored: "+otherScore);
        checkVictory();
    });
    socket.on('disconnecteduser', function(data){
        if(otherScoreset==0 && scoreset==0)
        {
            $('#discon').show();
            $('#gamePlay').hide();
            socket.close();
        }
    });
    function checkVictory()
    {
        if(otherScoreset==1 && scoreset==1)
        {
            $('#result').show();
            if(otherScore>score)
            {
                $("#whoWon").text("You Lose.");
            }
            if(otherScore<score)
            {
                $("#whoWon").text("You Win!");
            }
            if(otherScore==score)
            {
                $("#whoWon").text("Game Tied!");
            }
        }
    }
});
