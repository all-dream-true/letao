
$(function() {

  $('#btnLogin').click(function() {
    //console.log(222);

    var username = $('[name=username]').val();
    var password = $('[name=password]').val();

    if(!username) {
      mui.toast("请输入用户名");
      return;
    }
    if(!password) {
      mui.toast("请输入密码");
      return;
    }

    $.ajax({
      type: 'post',
      url: '/user/login',
      data: {
        username: username,
        password: password
      },
      success: function(info) {
        console.log(info);
        if(info.error) {
          mui.toast('用户名或密码错误');
        }

        if(info.success) {
          //登录成功需要跳转
          //被拦截过来的需要跳转回之前的 那个网页
          if(location.search.indexOf('retUrl') != -1) {
            location.href = location.search.replace('?retUrl=', '');
          }else {
            //没有拦截过来的地址
            location.href = 'user.html';
          }
        }
      }
    });
  });
});
