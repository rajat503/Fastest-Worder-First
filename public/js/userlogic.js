$(document).ready(function() {

    $('#loadingDiv').hide();
    $('#gameOn').hide();
    $('#gamePlay').hide();
    $('#progressBar').hide();
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
        } else {
            Materialize.toast("Name is required", 1500 )
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
             $('#progressBar').show();
             $("#letterAssigned").text(data.alpha);
            //  var count=180;
            //  var counter=setInterval(timer, 333.33);
            //  function timer() {
            //    count=count-1;
            //    if (count <= 0) {
            //       clearInterval(counter);
            //       return;
            //    }
            //    $('.determinate').css('width', (count*5/9)+"%");
            //  }

             var div = $('#my-div');
             var leftValue = 0;
             var interval = 100;
             var before = new Date();

             var counter = setInterval(function() {
                now = new Date();
                var elapsedTime = (now.getTime() - before.getTime());
                 $('.determinate').css('width', ((60-(elapsedTime/1000))*5/3)+"%");
                if(elapsedTime >= 60000) {
                    clearInterval(counter);
                }
             }, interval);
    });

    socket.on('opponent', function(data) {
             $("#opponentName").text(data.nick);
             oppname=data.nick;
    });

    socket.on('demandanswers', function(data){
        socket.emit('answers', {answers: $('#answerField').val(), first: firstUser});
        $('#gamePlay').hide();
        $('#progressBar').hide();
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
            $('#progressBar').hide();
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
                $("#whoWon").css('color', '#bf360c');
                $("#whoWon").text("You Lose.");
            }
            if(otherScore<score)
            {
                $("#whoWon").css('color', '#00e676');
                $("#whoWon").text("You Win!");
            }
            if(otherScore==score)
            {
                $("#whoWon").text("Game Tied!");
            }
        }
    }
});
