//app.js
App({
  onLaunch: function () {
    var that = this
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};

    var head = [];
    var itemSub = {};

  //   itemSub.ProjectNo = 'A1.00111227';
  //   itemSub.PointCode = '000000000000019629';
  //   itemSub.PointDesc = '曹庄动车所';
  //   itemSub.ProductCode = 'CTC';
  //   itemSub.ProductDesc = '调度集中系统';
  //   itemSub.EquipmentSerialNumber = '03W9XD7426135N0J9L';
  //   itemSub.MaterialNo = 'M051400024';
  //   itemSub.EquipmentDesc = '显示器_N_DELL_24寸液晶显示器U2412M';
  //   itemSub.UserNo = 'IRTS系统';
  //   itemSub.Category = 'IRTS系统';
  //   head.push(itemSub);

  //   itemSub.ProjectNo = 'A1.00111227';
  //   itemSub.PointCode = '000000000000019629';
  //   itemSub.PointDesc = '曹庄动车所';
  //   itemSub.ProductCode = 'CTC';
  //   itemSub.ProductDesc = '调度集中系统';
  //   itemSub.EquipmentSerialNumber = '03W9XD7426135N0J9L';
  //   itemSub.MaterialNo = 'M051400024';
  //   itemSub.EquipmentDesc = '显示器_N_DELL_24寸液晶显示器U2412M';
  //   itemSub.UserNo = 'IRTS系统';
  //   itemSub.Category = 'IRTS系统';
  //   head.push(itemSub);

   


   
  //   var hdhhs = JSON.stringify(head);
  //   wx.request({
  //     url: 'http://localhost:5567/Point/SaveProjectPointEQInfo',
  //     method: 'POST',
  //     data: head,
  //     header: {
  //       'Accept': 'x-www-form-urlencoded'
  //     },
  //     success: function (res) {
  //       if (res.data.result == 'S') {
  //       }
  //     }
  //   })

    // var head = {};
    // var itemSub = {};

    // head.ProjectNo = 'A1.00111227';
    // head.PointCode = '000000000000003101';
    // head.ProductCode = 'CDS';
    // head.RecordSheetCode = '1234';
    // head.RecordSheetVersion = 'IRTS系统';
    // head.CreateUser = 'IRTS系统';
    // head.CreateTime = 'IRTS系统';
    // head.SubTime = 'IRTS系统';
    // head.SubUser = 'IRTS系统';
    // head.PMTime = 'IRTS系统';
    // head.PMName = 'IRTS系统';
    // head.Item = [];

    // itemSub.ProcessId = '1';
    // itemSub.ItemId = '1';
    // itemSub.ItemSubId = '1';
    // itemSub.CreateUser = '61106';
    // itemSub.CreateName = '梁晓龙';
    // itemSub.Remark = '测试';
    // itemSub.Image = '';
    // head.Item.push(itemSub);

    // itemSub.ProcessId = '1';
    // itemSub.ItemId = '1';
    // itemSub.ItemSubId = '1';
    // itemSub.CreateUser = '61106';
    // itemSub.CreateName = '梁晓龙';
    // itemSub.Remark = '测试';
    // itemSub.Image = '';
    // head.Item.push(itemSub);
    // var hdhhs = JSON.stringify(head);
    // wx.request({
    //   url: 'http://localhost:5567/Point/SaveRecordSheetResultInfo',
    //   method: 'GET',
    //   data:
    //   {
    //     data: head
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
    userDataInfo: {}
  }
})















