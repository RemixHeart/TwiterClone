$(function() {
  var socket = io();
  console.log("lololol");
  $('#sendTweet').submit(function() {
    console.log("lololol");
    var content = $('#tweet').val();
    socket.emit('tweet', { content: content}); //send message to socket.io server
    $('#tweet').val(''); //empty out the input field
    return false;
  });

  socket.on('incomingTweets', (data) => {
    var html = '';
    html += '<div class="media">';
    html += '<div class="media-left">';
    html += '<a href="/user/'+ data.user._id + '"><img class="media-object" src="' + data.user.photo + '"></a>';
    html += '</div>';
    html += '<div class="media-body">';
    html += '<h4 class="media-heading">' + data.user.name + '</h4>';
    html += '<p>'+ data.data.content + '</p>';
    html += '</div>';
    html += '</div>';

    $('#tweets').prepend(html);
    console.log(html);
  });
});
