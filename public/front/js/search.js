

$(function() {

  //进行本地存储操作
  //设定search_list为键名


  //1.  渲染搜索历史记录
  render();

  //用于读取存储本地的历史记录
  function getHistory() {
    //保证将来处理的一定是一个数组
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse(history);

    return arr;
  }


  //用于读取数据进行页面渲染
  function render() {
    var arr = getHistory();

    //模板引擎的渲染需要的是对象  需要把数据包装一下

    $('.lt_history').html(template('searchTmp', {arr:arr}));
  }


  // 功能2: 删除功能, 删除本地历史记录数组里面一项
  $('.lt_history').on('click', '.btn_delete', function() {
    //console.log(222);
    var that = this;
    mui.confirm('你确认要删除么？', '温馨提示', ['确认', '取消'],function(e) {
      //console.log(e);
      //点击确认按钮
      if(e.index === 0) {
        var index = $(that).data('index');
        console.log(index);
        //获取数组
        var arr = getHistory();
        //删除数组中对应的项
        arr.splice(index, 1);
        //修改本地存储search_list
        localStorage.setItem('search_list',JSON.stringify(arr));
        //重新渲染
        render();
        console.log();
      }
    });
  });

  //清空功能
  $('.lt_history').on('click', '.btn_empty', function() {
    //console.log(222);
    // 参数1: 内容
    // 参数2: 标题
    // 参数3: 数组按钮
    // 参数4: 点击按钮后的回调
    mui.confirm('是否要清空所有的历史记录？', '温馨提示', ['确认', '取消'],function(e) {
      //console.log(e);
      if(e.index === 0) {
        //直接删除本地存储
        localStorage.removeItem('search_list');
        //重新渲染页面
        render();
      }
    });
  });


  //功能4：添加功能
  $('.lt_search button').click(function() {
   // console.log(111);
    //获取搜索框中的值
    var key = $('.lt_search input').val().trim();

    if(key === '') {
      //添加搜索提示框
      mui.toast( "请输入搜索关键字" );
      return;
    }
    //获取数组
    var arr = getHistory();
    //要求不能重复，数组的长度不超过10个
    // 不等于 -1, 说明在数组中可以找到 key, 说明重复了, 需要删除
    if(arr.indexOf(key) !== -1) {
      var index = arr.indexOf(key);
      arr.split(index, 1);
    }

    //超过10个要删除最后一项
    if(arr.length >= 10) {
      arr.pop();
    }

    //添加到数组的最前面
    arr.unshift(key);
    //持久化到本地存储中
    localStorage.setItem('search_list', JSON.stringify(arr));
    //重新渲染
    render();
    //清空input框中的值、
    $('.lt_search input').val('');

    //跳转到搜索列表页，将搜索关键字传递到searchList.html页面中去
    location.href = "searchList.html?key=" + key;
  });
});