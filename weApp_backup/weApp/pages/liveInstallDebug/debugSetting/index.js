// pages/liveInstallDebug/debugSetting/index.js
Page({
  data:{
    productList:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var projectNo = options["projectNo"],
    ProjectName = options["ProjectName"];
     wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/GetProjectPointInfo',
      method: 'GET',
      data: {
        projectNo: projectNo
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.showToast({
            title: '加载完成',
            icon: 'success',
            duration: 1
        });
        that.setData({
          productList: res.data.rows2
        })
      }
    });
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