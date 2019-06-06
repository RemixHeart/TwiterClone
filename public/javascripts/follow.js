$(function(){

  $(document).on('click', '#followBtn', function(e) {
    e.preventDefault();

    var user_id = $('#user_id').val();
    //ajax call to post & change the attributes in the page
    $.ajax({
      type: 'POST',
      url: "/follow/" + user_id,
      success: function(data) {
        $('#follow').removeClass('btn-primary').addClass('btn-link')
          .html('Following').attr('id', 'unfollowBtn');
          location.reload();
      },
      error: function(data) {
        console.log(data);
      }
    });
  });

  $(document).on('click', '#unfollowBtn', function(e) {
    e.preventDefault();

    var user_id = $('#user_id').val();
    $.ajax({
      type: 'POST',
      url: "/unfollow/" + user_id,
      success: function(data) {
        $('#unfollowBtn').removeClass('btn-link').addClass('btn-primary')
          .html('Follow').attr('id', 'followBtn');
          location.reload();  
      },
      error: function(data) {
        console.log(data);
      }
    });
  });

  $(document).on('mouseenter', '#unfollowBtn', function(e) {
    $(this).removeClass('btn-link').addClass('btn-danger').html('Unfollow');
  });

  $(document).on('mouseleave', '#unfollowBtn', function(e) {
    $(this).removeClass('btn-danger').addClass('btn-link').html('Following');
  });

});
