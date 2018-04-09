

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