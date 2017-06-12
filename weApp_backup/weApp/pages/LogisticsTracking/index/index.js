// pages/locationGather/projectDetail/index.js
var app = getApp();
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
      url: 'http://wechat.casco.com.cn:9004/Point/MyK2AdviceDeliveryProjectList',
      method: 'GET',
      data: {
        userNo: '60328'
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
        var length = res.data.rows.length,
          data = [];
        for (var i = 0; i < length; i++) {
          data.push(true);
        }
        that.setData({
          DeliveryLists: res.data.rows,
          hiddenView: data,
          itemslength: length
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
  showDetail: function (e) {
    //跳转到项目详情
    var ProcInstId = e.currentTarget.id;
    wx.navigateTo({
      url: "/pages/LogisticsTracking/TrackList/index?ProcInstId=" + ProcInstId + ""
    })
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