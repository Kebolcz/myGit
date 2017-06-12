// pages/common/mainData/index.js
/**
 * 添加铁路站点    : type=point,urlAction=GetPointSearchResult,key=pointDesc
 * 添加站点下产品  : type = product,urlAction=GetProductList,key=null
 */
var app = getApp();
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    sets: [],
    setsCount: 0,
    urlAction: "",
    key: "",
    isTypePoint: true
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    var that = this;
    this.setData({
      inputVal: e.detail.value
    });
    //查询数据库
    var urlT = 'http://wechat.casco.com.cn:9004/Point/' + that.data.urlAction;
    if (!(that.data.key === null)) {
      urlT += '?' + that.data.key + '=' + that.data.inputVal
    }
    wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        mask: true,
        duration: 20000
    });
    wx.request({
      url: urlT,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideToast();
        that.setData({
          sets: res.data.rows,
          setsCount: res.data.total
        })
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    switch (options.type) {
      case 'point':
        wx.setNavigationBarTitle({
          title: "主数据 ~ 站点列表"
        });
        that.setData({
          urlAction: "GetPointSearchResult",
          key: "pointDesc",
          isTypePoint: true,
          title: "站点列表"
        });
        break;
      case 'product':
        wx.setNavigationBarTitle({
          title: "主数据 ~ 产品列表"
        });
        wx.showToast({
            title: '数据加载中',
            icon: 'loading',
            mask: true,
            duration: 20000
        });
        that.setData({
          urlAction: "GetProductList",
          key: null,
          isTypePoint: false,
          title: "产品列表"
        });
        wx.request({
          url: 'http://wechat.casco.com.cn:9004/Point/GetProductList',
          method: 'GET',
          data: {},
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            wx.hideToast();
            that.setData({
              sets: res.data.rows,
              setsCount: res.data.total
            })
          }
        });
        break;
    }
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
  choosePoint: function (e) {
    //获取页面栈
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];

      wx.showModal({
        title: '确认操作',
        content: '确认添加站点【' + e.currentTarget.dataset.desc + '】吗?',
        confirmText: "确认",
        cancelText: "取消",
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            //调用上一个页面的function
            prePage.addPoint(e.currentTarget.id, e.currentTarget.dataset.desc);
            //返回上一个页面
            wx.navigateBack();
            wx.showToast({
              title: '数据加载中',
              icon: 'loading',
              mask: true,
              duration: 20000
          });
          } else {
            console.log('取消！');
          }
        }
      });
    }
  },
  chooseProduct: function (e) {
    //获取页面栈
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];

      wx.showModal({
        title: '确认操作',
        content: '确认添加产品【' + e.currentTarget.dataset.desc + '】吗?',
        confirmText: "确认",
        cancelText: "取消",
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            //调用上一个页面的function
            prePage.addProduct(e.currentTarget.id, e.currentTarget.dataset.desc);
            //返回上一个页面
            wx.navigateBack();
            wx.showToast({
              title: '数据加载中',
              icon: 'loading',
              mask: true,
              duration: 20000
          });
          } else {
            console.log('取消！');
          }
        }
      });
    }
  }
})