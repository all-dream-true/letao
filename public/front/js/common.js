

$(function() {
  //初始化滚动区域
  mui('.mui-scroll-wrapper').scroll({
    indicators: false, //是否显示滚动条
  });

  //配置轮播图自动轮播
  //获得slider插件对象
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
  });
})

//专门用于解析地址栏参数
function getSearch(key) {
  var search = location.search;

  //解码成中文
  search = decodeURI(search);
  //去掉？
  search = search.splice(1);
  //分割成数组
  var arr = search.split('&');

  var obj = {};
  arr.forEach(function(element, index) {
    //对数组进行切割  最后成name=value
    var k = element.split('=')[0]; //key
    var v = element.split('=')[1]; //value
    obj[ k ] = v;

    return obj[key];
  })
}