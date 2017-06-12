// pages/locationGather/projectDetail/index.js
var app = getApp();
Page({
  data: {
    isHiddenToast: true,
    projectId: "",
    hiddenView: [],
    itemslength: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;

    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 20000
    });
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });

    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/MyK2AdviceDeliveryProjectList',
      method: 'GET',
      data: {
        userNo: '60328'
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
        var length = res.data.rows.length,
          data = [];
        for (var i = 0; i < length; i++) {
          data.push(true);
        }
        that.setData({
          DeliveryLists: res.data.rows,
          hiddenView: data,
          itemslength: length
        })
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
  showDetail: function (e) {
    //跳转到项目详情
    var ProcInstId = e.currentTarget.id;
    wx.navigateTo({
      url: "/pages/LogisticsTracking/TrackList/index?ProcInstId=" + ProcInstId + ""
    })
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
    wx.navigateTo({
      url: "/pages/common/mainData/index?type=point"
    })
  },
  addPoint: function (pointId, pointDesc) {
    var that = this;
    console.log(pointId, pointDesc);
    console.log(that.data.projectId);

    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/SaveProjectPointInfo',
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
            url: 'http://wechat.casco.com.cn:9004/Point/GetProjectPointInfo',
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
            duration: 3000
          });
        }
      }
    });
  },
  navAddProduct: function () {
    wx.navigateTo({
      url: "/pages/common/mainData/index?type=product"
    })
  },
  addProduct: function (productId, productDesc) {
    var that = this;
    console.log(productId, productDesc);
    console.log(that.data.projectId);

    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/SaveProjectProductInfo',
      method: 'GET',
      data: {
        projectNo: that.data.projectId,
        productCode: productId,
        productDesc: productDesc
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
            url: 'http://wechat.casco.com.cn:9004/Point/GetProjectPointInfo',
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
            duration: 3000
          });
        }
      }
    });
  }
})