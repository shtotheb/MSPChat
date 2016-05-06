var socket = io();
$('#send-message-btn').click(function () {
    var msg = $('#message-box').val();
    var usr = $('#username-box').val();
    socket.emit('chat', msg, usr);
    $('#messages').append($('<p>').text(usr + ": " + msg));
    $('#message-box').val('');
    return false;
});
socket.on('chat', function (msg, usr) {
    $('#messages').append($('<p>').text(usr + ": " + msg));
});