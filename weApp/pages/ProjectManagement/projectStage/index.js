// pages/ProjectManagement/projectStage/index.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
var config = require('../../../config.js');
require('../../../utils/dateFormat.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //底部tabs
    activeIndex: 0,
    tabs: ["阶段详情", "阶段列表"],
    sliderOffset: 0,
    sliderLeft: 0,
    //顶部tabs
    currentTab: 0,
    winWidth: 0,
    winHeight: 0,
    icon: '/images/schedule_2.png',
    icon60: '/images/conow-my-project.png',
    //添加按钮是否显示
    addBtnShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var scrollHeight = (res.windowHeight-52) / res.windowWidth * 750;


        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          sliderWidth: res.windowWidth / 2
        });
      }
    });

    var PROJ_UID = options.PROJ_UID || 'e7b2adc6-f29f-4452-b4dc-75f47081625d';
    wx.request({
      url: config.host + '/project/GetProjectInfo',
      method: 'GET',
      data: {
        PROJ_UID: PROJ_UID
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.result === "S") {
          //规范任务List的每一项任务的开始结束时间
          res.data.rows.map(function(elem,index){
            res.data.rows[index].start_data = (new Date(elem.TASK_START_DATE)).format("MM-dd hh:mm");
            res.data.rows[index].end_data = (new Date(elem.TASK_FINISH_DATE)).format("MM-dd hh:mm");
          });
          //获取任务List的root节点的TASK_ID
          var rootID = null;
          for(var i of res.data.rows){
            if(i.TASK_OUTLINE_LEVEL === '2'){
              rootID = i.TASK_PARENT_UID;
              break;
            }
          }

          var resultJSON = that.arrayToJson(res.data.rows,rootID);

          that.setData({
            stageList: resultJSON
          });

          try {
            wx.setStorageSync('projectDetailList', resultJSON)
          } catch (e) {
            wx.showToast({
              title: '项目列表详情缓存失败,请下拉刷新!',
              image: '/images/warn.png',
              duration: 3000
            });
          }


        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 2000
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * JSON数组,转为无限层次树形结构JSON
   */
  arrayToJson: function(data,pid){
    var that = this;
    var result = [], temp;
    for (var i = 0; i < data.length; i++) {
        if (data[i].TASK_PARENT_UID == pid) {
            var obj = data[i];
            temp = that.arrayToJson(data, data[i].TASK_UID);
            if (temp.length > 0) {
                obj.children = temp;
            }
            result.push(obj);
        }
    }
    return result;
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
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
  // 点击跳转到对应项目阶段 
  switchStage: function (e) {
    var that = this;
    this.setData({
      activeIndex: 0,
      sliderOffset: 0,
      currentTab: Number(e.currentTarget.dataset.key) - 1
    });
  },
  //点击添加按钮
  handleClick_add: function (e) {
    var that = this;
    that.setData({
      addBtnShow: !that.data.addBtnShow
    });
  },
  //确认添加按钮
  confirmAdd: function () {
    var that = this;
    that.setData({
      addBtnShow: !that.data.addBtnShow
    });
  },
  //取消添加按钮
  cancelAdd: function () {
    var that = this;
    that.setData({
      addBtnShow: !that.data.addBtnShow
    });
  },
})