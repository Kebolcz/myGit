//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    grid: [{
      name: "条码收集",
      url: "/images/Barcode.png",
      action: "locationGather"
    }, {
      name: "安装调试",
      url: "/images/debug.png",
      action: "liveInstallDebug"
    }, {
      name: "物流查询",
      url: "/images/logistics.png",
      action: "expressDetail"
    }, {
      name: "考勤管理",
      url: "/images/attendance.png",
      action: "mobileAttendance"
    }, {
      name: "培训管理",
      url: "/images/train.png",
      action: "trainManage"
    }, {
      name: "审批管理",
      url: "/images/approval.png",
      action: "K2Process"
    }, {
      name: "项目管理",
      url: "/images/project.png",
      action: "project"
    }, {
      name: "流程管理",
      url: "/images/process.png",
      action: "process"
    }],
    grid2: [{
      name: "统计分析",
      url: "/images/statistics.png",
      action: "statistics"
    }, {
      name: "会议管理",
      url: "/images/meeting_1.png",
      action: "meeting"
    }, {
      name: "订餐管理",
      url: "/images/dingcan.png",
      action: "dingcan"
    }, {
      name: "问题管理",
      url: "/images/problem.png",
      action: "problem"
    }, {
      name: "商机管理",
      url: "/images/Opportunity.png",
      action: "Opportunity"
    }, {
      name: "日程管理",
      url: "/images/schedule_1.png",
      action: "schedule"
    }, {
      name: "请假管理",
      url: "/images/leave.png",
      action: "leave"
    }, {
      name: "条码管理",
      url: "/images/bar-code.png",
      action: "barcode"
    }],
    imgUrls: [
      'http://www.casco.com.cn/ImgUpload/201508/201508121206103024.jpg',
      'http://www.casco.com.cn/images/video_kv.jpg',
      'http://www.casco.com.cn/ImgUpload/201508/2015081212101531980.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000
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
  }
})
