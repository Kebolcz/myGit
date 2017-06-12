var util = require('../../utils/md5.js')
var config = require('../../config.js')
var app = getApp()
Page({
  data: {
    userNo: '',
    userPass: '',
    tip: '',
    isHiddenToast: true,
  },
  isShowToast: function () {
    this.setData({
      isHiddenToast: false
    })
  },
  btnLogo: function (e) {
    var that = this;
    if (e.detail.value.userNo.length == 0 || e.detail.value.userPass.length == 0) {
      that.setData({
        tip: '提示：用户名和密码不能为空！',
        userNo: '',
        userPass: '',
        showTopTips: true
      })
    } else {
      wx.getNetworkType({
        success: function (res) {
          if (res.networkType != 'none') {
            wx.request({
              url: config.host+'/Point/CheckUserADPass',
              method: 'GET',
              data: {
                userNo: e.detail.value.userNo,
                userPass: e.detail.value.userPass
              },
              header: {
                'Accept': 'application/json'
              },
              success: function (res) {
                if (res.data.result == 'S') {
                  //var password = util.hexMD5(e.detail.value.userPass);
                  //var userno = util.hexMD5(e.detail.value.userNo);
                  var info = res.data.userdataInfo;
                  wx.switchTab({
                    url: '/pages/index/index',
                    success: function (res) {
                      try {
                        wx.setStorageSync("userDataInfo", info)
                      } catch (e) {
                        that.setData({
                          tip: e,
                          showTopTips: true
                        })
                      }
                    }
                  })
                } else {
                  that.setData({
                    tip: res.data.message,
                    showTopTips: true
                  })
                }
              }
            })
          }
          else {
            try {
              var userDataInfo = wx.getStorageSync("userDataInfo")
              if (userDataInfo) {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
              else {
                that.setData({
                  tip: '当前无网络，无法识别身份，请联网验证后在使用',
                  showTopTips: true
                })
              }
            } catch (e) {
            }
          }
        }
      })
    };
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  toastChange: function () {
    this.setData({
      isHiddenToast: true
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType != 'none') {
          var userDataInfo = wx.getStorageSync("userDataInfo")
          console.log('获取用户登录:' + userDataInfo);
          if (userDataInfo) {
            wx.request({
              url: config.host+'/Point/CheckUserADPass',
              method: 'GET',
              data: {
                userNo: userDataInfo[0].UserNo,
                userPass: userDataInfo[0].userPass
              },
              header: {
                'Accept': 'application/json'
              },
              success: function (res) {
                if (res.data.result == 'S') {
                  var info = res.data.userdataInfo;
                  wx.switchTab({
                    url: '/pages/index/index',
                    success: function (res) {
                      try {
                        wx.setStorageSync("userDataInfo", info)
                      } catch (e) {
                      }
                    }
                  })

                } else {
                  that.setData({
                    tip: res.data.message,
                    showTopTips: true
                  })
                }
              }
            })
          }
        }
        else {
          try {
            var userDataInfo = wx.getStorageSync('userDataInfo')
            if (userDataInfo) {
              wx.switchTab({
                url: '/pages/index/index',
                success: function (res) {
                }
              })
            }
            else {
              that.setData({
                tip: '当前无网络，无法识别身份，请联网验证后在使用',
                showTopTips: true
              })
            }
          } catch (e) {
          }
        }
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType != 'none') {
          var userDataInfo = wx.getStorageSync("userDataInfo")
          console.log('获取用户登录:' + userDataInfo);
          if (userDataInfo) {
            wx.request({
              url: config.host+'/Point/CheckUserADPass',
              method: 'GET',
              data: {
                userNo: userDataInfo[0].UserNo,
                userPass: userDataInfo[0].userPass
              },
              header: {
                'Accept': 'application/json'
              },
              success: function (res) {
                if (res.data.result == 'S') {
                  var info = res.data.userdataInfo;
                  wx.switchTab({
                    url: '/pages/index/index',
                    success: function (res) {
                      try {
                        wx.setStorageSync("userDataInfo", info)
                      } catch (e) {
                      }
                    }
                  })

                } else {
                  that.setData({
                    tip: res.data.message,
                    showTopTips: true
                  })
                }
              }
            })
          }
        }
        else {
          try {
            var userDataInfo = wx.getStorageSync('userDataInfo')
            if (userDataInfo) {
              wx.switchTab({
                url: '/pages/index/index',
                success: function (res) {
                }
              })
            }
            else {
              that.setData({
                tip: '当前无网络，无法识别身份，请联网验证后在使用',
                showTopTips: true
              })
            }
          } catch (e) {
          }
        }
      }
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})