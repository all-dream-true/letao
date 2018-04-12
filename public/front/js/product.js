

$(function() {


  //根据地址栏获取的参数productId
  //根据productId发送ajax请求

  var productId = getSearch("productId");
  $.ajax({

    type: 'get',
    url: '/product/queryProductDetail',
    data: {id: productId},
    success: function(info) {
      console.log(info);
      var htmlStr = template('tmp', info);
      $('#productDetil').html(htmlStr);

      //初始化轮播图
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
      });

      //初始化计数器input
      mui('.mui-numbox').numbox();

    }
  });

  //选择尺码功能
  $('.lt_main').on('click','.lt_pro_size span', function() {
    //console.log(11);
    $(this).addClass('current').siblings().removeClass('current');
  });

  //加入购物车功能
  //1.给按钮注册点击事件
  //2.获取用户选择的尺码和数量
  //3.发送ajax请求加入购物车，
        //(1)如果没有登录，跳转到登录页面
        //(2)如果登录了，加入购物车成功，并弹出提示框

  $('.add_cart').click(function() {
    //console.log(999);
    var size = $('.lt_pro_size span.current').text();
    var num = $('.mui-numbox input').val();
    //console.log(size,num);

    $.ajax({
      type: 'post',
      url: '/cart/addCart',
      data: {
        productId: productId,
        num: num,
        size: size
      },
      success: function(info) {
        console.log(info);
        if(info.success) {
          mui.confirm("添加成功", "温馨提示", ["去购物车", "继续浏览"], function(e) {
            //console.log(e);
            if(e.index === 0) {
              location.href = "cart.html";
            }
          });

        }

        //如果没有登录d
        if(info.error === 400) {
          location.href = 'login.html?retUrl='+location.href;
        }
      }
    });
  });
});