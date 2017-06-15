// pages/common/message/index.js
var showDate = require('../../../utils/lunar.js');
var config = require('../../../config.js');
Page({
  data: {
    isHiddenToast: true,
    grids: [{
      name: "我的消息",
      url: "/images/message/message.png",
      action: "myMessage",
      count: 0
    }, {
      name: "新闻中心",
      url: "/images/message/news.png",
      action: "news",
      count: 1
    }, {
      name: "通知公告",
      url: "/images/message/announcement.png",
      action: "announcement",
      count: 2
    }, {
      name: "企业文化",
      url: "/images/message/culture.png",
      action: "culture",
      count: 3
    }, {
      name: "拿快递",
      url: "/images/message/express.png",
      action: "express",
      count: 4
    }, {
      name: "调查问卷",
      url: "/images/message/examination.png",
      action: "examination",
      count: 5
    }, {
      name: "邮箱待办",
      url: "/images/message/mailbox.png",
      action: "mailbox",
      count: 6
    }, {
      name: "工作日志",
      url: "/images/message/workBlog.png",
      action: "workBlog",
      count: 7
    }, {
      name: "会议助手",
      url: "/images/message/meeting.png",
      action: "meeting",
      count: 8
    }],
    // grids2: [{
    //   name: "男一",
    //   gender: "male"
    // }, {
    //   name: "男二",
    //   gender: "male"
    // }, {
    //   name: "男三",
    //   gender: "male"
    // }, {
    //   name: "女一",
    //   gender: "female"
    // }, {
    //   name: "女二",
    //   gender: "female"
    // }, {
    //   name: "女三",
    //   gender: "female"
    // }],
    tip: '',
    showTopTips: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      lunar: showDate.showLunar()
    });
    wx.request({
      url: config.host + '/Point/GetUserBirthdayInfo',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          grids2: res.data.rows
        });
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
  toastChange: function (e) {
    this.setData({
      isHiddenToast: true
    })
  },
  isShowToast: function (e) {
    this.setData({
      isHiddenToast: false
    })
  },
  navToNext: function () {
    var that = this;
    // wx.navigateTo({
    //   url: 'String',
    //   success: function(res){
    //     // success
    //   },
    //   fail: function(res) {
    //     // fail
    //   },
    //   complete: function(res) {
    //     // complete
    //   }
    // });
    that.setData({
      tip: '演示Demo',
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  }
})