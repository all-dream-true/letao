
$(function() {

  var currentPage = 1;
  var pageSize = 4;
  //渲染
  function render( callback ) {
    // 请求渲染时, 将product结构重置成 loading
    //$('.lt_product').html('<div class="loading"></div>');


    var params = {};
    params.proName = $('.lt_search input').val();
    params.page = currentPage;
    params.pageSize = pageSize;


    //需要排序的话需要传入参数price或者是num,1是升序2是降序
    if($('.lt_sort .current').length > 0) {
      //有高亮的元素需要排序
      var sortName = $('.lt_sort .current').data('type');
      var sortValue = $('.lt_sort .current').find('i').hasClass('fa-angle-down') ? 2 : 1;
      params[sortName] = sortValue;
    }

    setTimeout(function() {
      $.ajax({
        type: 'get',
        url: '/product/queryProduct',
        data: params,
        success: function (info) {
          console.log(info);
          //渲染数据
          callback(info);
        }
      });
    }, 500);
  }

  //获取上个页面传递过来的数据 并把数据加到input的框中
  var key = getSearch("key");
  //console.log(key);

  $('.lt_search input').val(key);

  //功能1.配备上拉加载，下拉刷新
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down : {
        auto: true,//可选,默认false.首次加载自动上拉刷新一次
        callback :function() {
          //重置当前页
          currentPage = 1;
          render(function(info) {
            //用模板引擎渲染
            $('.lt_product').html(template('searchList-tmp', info));
            // 数据渲染完成之后, 需要停止下拉刷新
            // 注意: 文档中有问题, 需要调用 pullRefresh() 生成一个实例,
            // 这个实例可以访问到原型上的 endPulldownToRefresh 方法, 方法可以结束下拉刷新
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            console.log(mui('.mui-scroll-wrapper').pullRefresh());

          });
          console.log( "下拉刷新完成时, 调用的回调函数, 这里面一般发送 ajax 请求, 获取数据, 重新渲染页面" )
        }
      },
      up: {
        callback: function() {
          currentPage++;
          render(function(info) {
            console.log(info);
            if(info.data.length > 0) {
              //说明有数据
              $('.lt_product').append(template('searchList-tmp', info));

              //关闭上拉加载
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
            }else {
              //关闭下拉加载  并将其禁用   因为没有数据了；
              //并让其显示没有数据了
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);

              //重新启动上拉加载
              mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
            }
          });
        }
      }
    }
  });

  //功能2.点击搜索按钮实现搜索功能
  $('.lt_search button').on('tap',function() {
    //console.log(222);
    //执行一次下拉刷新
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    //获取关键字
    var key = $('.lt_search input').val();
    //拿到数组
    var history = localStorage.getItem('search_list') || [];
    arr = JSON.parse(history);
    //不能有重复的
    var index = arr.indexOf(key);
    if (index !== -1) {
      //有重复项 需要删除
      arr.slice(index, 1);
    }
    //长度不能超过10
    if(arr.length >= 10) {
      arr.pop();
    }
    //将key添加到数组中
    arr.unshift(key);
    //更新数组
    localStorage.setItem('search_list', JSON.stringify(arr));
  });


  //3.进行数据的排序
  //给库存和价格添加点击事件
  $('.lt_sort a[data-type]').on('tap',function() {
    //console.log(555);
    // 1. 如果没有 current 类, 自己加上 current 类, 其他去掉 current类
    // 2. 如果有 current 类, 直接切换 i 里面的上下箭头
    if($(this).hasClass('current')) {
      $(this).find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up');
    }else {
      $(this).addClass('current').siblings().removeClass('current');
      //重置所有元素的小箭头
      $('.lt_sort a').find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
    }
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  });



});