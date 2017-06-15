// page/liveInstallDebug/project/index.js
var config = require('../../../config.js');
Page({
  data:{
    ProductCode:""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var ProductCode = options["ProductCode"],
    ProjectNo = options["ProjectNo"],
    ProductDesc = options["ProductDesc"];
    wx.setNavigationBarTitle({
      title:options.ProductCode+"产品调试表"
    });
    that.setData({
        ProductCode:ProductCode,
        ProjectNo:ProjectNo,
        ProductDesc:ProductDesc
    });
    this.getSelectList();
    
  },
  loadDebugList:function(){
    var that=this;
    var ProductCode = this.data.ProductCode;
    wx.request({
      url: config.host +'/Point/GetProductDebugList?productCode='+ProductCode,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if(res.data.result=="S"){
           var data = res.data.rows,
           length = data.length,
           version = {};
           for(var i = 0;i<length;i++){
             var flagchecked= that.data.checked[data[i]["RecordSheetCode"]];
             if(flagchecked){
               data[i]["checked"] = true;
             }
             if(!version[data[i]["RecordSheetCode"]]){
               version[data[i]["RecordSheetCode"]] = data[i]["RecordSheetVersion"]
             }
           }
           that.setData({
            debugList: data,
            version:version
          });
           
        }
        
      }

    })
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
  },
  saveDebugInfo:function(){
    var tempArr = this.data.checkBoxArr,
    length = tempArr.length,
    ProjectNo = this.data.ProjectNo,
    ProductCode = this.data.ProductCode,
    version = this.data.version,
    sendObj = [];
    if(length<=0){
       wx.showToast({
          title: '请选择至少一个选项',
          image: '/images/warn.png',
          duration: 2000
        });
        return false;
    }
    for(var i=0;i<length;i++){
      sendObj.push({
        ProjectNo:ProjectNo,
        ProductCode:ProductCode,
        RecordSheetCode:tempArr[i],
        RecordSheetVersion:version[tempArr[i]]
      });
    }   
    console.log(sendObj);
    wx.request({
      url: config.host +'/Point/SaveProjectProductDebugList',
      method: 'GET',
      data: {
        data: sendObj
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.result == 'S') {
          wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            });
        }else{
          wx.showToast({
              title: '保存失败',
              icon: 'failed',
              duration: 2000
            });
        }
      }
    })
  },
  checkboxChange:function(e){
    var tempArr = e.detail.value;
    this.setData({
      checkBoxArr:tempArr
    });
  },
  getSelectList:function(){
    var that = this;
    var ProjectNo = this.data["ProjectNo"],
    ProductCode = this.data["ProductCode"];
    wx.request({
      url: config.host +'/Point/GetProjectProductDebugList',
      method: 'GET',
      data: {
        projectNo: ProjectNo,
        productCode:ProductCode
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.result == 'S') {
          var data = res.data.rows,
          length = data.length,
          tempArr = {};
          for(var i = 0;i<length;i++){
            var index = data[i].RecordSheetCode;
            tempArr[index] = true;
          }
          that.setData({
            checked:tempArr
          });
          that.loadDebugList();
        }else{
          
        }
      }
    })
  }
})