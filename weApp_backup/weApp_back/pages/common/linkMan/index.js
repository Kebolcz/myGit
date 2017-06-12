// pages/common/linkMan/index.js
var app = getApp();
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0,
    titleTab: "我的部门",
    resultCount: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      });
    });
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 20000
    });
    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/GetOrganizationUserInfo',
      method: 'GET',
      data: {},
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
          department: res.data.rows,
          employeeInfo: res.data.row2
        })
      }
    });
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
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  // 滑动切换tab 
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  // 点击tab切换 
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
})