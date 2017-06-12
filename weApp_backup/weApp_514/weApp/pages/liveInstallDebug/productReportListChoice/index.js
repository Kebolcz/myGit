// page/liveInstallDebug/project/index.js
Page({
  data:{
    ProductCode:""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var data = options["ProductCode"];
    wx.setNavigationBarTitle({
      title:options.ProductCode+"产品调试表"
    });
    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/GetProductDebugList?productCode=CTC',
//+this.data["ProductCode"]
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          debugList: res.data.rows,
          ProductCode:data
        })
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})