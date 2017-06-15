// page/liveInstallDebug/project/index.js
var config = require('../../../config.js');
Page({
  data:{
    ProductCode:""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var data = options["ProductCode"],
    ProductDesc = options["ProductDesc"],
    ProjectNo = options["ProjectNo"],
    ProductCode = data,
    PointCode = options["PointCode"];
    that.setData({
          ProductCode:ProductCode,
          ProductDesc:ProductDesc,
          PointCode:PointCode,
          ProjectNo:ProjectNo
    });
    wx.setNavigationBarTitle({
      title:options.ProductDesc+"产品调试表"
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
          that.getDebugList();
        }
      }
    });
  },
  getStorageData:function(){
    var that = this;
    var ProductCode = this.data["ProductCode"],
    ProjectNo = this.data["ProjectNo"],
    PointCode = this.data["PointCode"];
    //调试列表
    wx.getStorage({
      key:"myDebugList"+ProjectNo+ProductCode+PointCode,
      success: function(res) {
          that.setData(res.data);
      } 
    });
  },
  getDebugList:function(){
    var that = this;
    var ProductCode = this.data["ProductCode"],
    ProjectNo = this.data["ProjectNo"],
    PointCode = this.data["PointCode"];
    wx.request({
      url: config.host +'/Point/GetProjectPointProductDebugList',
//+this.data["ProductCode"]
      method: 'GET',
      data: {
        projectNo:ProjectNo,
        productCode:ProductCode,
        pointCode:PointCode
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if(res.data.result=="S"){
          var data = res.data.rows2,length=data.length,
          tempObj={};
          for(var i=0;i<length;i++){
            tempObj[data[i]['RecordSheetCode']]={
              ID:data[i]['ID'],
              RecordSheetVersion:data[i]['RecordSheetVersion'],
              CreateUser:data[i]['CreateUser'],
              CreateTime:data[i]['CreateTime'],
              rate: data[i]['rate'],
            }
          }
          var dataStorage = {
              debugList: res.data.rows,
              hasEditList:tempObj
          };
          that.setData(dataStorage);
          wx.setStorage({
            key:"myDebugList"+ProjectNo+ProductCode+PointCode,
            data:dataStorage
          });
        }
        
      }
    });
  },
  refreshList:function(){
    var that = this;
    that.getDebugList();
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})