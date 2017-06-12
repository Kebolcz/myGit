//获取应用实例
var app = getApp()
Page({
  data: {
    // text:"这是一个页面"
    isHiddenToast: true,
    projectId:"",
    hiddenView:[],
    itemslength:0
  },
  onLoad: function (options) {
    var projectId = options["projectId"];
    this.data["projectId"] = projectId;
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/GetProjectPointInfo?projectNo='+ this.data["projectId"],
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var length = res.data.rows.length,
        data=[];
        for (var i=0;i<length;i++){
          data.push(true);
        }
        that.setData({
          installPoints: res.data.rows,
          installProducts:res.data.rows2,
          hiddenView:data,
          itemslength:length
        })
      }
    })
  },
  widgetsToggle: function (e) {
    var index = e.currentTarget.dataset.toggleindex, 
    data=[];
    length = this.data['hiddenView'].length;
    //data['navShow'] = false;
    for (var i=0;i<length;i++){
        data.push(this.data['hiddenView'][i]);
    }
    data[index] = !this.data['hiddenView'][index];
    this.setData({
      hiddenView:data
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
  }
})





