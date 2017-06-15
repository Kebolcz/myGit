// pages/locationGather/projectDetail/index.js
var config = require('../../../config.js');
var app = getApp();
Page({
  data: {
    isHiddenToast: true,
    projectId:"",
    hiddenView:[],
    itemslength:0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.setNavigationBarTitle({
      title: options.ProjectName
    });
    wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        duration: 20000
    });
    var projectId = options.projectNo;
    that.setData({
      projectId: options.projectNo
    })
    this.data["projectId"] = projectId;
    console.log('onLoad');
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
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
          that.loadList();
        }
      }
    });
  },
  getStorageData:function(){
    var that = this;
    //我的项目
    wx.getStorage({
      key:"myProject" + that.data.projectId,
      success: function(res) {
          that.setData(res.data);
      } 
    });
  },
  loadList:function(e){
    var that = this;
    wx.request({
      url: config.host +'/Point/GetProjectPointInfo',
      method: 'GET',
      data: {
        projectNo: this.data["projectId"]
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
        var tempArr = res.data.rows2,
        obj = {},
        l = tempArr.length;
        for (var i = 0;i<l;i++){
          var flag1 = tempArr[i].PointCode;
          if(flag1){
            var flag2 = obj[flag1];
            if(flag2){
              obj[flag1].push({
                ProductCode:tempArr[i].ProductCode,
                ProductDesc:tempArr[i].ProductDesc,
                rate: tempArr[i].rate
              });
            }else{
              obj[flag1] = [];
              obj[flag1].push({
                ProductCode:tempArr[i].ProductCode,
                ProductDesc:tempArr[i].ProductDesc,
                rate: tempArr[i].rate
              });
            }
          }
          
        }
        var dataStorage = {
          installPoints: res.data.rows,
          installProdArrs: res.data.rows2,
          pointProdunctArr:obj,
          hiddenView: data,
          itemslength: length
        };
        that.setData(dataStorage);
        wx.setStorage({
          key:"myProject"+that.data.projectId,
          data:dataStorage
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
      url: config.host +'/Point/SaveProjectPointInfo',
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
            url: config.host +'/Point/GetProjectPointInfo',
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
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 3000
          });
        }
      }
    });
  },
  navAddProduct:function(e){
    var that = this;
    that.setData({
      selectedPonit:e.currentTarget.dataset.pointcode
    });
    wx.navigateTo({
      url: "/pages/common/mainData/index?type=product"
    });
  },
  addProduct: function (productId, productDesc) {
    var that = this;
    console.log(productId, productDesc);
    console.log(that.data.projectId);

    wx.request({
      url: config.host +'/Point/SaveProjectProductInfo',
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
          that.loadList();
        }else{
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