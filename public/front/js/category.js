

$(function(){

  //请求左侧一级分类菜单
  $.ajax({
    type: 'get',
    url: '/category/queryTopCategory',
    dataType: 'json',
    success: function(info) {
      //console.log(info);
      var htmlStr = template('leftTmp', info);
      $('.category_left ul').html(htmlStr);

      //刚进入页面默认渲染第一页
      renderById(info.rows[0].id);
    }
  });


  //给左侧一级分类注册点击事件
  $('.category_left ul').on('click', 'a', function() {
    //console.log(333);
    //得到一级分类的id
    var id = $(this).data('id');
    //重新渲染
    renderById(id);
    $(this).addClass("current").parent().siblings().find("a").removeClass("current");

  })

  //根据一级分类的id渲染右侧区域
  function renderById(id) {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategory',
      dataType: 'json',
      data: {
        id: id
      },
      success: function(info) {
        //console.log(info);

        var htmlStr = template('rightTmp', info);
        $('.category_right ul').html(htmlStr);
      }
    });
  }
renderById(1);
});
