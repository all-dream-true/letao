

$(function() {

  $.ajax({
    type: 'get',
    url: '/user/queryUserMessage',
    success: function(info) {
      console.log(info);

      //如果没登陆回到登录页面
      if(info.error === 400) {
        location.href = 'login.html';
        return;
      }
      $('#userinfo').html(template('userTmp', info));
    }
  });

  //退出功能
  $('#logoutBtn').click(function() {

    $.ajax({
      type: 'get',
      url: '/user/logout',
      success: function(info) {
        console.log(info);

        if(info.success) {
          location.href = 'login.html';
        }
      }
    });
  });
});


