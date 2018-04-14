

$(function() {

  render();
  //请求购物信息并渲染页面
  function render() {

    //重新渲染页面  要将价格重置、
    $('.totalPrice').text('00.00');
    setTimeout(function() {
      $.ajax({
        type: 'get',
        url: '/cart/queryCart',
        success: function(info) {
          //console.log(info);

          $('#productList').html(template("productTmp",{list: info}));

           //需要手动结束下拉刷新
          mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
        }
      });
    }, 500);
  }


  //配置下拉刷新
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识
      down : {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        callback : function() {
          render();
        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      }
    }
  });


  // 删除功能
  // 1. 给删除按钮, 注册点击事件(事件委托)
  // 2. 根据购物车id, 发送删除 ajax 请求
  // 3. 重新渲染, 调用下拉刷新
  $('#productList').on('tap','.btn_delete', function() {
    console.log(1111);

    var id = $(this).data('id');
    mui.confirm("您是否要删除该商品", "温馨提示", ["确认", "取消"], function(e) {
      //console.log(e);
      if (e.index === 0) {
        $.ajax({
          type: 'get',
          url: '/cart/deleteCart',
          data: {id: [id]},
          success: function(info) {
            console.log(info);

            if (info.success) {
              mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
            }
          }
        });
      }
    });
  });





  // 修改功能
  // 1. 给修改按钮, 注册点击事件(事件委托)
  // 2. 将数据存储在 btn_edit 中
  // 3. 弹出确认框, 根据存储在 btn_edit 里面的数据进行渲染确认框
  // 4. 注册选择尺码委托事件, 让用户修改尺码
  // 5. 根据 id, size, num, 进行 ajax 提交, 修改购物车数据
  // 6. 重新刷新页面进行页面的重新加载

  $('#productList').on('tap', '.btn_edit', function() {
    //console.log(22);
    console.log(this.dataset);
    //取得购物车的id
    var id = this.dataset.id;
    var htmlStr = template('editTmp', this.dataset);

    //在把数据传到confirm中之前，先吧数据的/n全部干掉
    htmlStr = htmlStr.replace(/\n/g, '');

    mui.confirm(htmlStr,'编辑商品',['确认', '退出'], function(e) {
      //console.log(e);
      if (e.index === 0) {
        var size = $('.lt_size span.current').text();
        var num = $('.lt_num .mui-numbox-input').val();

        $.ajax({
          type: 'post',
          url: '/cart/updateCart',
          data: {
            id: id,
            size: size,
            num: num
          },
          success: function(info) {
            console.log(info);
            if(info.success) {
              mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
            }
          }
        });
      }
    });
    //进行input数字框的初始化
    mui('.mui-numbox').numbox();

  });

  //选择尺码
  $('body').on('tap', '.lt_pro_size span', function() {
    //console.log(99);
    $(this).addClass('current').siblings().removeClass('current');
  });



  // 计算价格功能
  // 1. 肯定要将 价格 和 数量, 存在 checkbox 中
  // 2. 注册 checkbox 点击事件(事件委托), 获取到所有被选中的 checkbox
  $('#productList').on('change', '.ck', function() {
    //console.log(666);
    console.log($('.ck:checked'));
    var $checks = $('.ck:checked');
    var total = 0;

    //遍历所有被选中的ck  进行计算
    $checks.each(function() {
      console.log(this);

      var price = $(this).data('price');
      var num = $(this).data('num');

      total += price*num;


    });
    //保留两位小数
    total = total.toFixed(2);
    //设置到span中
    $('.totalPrice').text( total );
  });
});

