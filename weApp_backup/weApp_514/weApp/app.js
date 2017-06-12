//app.js
App({
  onLaunch: function () {
    var that = this
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};

    // var head = [];
    // var item = {};
    // item.ProjectNo = '123';
    // item.ProductCode = '321';
    // item.RecordSheetCode = '1234';
    // head.push(item);
    // item.ProjectNo = '1236';
    // item.ProductCode = '3216';
    // item.RecordSheetCode = '12346';
    // head.push(item);
    // wx.request({
    //   url: 'http://localhost:5567/Point/SaveProjectProductDebugList',
    //   method: 'GET',
    //   data: {
    //     head: head
    //   },
    //   header: {
    //     'Accept': 'application/json'
    //   },
    //   success: function (res) {
    //     if (res.data.result == 'S') {
    //     }
    //   }
    // })

    //if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
    // if (userInfo.nickName) {
    //   wx.login({
    //     success: function (res) {
    //       if (res.code) {
    //         wx.getUserInfo({
    //           success: function (res) {
    //             var objz = {};
    //             objz.avatarUrl = res.userInfo.avatarUrl;
    //             objz.nickName = res.userInfo.nickName;
    //             wx.setStorageSync('userInfo', objz);//存储userInfo
    //           }
    //         });
    //         var appid = 'wx4c6b170996f3daf4';//这里存储了appid、secret、token串  
    //         var secret = '49f83e15ef4358cba99e1ffca555ea31';//这里存储了appid、secret、token串 
    //         var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' +
    //           secret + '&js_code=' + res.code + '&grant_type=authorization_code';
    //         wx.request({
    //           url: l,
    //           data: {},
    //           method: 'GET',
    //           success: function (res) {
    //             wx.request({
    //               url: 'http://localhost:5567/Point/GetQYUserId',
    //               method: 'GET',
    //               data: {
    //                 openid: res.data.openid
    //               },
    //               header: {
    //                 'Accept': 'application/json'
    //               },
    //               success: function (res) {
    //                 if (res.data.result == 'S') {
    //                 }
    //               }
    //             })
    //             var obj = {};
    //             obj.openid = res.data.openid;
    //             obj.expires_in = Date.now() + res.data.expires_in;
    //             wx.setStorageSync('user', obj);//存储openid  
    //           }
    //         });
    //       } else {
    //         console.log('获取用户登录态失败！' + res.errMsg)
    //       }
    //     }
    //   });
    // }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    userDataInfo:{}
  }
})















