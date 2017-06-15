// pages/locationGather/index/index.js
var app = getApp();
var config = require('../../../config.js');
/*
 *  获取并监听网络状态的func
 */
var isConnected = true;
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
    inputShowed: false,
    inputVal: "",
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0,
    itemslength: 0,
    collectIndex: [],
    collectUrl: {
      c: "/images/star.png",
      u: "/images/starh.png"
    },
    //搜索出来的临时project数组
    tempProject: [],
    tempItemslength: 0,
    tempCollectIndex: []
  },
  //转发当前页面
  onShareAppMessage: function () {
    return {
      title: this.data.userDataInfo[0].UserNo + '的项目列表',
      path: '/pages/locationGather/index/index?shareUserNo=' + this.data.userDataInfo[0].UserNo,
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh();
  },
  mySetStorage: function (key, value) {
    wx.setStorage({
      key: key,
      data: value
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    console.log(options)
    that.setData({
      userDataInfo: wx.getStorageSync("userDataInfo")
    });
    //如果存在shareUserNo,说明是转发的链接进入当前页面,这时伪造一个userDataInfo
    if (options.shareUserNo) {
      that.setData({
        userDataInfo: [{
          UserNo: options.shareUserNo
        }]
      });
    }
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    console.log('isConnected:' + isConnected)
    console.log('UserNo:' + that.data.userDataInfo[0].UserNo)
    //获取缓存OR请求接口
    if (isConnected) {
      wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        mask: true,
        duration: 20000
      });
      //获取我的项目列表信息
      wx.request({
        url: config.host + '/Point/MyProjectList',
        method: 'GET',
        data: {
          userNo: that.data.userDataInfo[0].UserNo,
          //userNo: "61106",
          typeInfo: "0"
        },
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          wx.hideToast();
          var length = res.data.rows.length;
          var collectIndex = [];
          for (var i = 0; i < length; i++) {
            collectIndex.push(that.data.collectUrl['c']);
            for (var j = 0; j < res.data.rows2.length; j++) {
              if (res.data.rows[i].ProjectNo === res.data.rows2[j].ProjectNo) {
                collectIndex[i] = that.data.collectUrl['u'];
              }
            }
          }
          //缓存接口返回数据
          //我的项目列表相关
          that.mySetStorage(that.data.userDataInfo[0].UserNo + "MyProjectList-project", res.data.rows);
          that.mySetStorage(that.data.userDataInfo[0].UserNo + "MyProjectList-itemslength", length);
          that.mySetStorage(that.data.userDataInfo[0].UserNo + "MyProjectList-collectIndex", collectIndex);
          that.setData({
            project: res.data.rows,
            itemslength: length,
            collectIndex: collectIndex
          });
        }
      });

      //获取最近使用的项目列表信息
      wx.request({
        url: config.host + '/Point/MyRecentUseProjectList',
        method: 'GET',
        data: {
          userNo: that.data.userDataInfo[0].UserNo,
          //userNo: "61106",
          typeInfo: "0"
        },
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          var length = res.data.rows.length;
          //缓存接口返回数据
          //最近使用的项目列表相关
          that.mySetStorage(that.data.userDataInfo[0].UserNo + "MyRecentUseProjectList-project_recent", res.data.rows);
          that.mySetStorage(that.data.userDataInfo[0].UserNo + "MyRecentUseProjectList-itemslength_recent", length);
          that.setData({
            project_recent: res.data.rows,
            itemslength_recent: length
          })
        }
      });
      that.loadCollect();
    } else {
      try {
        var project = wx.getStorageSync(that.data.userDataInfo[0].UserNo + 'MyProjectList-project');
        var itemslength = wx.getStorageSync(that.data.userDataInfo[0].UserNo + 'MyProjectList-itemslength');
        var collectIndex = wx.getStorageSync(that.data.userDataInfo[0].UserNo + 'MyProjectList-collectIndex');
        var project_recent = wx.getStorageSync(that.data.userDataInfo[0].UserNo + 'MyRecentUseProjectList-project_recent');
        var itemslength_recent = wx.getStorageSync(that.data.userDataInfo[0].UserNo + 'MyRecentUseProjectList-itemslength_recent');
        var project_star = wx.getStorageSync(that.data.userDataInfo[0].UserNo + 'MyCollectionProjectList-project_star');
        var itemslength_star = wx.getStorageSync(that.data.userDataInfo[0].UserNo + 'MyCollectionProjectList-itemslength_star');
        if (project && itemslength && collectIndex) {
          that.setData({
            project: project,
            itemslength: itemslength,
            collectIndex: collectIndex
          });
        } else {
          wx.showToast({
            title: '当前用户的项目离线缓存内容为空!',
            image: '/images/warn.png',
            duration: 2000
          });
        }
        if (project_recent && itemslength_recent) {
          that.setData({
            project_recent: project_recent,
            itemslength_recent: itemslength_recent
          })
        }
        if (project_star && itemslength_star) {
          that.setData({
            project_star: project_star,
            itemslength_star: itemslength_star
          })
        }
      } catch (e) {
        wx.showToast({
          title: '获取无网络缓存失败!',
          image: '/images/warn.png',
          duration: 2000
        });
      }
    }
  },

  loadCollect: function () {
    var that = this;
    //获取我的收藏列表信息
    wx.request({
      url: config.host + '/Point/MyCollectionProjectList',
      method: 'GET',
      data: {
        userNo: that.data.userDataInfo[0].UserNo,
        //userNo: "61106",
        typeInfo: "0"
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var length = res.data.rows.length;
        that.mySetStorage(that.data.userDataInfo[0].UserNo + "MyCollectionProjectList-project_star", res.data.rows);
        that.mySetStorage(that.data.userDataInfo[0].UserNo + "MyCollectionProjectList-itemslength_star", length);
        that.setData({
          project_star: res.data.rows,
          itemslength_star: length
        })
      }
    });
  },

  collect: function (e) {
    var that = this;
    var projectNo = e.target.dataset.projectno;
    var userNo = that.data.userDataInfo[0].UserNo;
    //var userNo = "61106";
    console.log(projectNo, userNo);
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
    if (isConnected) {
      wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        mask: true,
        duration: 20000
      });
      //获取我的收藏列表信息
      wx.request({
        url: config.host + '/Point/OperationCollectionProjectList',
        method: 'GET',
        data: {
          userNo: userNo,
          //userNo: "61106",
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
            // that.hideInput();
          }
        }
      });
    } else {
      wx.showToast({
        title: '当前无网络,操作不可用!',
        image: '/images/warn.png',
        duration: 2000
      });
    }
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

    for (var i = 0; i < that.data.tempProject.length; i++) {
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
      url: "/pages/locationGather/projectDetail/index?projectNo=" + projectNo + "&ProjectName=" + ProjectName
    })
  }
})