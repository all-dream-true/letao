
$(function() {

  //currentPage为当前页
  var currentPage = 1;
  //一页有5条数据
  var pageSize = 5;

  //一进入页面就渲染一次
  render();
  //ajax请求数据

  function render() {
    $.ajax({
      type: 'get',
      url: '/user/queryUser',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function(info) {
        console.log(info);
        //参数2必须是一个对象
        //在模板中可以任意使用模板中的属性
        //isDelete 表示用户的启用状态，1是启用，0是禁用
        var htmlStr = template("tpl", info);
        $('.lt_content tbody').html(htmlStr);

        // 配置分页
        $('#paginator').bootstrapPaginator({
          // 指定bootstrap版本
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil( info.total / info.size ),

          // 当页面被点击时触发
          onPageClicked: function( a, b, c, page ) {
            // page 当前点击的页码
            currentPage = page;
            // 调用 render 重新渲染页面
            render();
          }
        });

      }
    });
  }


  //2.通过事件委托给按钮注册点击事件
  $('.lt_content tbody').on('click','.btn',function() {
    console.log("hehe");
    //弹出模态框
    $('#userModal').modal('show');

    //用户id
    var id = $(this).parent().data('id');
    //console.log(id);
    var isDelete = $(this).hasClass('btn-success') ? 1 : 0;
    //console.log(isDelete);

    //先解绑，再绑定事件，可以保证只有一个事件绑定在按钮上
    $('#submitBtn').off('click').on('click',function() {

      $.ajax({
        type: 'post',
        url: "/user/updateUser",
        data: {
          id: id,
          isDelete: isDelete
        },
        success: function(info) {
          console.log(info);
          if (info.success) {
            //关闭模态框
            $('#userModal').modal("hide");
            //重新渲染
            render();
          }
        }
      })
    })
  })

})