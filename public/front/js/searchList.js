
$(function() {

  //获取上个页面传递过来的数据 并把数据加到input的框中
  var key = getSearch("key");
  //console.log(key);

  $('.lt_search input').val(key);

  //功能1.根据传递过来的key渲染数据 一进入页面就渲染一次
  render();

  //功能2.点击搜索按钮实现搜索功能
  $('.lt_search button').click(function() {
    //console.log(222);
    render();
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
  $('.lt_sort a[data-type]').click(function() {
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
    render();
  });

  function render() {
    // 请求渲染时, 将product结构重置成 loading
    $('.lt_product').html('<div class="loading"></div>');


    var params = {};
    params.proName = $('.lt_search input').val();
    params.page = 1;
    params.pageSize = 100;

  
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
          $('.lt_product').html(template('searchList-tmp', info));
        }
      });
    }, 500);
  }

});