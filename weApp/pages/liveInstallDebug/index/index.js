// pages/locationGather/index/index.js
var config = require('../../../config.js');
var app = getApp();
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0,
    itemslength:0,
    itemsRecentlength:0,
    itemsCollectlength:0,
    collectIndex:[],
    collectUrl:{
      c:"/images/star.png",
      u:"/images/starh.png"
    },
    //搜索出来的临时project数组
    tempProject: [],
    tempItemslength: 0,
    tempCollectIndex: []
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh();
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
    var info = wx.getStorageSync("userDataInfo"),
    UserNo = info[0].UserNo;
    //UserNo = "61106";
    this.setData({
        UserNo:UserNo
    });
    wx.getNetworkType({
      success: function(res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        if (networkType=="none"){
          
          wx.showToast({
              title: '无网络，读取缓存数据',
              icon: 'loading',
              mask: true,
              duration: 2000
          });
          that.getStorageData();
        }else{
          that.loadLists();
        }
      }
    });
    
  },
  //读取缓存数据
  getStorageData:function(){
    var that = this;
    //我的项目
    wx.getStorage({
      key: 'MyProjectList',
      success: function(res) {
          that.setData(res.data);
      } 
    });
    //我的最近项目
    wx.getStorage({
      key: 'MyRecentUseProjectList',
      success: function(res) {
          that.setData(res.data);
      }
    });
    //我的收藏项目
    wx.getStorage({
      key: 'MyCollectionProjectList',
      success: function(res) {
          that.setData(res.data);
      } 
    })
  },
  loadLists:function(){
    var that = this,
    UserNo = this.data.UserNo;
    //获取项目列表信息
    wx.showToast({
          title: '数据加载中',
          icon: 'loading',
          mask: true,
          duration: 20000
    });
    wx.request({
      url: config.host +'/Point/MyProjectList',
      method: 'GET',
      data: {
        userNo: UserNo,
        typeInfo: "1"
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
        var length = res.data.rows.length;
        var collectIndex = [];
        for(var i=0;i<length;i++){
            collectIndex.push(that.data.collectUrl['c']);
            for (var j = 0; j < res.data.rows2.length; j++) {
            if (res.data.rows[i].ProjectNo === res.data.rows2[j].ProjectNo) {
              collectIndex[i] = that.data.collectUrl['u'];
            }
          }
        }
        var dataStorage = {
          project: res.data.rows,
          itemslength:length,
          collectIndex:collectIndex
        };
        that.setData(dataStorage);
        wx.setStorage({
          key:"MyProjectList",
          data:dataStorage
        });
      }
    });
     //获取最近使用的项目列表信息
    wx.request({
      url: config.host +'/Point/MyRecentUseProjectList',
      method: 'GET',
      data: {
        userNo: UserNo,
        typeInfo: "1"
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var length = res.data.rows.length;
        var dataStorage = {
          project_recent: res.data.rows,
          itemslength_recent: length
        };
        that.setData(dataStorage);
        wx.setStorage({
          key:"MyRecentUseProjectList",
          data:dataStorage
        });
        
      }
    });
    that.loadCollect();
  },
  loadCollect: function () {
    var that = this;
    var UserNo = this.data.UserNo;
    //获取我的收藏列表信息
    wx.request({
      url: config.host +'/Point/MyCollectionProjectList',
      method: 'GET',
      data: {
        userNo: UserNo,
        typeInfo: "1"
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var length = res.data.rows.length;
        var dataStorage = {
          project_star: res.data.rows,
          itemslength_star: length
        };
        that.setData(dataStorage);
        wx.setStorage({
          key:"MyCollectionProjectList",
          data:dataStorage
        });
      }
    });
  },
  collect:function(e){
    var that = this;
    wx.showToast({
      title: 'loading',
      icon: 'loading',
      duration: 20000
    });
    var projectNo = e.target.dataset.projectno;
    var UserNo = this.data.UserNo;
    console.log(projectNo, UserNo);
    var typeT = null;

    var index = e.currentTarget.dataset.indexcollect;
    var length = this.data.collectIndex.length;
    var tempArr = [];
    for (var i = 0; i < length; i++) {
      tempArr.push(this.data.collectIndex[i]);
    }
    if (tempArr[index] == this.data.collectUrl['c']) {
      tempArr[index] = this.data.collectUrl['u'];
      typeT = 1;
    } else if (tempArr[index] == this.data.collectUrl['u']) {
      tempArr[index] = this.data.collectUrl['c'];
      typeT = 2;
    }

    //获取我的收藏列表信息
    wx.request({
      url: config.host +'/Point/OperationCollectionProjectList',
      method: 'GET',
      data: {
        userNo: UserNo,
        projectNo: projectNo,
        type: typeT
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.result === "S") {
          if (typeT === 1) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2000
            });
          } else {
            wx.showToast({
              title: '取消收藏',
              icon: 'success',
              duration: 2000
            });
          }
          that.loadCollect();
          that.setData({
            collectIndex: tempArr
          });
        }
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
      tempProject: this.data.project,
      tempItemslength: this.data.itemslength,
      tempCollectIndex: this.data.collectIndex,
      currentTab: 0
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.onLoad();
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    this.onLoad();
  },
  inputTyping: function (e) {
    var that = this;
    this.setData({
      inputVal: e.detail.value,
      currentTab: 0
    });
    console.log(that.data.project);
    //遍历project,过滤符合关键字的项目到project
    var filter = [];
    that.data.tempProject.forEach(function (elem) {
      if (elem.ProjectName.indexOf(e.detail.value) != -1) {
        this.push(elem);
      }
    }, filter);

    var filter_collect = [];

    for(var i=0;i<that.data.tempProject.length;i++){
      if (that.data.tempProject[i].ProjectName.indexOf(e.detail.value) != -1) {
        filter_collect.push(that.data.tempCollectIndex[i]);
      }
    }

    this.setData({
      project: filter,
      itemslength: filter.length,
      collectIndex: filter_collect
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
  showProjectDetail: function (e) {
    //跳转到项目详情
    var projectNo = e.currentTarget.id;
    var ProjectName = e.currentTarget.dataset.projectname;
    wx.navigateTo({
      url: "/pages/liveInstallDebug/myProjectDetails/index?projectNo="+projectNo+"&ProjectName="+ProjectName
    })
  },
  navToManage:function(e){
    var projectNo = e.currentTarget.dataset.projectno;
    var ProjectName = e.currentTarget.dataset.projectname;
    wx.navigateTo({
      url: "/pages/liveInstallDebug/debugSetting/index?projectNo="+projectNo+"&ProjectName="+ProjectName
    })
  }
})