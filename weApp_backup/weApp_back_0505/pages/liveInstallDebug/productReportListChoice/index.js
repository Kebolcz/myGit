// page/liveInstallDebug/project/index.js
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
      url: 'http://wechat.casco.com.cn:9004/Point/GetProductDebugList?productCode='+ProductCode,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if(res.data.result=="S"){
           var data = res.data.rows,
           length = data.length;
           for(var i = 0;i<length;i++){
             var flagchecked= that.data.checked[data[i]["RecordSheetCode"]];
             if(flagchecked){
               data[i]["checked"] = true;
             }
           }
           
        }
        that.setData({
          debugList: data
        })
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
    sendObj = [];
    for(var i=0;i<length;i++){
      sendObj.push({
        ProjectNo:ProjectNo,
        ProductCode:ProductCode,
        RecordSheetCode:tempArr[i]
      });
    }   
    console.log(sendObj);
    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/SaveProjectProductDebugList',
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
      url: 'http://wechat.casco.com.cn:9004/Point/GetProjectProductDebugList',
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