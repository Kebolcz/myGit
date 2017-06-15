// pages/ProjectManagement/projectMission/index.js
var app = getApp();
var config = require('../../../config.js');
require('../../../utils/dateFormat.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2017-05-17',
    time: '12:00',
    date_end: '2017-05-17',
    time_end: '12:00',
    array: ['普通', '紧急', '非常紧急'],
    index: '0',
    members: ['晓龙','崇桢','黄翔']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    var lev2 = options.l2;
    var lev3 = options.l3;

    try {
      var obj = wx.getStorageSync('projectDetailList');
      if (obj) {
          that.setData({
            perojectInfo: obj,
            date: (new Date(obj[lev2].children[lev3].TASK_START_DATE)).format("yyyy-MM-dd") || (new Date()).format("yyyy-MM-dd"),
            time: (new Date(obj[lev2].children[lev3].TASK_START_DATE)).format("hh:mm") || (new Date()).format("hh:mm"),
            date_end: (new Date(obj[lev2].children[lev3].TASK_FINISH_DATE)).format("yyyy-MM-dd") || (new Date()).format("yyyy-MM-dd"),
            time_end: (new Date(obj[lev2].children[lev3].TASK_FINISH_DATE)).format("hh:mm") || (new Date()).format("hh:mm"),
            lev2: lev2,
            lev3: lev3
          });
      }
    } catch (e) {
      wx.showToast({
        title: '获取缓存失败,请返回上一页重新操作!',
        image: '/images/warn.png',
        duration: 3000
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    
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
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      date_end: e.detail.value
    })
  },
  bindTimeChange: function(e) {
      this.setData({
          time: e.detail.value,
          time_end: e.detail.value
      })
  },
  bindDateChange_end: function (e) {
    this.setData({
      date_end: e.detail.value
    })
  },
  bindTimeChange_end: function(e) {
      this.setData({
          time_end: e.detail.value
      })
  },
  bindPickerChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
          index: e.detail.value
      })
  },
  addMember: function(e){
    console.log('添加任务成员');
  },
  showPopup: function(e){
    var that = this;
    var lev2 = Number(that.data.lev2);
    var lev3 = Number(that.data.lev3);
    var lev4 = e.currentTarget.dataset.leviv;
    var lev5 = e.currentTarget.dataset.levv;
    var lev6 = e.currentTarget.dataset.levvi;
    var res = null;

    var temp = that.data.perojectInfo[lev2].children[lev3];
    if(lev4 !== ""){
      res = temp.children[lev4];
      if(lev5 !== ""){
        res = res.children[lev5];
        if(lev6 !== ""){
          res = res.children[lev6];
        }
      }
    }

    that.setData({
      popData:{
        showPop: true,
        detail: res,
        index: 0,
        array: ['普通', '紧急', '非常紧急'],
        members: ['晓龙','崇桢','黄翔'],
        date: (new Date(res.TASK_START_DATE)).format("yyyy-MM-dd") || (new Date()).format("yyyy-MM-dd"),
        time: (new Date(res.TASK_START_DATE)).format("hh:mm") || (new Date()).format("hh:mm"),
        date_end: (new Date(res.TASK_FINISH_DATE)).format("yyyy-MM-dd") || (new Date()).format("yyyy-MM-dd"),
        time_end: (new Date(res.TASK_FINISH_DATE)).format("hh:mm") || (new Date()).format("hh:mm")
      }
    });
  },
  bindDateChange_pop: function (e) {
    var that = this;
    this.setData({
      popData:{
        showPop: true,
        detail: that.data.popData.detail,
        index: that.data.popData.index,
        array: ['普通', '紧急', '非常紧急'],
        members: ['晓龙','崇桢','黄翔'],
        date: e.detail.value,
        time: that.data.popData.time,
        date_end: e.detail.value,
        time_end: that.data.popData.time_end
      }
    })
  },
  bindTimeChange_pop: function(e) {
      var that = this;
      this.setData({
        popData:{
          showPop: true,
          detail: that.data.popData.detail,
          index: that.data.popData.index,
          array: ['普通', '紧急', '非常紧急'],
          members: ['晓龙','崇桢','黄翔'],
          date: that.data.popData.date,
          time: e.detail.value,
          date_end: that.data.popData.date_end,
          time_end: e.detail.value
        }
      })
  },
  bindDateChange_end_pop: function (e) {
    var that = this;
    this.setData({
      popData:{
        showPop: true,
        detail: that.data.popData.detail,
        index: that.data.popData.index,
        array: ['普通', '紧急', '非常紧急'],
        members: ['晓龙','崇桢','黄翔'],
        date: that.data.popData.date,
        time: that.data.popData.time,
        date_end: e.detail.value,
        time_end: that.data.popData.time
      }
    })
  },
  bindTimeChange_end_pop: function(e) {
      var that = this;
      this.setData({
        popData:{
          showPop: true,
          detail: that.data.popData.detail,
          index: that.data.popData.index,
          array: ['普通', '紧急', '非常紧急'],
          members: ['晓龙','崇桢','黄翔'],
          date: that.data.popData.date,
          time: that.data.popData.time,
          date_end: that.data.popData.date_end,
          time_end: e.detail.value
        }
      })
  },
  bindPickerChange_pop: function(e) {
      var that = this;
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        popData:{
          showPop: true,
          detail: that.data.popData.detail,
          index: e.detail.value,
          array: ['普通', '紧急', '非常紧急'],
          members: ['晓龙','崇桢','黄翔'],
          date: that.data.popData.date,
          time: that.data.popData.time,
          date_end: that.data.popData.date_end,
          time_end: that.data.popData.time_end
        }
      })
  },
  addMember_pop: function(e){
    console.log('pop添加任务成员');
  },
  saveDetail_pop: function(e){
      var that = this;
      this.setData({
        popData:{
          showPop: false,
          detail: that.data.popData.detail,
          index: that.data.popData.index,
          array: ['普通', '紧急', '非常紧急'],
          members: ['晓龙','崇桢','黄翔'],
          date: that.data.popData.date,
          time: that.data.popData.time,
          date_end: that.data.popData.date_end,
          time_end: that.data.popData.time_end
        }
      });
  },
  close_pop: function(e){
      var that = this;
      this.setData({
        popData:{
          showPop: false,
          detail: that.data.popData.detail,
          index: that.data.popData.index,
          array: ['普通', '紧急', '非常紧急'],
          members: ['晓龙','崇桢','黄翔'],
          date: that.data.popData.date,
          time: that.data.popData.time,
          date_end: that.data.popData.date_end,
          time_end: that.data.popData.time_end
        }
      });
  },
  saveDetail: function(e){

  }
})