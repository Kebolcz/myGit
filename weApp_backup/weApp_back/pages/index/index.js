//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    grid: [{
      name:"安装地收集",
      url:"/images/icon_tabbar.png",
      action:"locationGather"
    },{
      name:"安装调试",
      url:"/images/icon_tabbar.png",
      action:"liveInstallDebug"
    },{
      name:"物流查询",
      url:"/images/icon_tabbar.png",
      action:"expressDetail"
    },{
      name:"移动考勤",
      url:"/images/icon_tabbar.png",
      action:"mobileAttendance"
    },{
      name:"培训管理",
      url:"/images/icon_tabbar.png",
      action:"trainManage"
    },{
      name:"K2流程",
      url:"/images/icon_tabbar.png",
      action:"K2Process"
    },{
      name:"掌上卡斯柯",
      url:"/images/icon_tabbar.png",
      action:"CASCOAPP"
    },{
      name:"project",
      url:"/images/icon_tabbar.png",
      action:"project"
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
