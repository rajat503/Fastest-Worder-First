$(document).ready(function() {
    var d = new Date();
    var hours = d.getHours();
    var message;
    if(hours >= 4 && hours < 12) {
        message = "Good Morning";
    } else if(hours < 16) {
        message = "Good Afternoon";
    } else if(hours <= 23) {
        message = "Good Evening";
    } else {
        message = "Up so late? Cool."
    }
    $('#welcomeTag').text(message);
    var myInput = document.getElementById('answerField');
    myInput.onpaste = function(e) {
        e.preventDefault();
    }
});
