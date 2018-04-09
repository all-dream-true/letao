

$(function() {

  var currentPage = 1 //当前页
  var pageSize = 2 //每页的条数
  var picArr = []//用来保存图片的对象

  //一进入页面就渲染一次
  render();
  function render() {

    //请求数据
    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function(info) {
        console.log(info);
        //结合模板渲染数据
        var htmlStr = template('tmp', info);
        $('.lt_content tbody').html(htmlStr);

        //进行分页初始化
        $('#pagintor').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function(a, b, c, page) {
            currentPage = page;
            render();
          },
          // 配置按钮大小 large
          size: "normal",
          // 配置每个按键的文字
          // 每个按钮, 都会调用一次这个方法, 他的返回值, 就是按钮的文本内容
          itemTexts: function( type, page, current ) {
            // first 首页 last 尾页, prev 上一页, next 下一页, page 普通页码
            // page 是当前按钮指向第几页
            // current 是指当前是第几页 (相对于整个分页来说的)
            switch (type) {
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "page":
                return page;
            }
          },
          tooltipTitles: function(type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "page":
                return "前往第" + page + "页";
            }
          },
          //使用bootstrap的样式的提示框组键
          useBootstrapTooltip: true
        });
      }
    });
  };

  //2.给添加商品按钮添加点击事件 ，点击显示模态框

  $('#addBtn').click(function() {
    //console.log(222);
    $('#addModal').modal('show');

    //获取二级分类名并渲染到下拉菜单中
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      success: function(info) {
        console.log(info);
        var htmlStr = template('selectTmp', info);
        $('.dropdown-menu').html(htmlStr);
      }
    });
  });

  //3.给下拉菜单中的每个a 注册点击事件
  $('.dropdown-menu').on('click', 'a', function(info) {
    //console.log(666);
    //获取选择的文本内容
    var txt = $(this).text();
    //渲染到下拉菜单中
    $('#dropdownText').text(txt);

    //把二级分类的id设置给隐藏域brandId
    var id = $(this).data('id');
    $('[name="brandId"]').val(id);

  });

  //4.配备上传图片的函数
  $('#fileupload').fileupload({
    //返回的数据类型
    dataType: 'json',
    //上传完图片后，响应的回调函数
    //每上传完一张图片，响应一次
    done: function(e, data) {
     // console.log(data);
      //获取图片信息的对象
      var picObj = data.result;
      //获取图片的地址
      var picAddr = picObj.picAddr;
      //新添加的图片对象应该添加到数组的最前面
      picArr.unshift(picObj);
      //把新的图片添加到imgBox最前面
      $('#imgBox').prepend('<img src="' + picAddr + '"width="100">');

     // console.log(picArr.length);
      //对储存图片对象的数组进行判断
      if(picArr.length > 3) {
        picArr.pop();
        //要把页面上渲染的最旧的一张图片删掉
        $('#imgBox img:last-of-type').remove();
      }

      //当图片的数量为三时更新表格校验的状态
      if(picArr.length == 3) {
        $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID');
      }
    }
  });

  //5.配置表单校验
  $('#form').bootstrapValidator({
    //将默认项排除，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],
    //指定校验时的图标显示
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      brandId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择二级分类'
          }
        }
      },
      //商品名称proName
      proName: {
        validators: {
          notEmpty: {
            message: '请输入商品名称'
          }
        }
      },
      //商品描述proDesc
      proDesc: {
        validators: {
          notEmpty: {
            message: '请输入商品描述'
          }
        }
      },
      //商品库存num
      // 商品库存
      // 要求: 必须是非零开头的数字, 非零开头, 也就是只能以 1-9 开头
      // 数字: \d
      // + 表示一个或多个
      // * 表示零个或多个
      // ? 表示零个或1个
      // {n} 表示出现 n 次
      num: {
        validators: {
          notEmpty: {
            message: '请输入商品库存'
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存的格式,必须是非零开头的数字'
          }
        }
      },
      //商品尺码size规则必须是 32-40, 两个数字-两个数字
      size: {
        validators: {
          notEmpty: {
            message: '请输入商品尺码'
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '商品尺码的格式，必须是32-40'
          }
        }
      },
      //商品原价oldPrice
      oldPrice: {
        validators: {
          notEmpty: {
            message: '请输入商品原价'
          }
        }
      },
      //商品现价price
      price: {
        validators: {
          notEmpty: {
            message: '请输入商品现价'
          }
        }
      },
      //上传图片picStatus
      picStatus: {
        validators: {
          notEmpty: {
            message: '请上传3张图片'
          }
        }
      },

    }

  });

  //6.注册校验成功事件
  $('#form').on('success.form.bv', function(e) {
    //阻止默认的提交
    e.preventDefault();

    //表单提交得到的字符串
    var params = $('#form').serialize();
    console.log(picArr);

    // 需要在参数的基础上拼接上这些参数
    // &picName1=xx&picAddr1=xx
    // &picName2=xx&picAddr2=xx
    // &picName3=xx&picAddr3=xx

    params += "&picName1="+ picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    params += "&picName2="+ picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    params += "&picName3="+ picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

    console.log(params);

    //通过ajax添加请求
    $.ajax({
      type: 'post',
      url: '/product/addProduct',
      data: params,
      success: function(info) {
        if(info.success) {
          //关闭模态框
          $('#addModal').modal('hide');
          //对表单进行重置
          $('#form').data('bootstrapValidator').resetForm(true);
          //重新渲染第一页
          currentPage = 1;
          render();
          //手动重置下拉菜单
          $('#dropdownText').text('请选择二级分类');
          //删除结构中所有的图片
          $('#imgBox img').remove();
          //将存储图片数据的数组重置
          picArr = [];
        }
      }
    });
  });
});