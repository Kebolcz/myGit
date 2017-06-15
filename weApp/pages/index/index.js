//index.js
//获取应用实例
var app = getApp();
var config = require('../../config.js');
/*
 *  获取并监听网络状态的func
 */
var isConnected;
//获取网络状态。
wx.getNetworkType({
  success: function (res) {
    // 返回网络类型, 有效值：
    // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
    isConnected = res.networkType === 'none' ? false : true;
  }
});
//监听网络状态变化。
wx.onNetworkStatusChange(function (res) {
  console.log(res.isConnected)
  console.log(res.networkType)
  isConnected = res.isConnected;
});
/*
 *  获取并监听网络状态的func
 */
Page({
  data: {
    isHiddenToast: true,
    inputShowed: false,
    inputVal: "",
    hidden: true,
    grid: [{
      name: "条码收集",
      url: "/images/Barcode.png",
      action: "locationGather",
      type: "1"
    }, {
      name: "安装调试",
      url: "/images/debug.png",
      action: "liveInstallDebug",
      type: "1"
    }, {
      name: "物流查询",
      url: "/images/logistics.png",
      action: "LogisticsTracking",
      type: "1"
    }, {
      name: "考勤管理",
      url: "/images/attendance.png",
      action: "mobileAttendance",
      type: "0"
    }, {
      name: "培训管理",
      url: "/images/train.png",
      action: "trainManage",
      type: "0"
    }, {
      name: "审批管理",
      url: "/images/approval.png",
      action: "K2Process",
      type: "0"
    }, {
      name: "项目管理",
      url: "/images/project.png",
      action: "ProjectManagement",
      type: "1"
    }, {
      name: "流程管理",
      url: "/images/process.png",
      action: "process",
      type: "0"
    }],
    grid2: [{
      name: "统计分析",
      url: "/images/statistics.png",
      action: "statistics",
      type: "0"
    }, {
      name: "会议管理",
      url: "/images/meeting_1.png",
      action: "meeting",
      type: "0"
    }, {
      name: "订餐管理",
      url: "/images/dingcan.png",
      action: "dingcan",
      type: "0"
    }, {
      name: "问题管理",
      url: "/images/problem.png",
      action: "problem",
      type: "0"
    }, {
      name: "商机管理",
      url: "/images/Opportunity.png",
      action: "Opportunity",
      type: "0"
    }, {
      name: "日程管理",
      url: "/images/schedule_1.png",
      action: "schedule",
      type: "0"
    }, {
      name: "请假管理",
      url: "/images/leave.png",
      action: "leave",
      type: "0"
    }, {
      name: "条码管理",
      url: "/images/bar-code.png",
      action: "barcode",
      type: "0"
    }],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000
  },
  onPullDownRefresh: function () {
    this.setData({
      hidden: false
    })
    this.loadNews();
    wx.stopPullDownRefresh();
  },
  toastChange: function (e) {
    if (e.currentTarget.id != "1") {
      this.setData({
        isHiddenToast: true
      })
    }
  },
  isShowToast: function (e) {
    if (e.currentTarget.id != "1") {
      this.setData({
        isHiddenToast: false
      })
    }
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
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  loadNews: function () {
    var that = this
    if (isConnected) {
      wx.request({
        url: config.host + '/Point/GetNewsInfo',
        method: 'GET',
        data: {},
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          wx.setStorage({
            key: 'loadNews',
            data: res.data.rows
          });
          that.setData({
            imgUrls: res.data.rows,
            hidden: true
          });
        }
      });
    } else {
      that.setData({
        imgUrls: wx.getStorageSync('loadNews') || [],
        hidden: true
      });
    }
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    this.loadNews();
  }
})



