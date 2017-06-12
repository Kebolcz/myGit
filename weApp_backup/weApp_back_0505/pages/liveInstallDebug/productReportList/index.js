// page/liveInstallDebug/project/index.js
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
    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/GetProjectPointProductDebugList',
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
              RecordSheetVersion:data[i]['RecordSheetVersion']
            }
          }
            that.setData({
              debugList: res.data.rows,
              hasEditList:tempObj
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
  }
})