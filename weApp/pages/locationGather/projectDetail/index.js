// pages/locationGather/projectDetail/index.js
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
    isHiddenToast: true,
    projectId: "",
    hiddenView: [],
    itemslength: 0
  },
  //转发当前页面
  onShareAppMessage: function () {
    return {
      title: '项目【' + this.data["projectName"] + '】的站点列表',
      path: '/pages/locationGather/projectDetail/index?ProjectName=' + this.data["projectName"] + '&projectNo=' + this.data["projectId"],
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
  mySetStorage: function (key, value) {
    wx.setStorage({
      key: key,
      data: value
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    //加入缓存,缓存options,为下拉刷新缓存参数
    if (options) {
      wx.setStorage({
        key: "projectDetailOptions",
        data: options
      })
    }
    //options为undefined时,获取下拉刷新缓存
    if (!options) {
      try {
        options = wx.getStorageSync('projectDetailOptions')
      } catch (e) {
        wx.showToast({
          title: '获取下拉刷新缓存失败!',
          image: '/images/warn.png',
          duration: 2000
        });
      }
    }
    wx.setNavigationBarTitle({
      title: options.ProjectName
    });
    var projectId = options.projectNo;
    that.setData({
      projectId: options.projectNo,
      projectName: options.ProjectName
    })
    this.data["projectId"] = projectId;
    console.log('onLoad');

    if (isConnected) {
      wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        mask: true,
        duration: 20000
      });
      wx.request({
        url: config.host + '/Point/GetProjectPointInfo',
        method: 'GET',
        data: {
          projectNo: this.data["projectId"]
        },
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          wx.hideToast();
          var length = res.data.rows.length,
            data = [];
          for (var i = 0; i < length; i++) {
            data.push(true);
          }
          //缓存接口返回数据
          //我的项目列表相关
          that.mySetStorage(that.data["projectId"] + "ProjectPointInfo-installPoints", res.data.rows);
          that.mySetStorage(that.data["projectId"] + "ProjectPointInfo-installProducts", res.data.rows2);
          that.mySetStorage(that.data["projectId"] + "ProjectPointInfo-hiddenView", data);
          that.mySetStorage(that.data["projectId"] + "ProjectPointInfo-itemslength", length);

          that.setData({
            installPoints: res.data.rows,
            installProducts: res.data.rows2,
            hiddenView: data,
            itemslength: length
          })
        }
      });
    } else {
      try {
        var installPoints = wx.getStorageSync(that.data["projectId"] + 'ProjectPointInfo-installPoints');
        var installProducts = wx.getStorageSync(that.data["projectId"] + 'ProjectPointInfo-installProducts');
        var hiddenView = wx.getStorageSync(that.data["projectId"] + 'ProjectPointInfo-hiddenView');
        var itemslength = wx.getStorageSync(that.data["projectId"] + 'ProjectPointInfo-itemslength');
        if (installPoints && installProducts && hiddenView && itemslength) {
          that.setData({
            installPoints: installPoints,
            installProducts: installProducts,
            hiddenView: hiddenView,
            itemslength: itemslength
          });
        } else {
          wx.showToast({
            title: '当前项目信息离线缓存内容为空!',
            image: '/images/warn.png',
            duration: 2000
          });
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
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh();
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
  },
  addLocation: function () {
    if (isConnected) {
      wx.navigateTo({
        url: "/pages/common/mainData/index?type=point"
      })
    } else {
      wx.showToast({
        title: '当前无网络,操作不可用!',
        image: '/images/warn.png',
        duration: 2000
      });
    }
  },
  addPoint: function (pointId, pointDesc) {
    var that = this;
    console.log(pointId, pointDesc);
    console.log(that.data.projectId);
    if (!isConnected) {
      wx.showToast({
        title: '当前无网络,操作不可用!',
        image: '/images/warn.png',
        duration: 2000
      });
      return
    }
    wx.request({
      url: config.host + '/Point/SaveProjectPointInfo',
      method: 'GET',
      data: {
        projectNo: that.data.projectId,
        pointCode: pointId,
        pointDesc: pointDesc
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.result === "S") {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          });
          wx.request({
            url: config.host + '/Point/GetProjectPointInfo',
            method: 'GET',
            data: {
              projectNo: that.data["projectId"]
            },
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              var length = res.data.rows.length,
                data = [];
              for (var i = 0; i < length; i++) {
                data.push(true);
              }
              that.setData({
                installPoints: res.data.rows,
                installProducts: res.data.rows2,
                hiddenView: data,
                itemslength: length
              })
            }
          });
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
  navAddProduct: function (e) {
    var that = this;
    if (!isConnected) {
      wx.showToast({
        title: '当前无网络,操作不可用!',
        image: '/images/warn.png',
        duration: 2000
      });
      return
    }
    that.setData({
      selectedPonit: e.currentTarget.dataset.pointcode
    });
    wx.navigateTo({
      url: "/pages/common/mainData/index?type=product"
    });
  },
  addProduct: function (productId, productDesc) {
    var that = this;
    console.log(productId, productDesc);
    console.log(that.data.projectId);
    console.log(that.data.selectedPonit);
    if (!isConnected) {
      wx.showToast({
        title: '当前无网络,操作不可用!',
        image: '/images/warn.png',
        duration: 2000
      });
      return
    }
    wx.request({
      url: config.host + '/Point/SaveProjectProductInfo',
      method: 'GET',
      data: {
        projectNo: that.data.projectId,
        productCode: productId,
        productDesc: productDesc,
        pointCode: that.data.selectedPonit
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.result === "S") {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          });
          wx.request({
            url: config.host + '/Point/GetProjectPointInfo',
            method: 'GET',
            data: {
              projectNo: that.data["projectId"]
            },
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              var length = res.data.rows.length,
                data = [];
              for (var i = 0; i < length; i++) {
                data.push(true);
              }
              that.setData({
                installPoints: res.data.rows,
                installProducts: res.data.rows2,
                hiddenView: data,
                itemslength: length
              })
            }
          });
        } else {
          wx.showToast({
            title: res.data.message,
            image: '/images/warn.png',
            duration: 2000
          });
        }
      }
    });
  }
})