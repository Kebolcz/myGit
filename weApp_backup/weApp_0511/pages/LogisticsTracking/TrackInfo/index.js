// pages/locationGather/projectDetail/index.js
var app = getApp();
var config = require('../../../config.js');
Page({
  data: {
    isHiddenToast: true,
    projectId: "",
    hiddenView: [],
    itemslength: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var ProcInstId = options.ProcInstId;
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 20000
    });
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });

    wx.request({
      url: config.host+'/Point/GetLogisticsTrackingInfo',
      method: 'GET',
      data: {
        ProcInstId: '3326533399490'
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
        var result=JSON.parse(res.data.rows);
        that.setData({
          LogisticCode:result.LogisticCode,
          ShipperName:result.ShipperName,
           Success:result.Success,
          Traces: result.Traces
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
  widgetsToggle: function (e) {
    var index = e.currentTarget.dataset.toggleindex,
      data = [],
      length = this.data['hiddenView'].length;
    //data['navShow'] = false;
    for (var i = 0; i < length; i++) {
      data.push(this.data['hiddenView'][i]);
    }
    data[index] = !this.data['hiddenView'][index];
    this.setData({
      hiddenView: data
    });
  }
})