// pages/common/linkMan/index.js
var app = getApp();
var showLoading = function () {
  wx.showToast({
    title: '数据加载中',
    icon: 'loading',
    mask: true,
    duration: 20000
  });
};
var hideLoading = function () {
  wx.hideToast();
};
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
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
    });
    showLoading();
    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/GetOrganizationUserInfo',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          department: res.data.rows,
          employeeInfo: res.data.rows2
        });

        var userId = '61106';
        var myDepartment = '';
        that.data.employeeInfo.forEach(function (elem) {
          if (elem.DomainAccount === userId) {
            myDepartment = elem.DisplayName;
          }
        });
        var myColleauge = [];
        that.data.employeeInfo.forEach(function (elem) {
          if (elem.DisplayName === myDepartment) {
            this.push(elem);
          }
        }, myColleauge);

        that.setData({
          myColleauge: myColleauge,
          resultCount: myColleauge.length,
          titleTab: myDepartment,
          myDepartment: myDepartment,
          myColleauge_T: myColleauge,
          resultCount_T: myColleauge.length
        });
        hideLoading();

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
      inputShowed: true,
      currentTab: 0
    });
  },
  hideInput: function () {
    var that = this;
    this.setData({
      inputVal: "",
      inputShowed: false,
      myColleauge: this.data.myColleauge_T,
      resultCount: this.data.resultCount_T,
      titleTab: that.data.myDepartment
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      myColleauge: this.data.myColleauge_T,
      resultCount: this.data.resultCount_T,
      titleTab: this.data.myDepartment
    });
  },
  inputTyping: function (e) {
    var that = this;
    this.setData({
      inputVal: e.detail.value
    });
    var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");

    if (e.detail.value.length >= 4 || (reg.test(e.detail.value) && e.detail.value.length >= 2)) {
      showLoading();
      var filter = [];
      that.data.employeeInfo.forEach(function (elem) {
        if (elem.DomainAccount.indexOf(e.detail.value) != -1 || elem.Name.indexOf(e.detail.value) != -1 || elem.DisplayName.indexOf(e.detail.value) != -1) {
          this.push(elem);
        }
      }, filter);
      hideLoading();
      this.setData({
        myColleauge: filter,
        resultCount: filter.length,
        titleTab: "搜索结果",
      });
    } else if (e.detail.value.length <= 0) {
      that.clearInput();
    }
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
  makePhone: function (e) {
    console.log(e);
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    });
  },
  chooseDepart: function (e) {
    console.log(e);
    var that = this;
    showLoading();
    var id = e.currentTarget.id;
    e.detail.value = id;
    var filter = [];
    that.data.employeeInfo.forEach(function (elem) {
      if (elem.DisplayName.indexOf(id) != -1) {
        this.push(elem);
      }
    }, filter);
    that.setData({
      inputShowed: false,
      currentTab: 0,
      inputVal: id,
      myColleauge: filter,
      resultCount: filter.length,
      titleTab: id
    });
    hideLoading();
  }
})