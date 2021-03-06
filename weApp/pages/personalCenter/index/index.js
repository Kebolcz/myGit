// pages/personalCenter/index.js
var config = require('../../../config.js');
var app = getApp();
Page({
  
  data: { isHiddenToast: true
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      userDataInfo: wx.getStorageSync("userDataInfo")
    });
    wx.request({
      url: config.host + '/Point/GetUserInfo',
      method: 'GET',
      data: {
        userNo: that.data.userDataInfo[0].UserNo
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.result == "S") {
          var data = res.data.rows[0],
            userNo = data.UserNo,
            userDept = data.UserDept,
            userName = data.UserName,
            userImmediate = data.UserImmediate;
          that.setData({
            userNo: userNo,
            userDept: userDept,
            userName: userName,
            userImmediate: userImmediate
          });
        } else {

        }
      }
    })
  }, toastChange: function (e) {
    this.setData({
      isHiddenToast: true
    })
  },
  isShowToast: function (e) {
    this.setData({
      isHiddenToast: false
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})