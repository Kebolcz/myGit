// pages/personalCenter/index.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/GetUserInfo?userNo=61106',
//+this.data["ProductCode"]
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if(res.data.result=="S"){
          var data = res.data.rows[0],
          userNo = data.UserNo,
          userDept = data.UserDept,
          userName = data.UserName,
          userImmediate = data.UserImmediate;
          that.setData({
              userNo:userNo,
              userDept:userDept,
              userName:userName,
              userImmediate:userImmediate
          });
        }else{

        }
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