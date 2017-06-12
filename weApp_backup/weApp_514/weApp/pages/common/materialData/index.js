// pages/common/materialData/index.js
var app = getApp();
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    //查询数据库
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      mask: true,
      duration: 20000
    });
    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/MyRecentUseMatnrList',
      method: 'GET',
      data: {
        userNo: '61106'
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideToast();
        that.setData({
          sets_recent: res.data.rows,
          setsCount_recent: res.data.total
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
  showInput: function () {
    this.setData({
      inputShowed: true,
      currentTab: 0
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
    var that = this;
    this.setData({
      inputVal: e.detail.value,
      currentTab: 0
    });
    //查询数据库
    var urlT = 'http://wechat.casco.com.cn:9004/Point/GetMatnrSearchList';
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      mask: true,
      duration: 20000
    });
    wx.request({
      url: urlT,
      method: 'GET',
      data: {
        matnrDesc: that.data.inputVal
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideToast();
        that.setData({
          sets: res.data.rows,
          setsCount: res.data.total
        })
      }
    });
  },
  chooseMaterial: function (e) {
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];

      wx.showModal({
        title: '确认操作',
        content: '确认选择物料【' + e.currentTarget.dataset.desc + '】吗?',
        confirmText: "确认",
        cancelText: "取消",
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            //调用上一个页面的function
            prePage.addMaterial(e.currentTarget.id, e.currentTarget.dataset.desc);
            //返回上一个页面
            wx.navigateBack();
            wx.showToast({
              title: '数据加载中',
              icon: 'loading',
              mask: true,
              duration: 20000
            });
          } else {
            console.log('取消！');
          }
        }
      });
    }
  }
})