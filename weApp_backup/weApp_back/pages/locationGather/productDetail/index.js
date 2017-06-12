// pages/locationGather/productDetail/index.js
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0,
    files: [],
    photoRecordList: [],
    scanRecords: [],
    scanCount: 0,
    //fileNum:选择图片数量,保存后重置为0
    fileNum: 0,
    //photoCount:扫描记录数量,保存+1,删除-1
    photoCount: 0,
    photoDesc: null,
    // photoRecords: [],
    records: [],
    equipmentCount: 0,
    //是否查询到物料信息
    snCheck: true,
    //是扫描获得序列号还是输入序列号
    scanCheck: true
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 20000
    });
    wx.setNavigationBarTitle({
      title: options.PointDesc + " ~ " + options.ProductCode
    });
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/GetProjectProductMainData',
      method: 'GET',
      data: {
        projectNo: options.ProjectNo,
        pointCode: options.PointCode,
        prductCode: options.ProductCode
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.showToast({
          title: '加载完成',
          icon: 'success',
          duration: 1000
        });
        that.setData({
          records: res.data.rows,
          equipmentCount: res.data.total
        })
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
  // 滑动切换tab 
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  // 点击tab切换 
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  deleteScan: function (e) {
    var that = this, data = {};
    var index = Number(e.target.id);
    var arr = that.data.scanRecords;
    arr.splice(index, 1);
    that.setData({
      scanRecords: arr,
      scanCount: that.data.scanCount - 1
    });
    that.update();
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 2000
    });
  },
  deletePhoto: function (e) {
    var that = this, data = {};
    var index = Number(e.target.id);
    var arr = that.data.photoRecordList;
    arr.splice(index, 1);
    that.setData({
      photoRecordList: arr,
      photoCount: that.data.photoCount - 1
    });
    that.update();
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 3000
    });
  },
  deleteRecord: function (e) {
    var that = this, data = {};
    var index = Number(e.target.id);
    var arr = that.data.scanRecords;
    arr.splice(index, 1);
    that.setData({
      scanRecords: arr,
      scanCount: that.data.scanCount - 1
    });
    that.update();
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 2000
    });
  },
  chooseImage: function (e) {
    var that = this;
    var num = Number(that.data.fileNum) === 0 ? 6 : 6 - Number(that.data.fileNum);
    wx.chooseImage({
      count: num, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
          fileNum: that.data.fileNum + res.tempFilePaths.length
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files, // 需要预览的图片http链接列表
      success: function (msg) {
        console.log(msg);
      }
    })
  },
  previewRecordImage: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.photoRecordList[index].files, // 需要预览的图片http链接列表
      success: function (msg) {
        console.log(msg);
      }
    })
  },
  scanCode: function (event) {
    var that = this, data = {};
    wx.scanCode({
      success: function (res) {
        wx.showToast({
          title: '数据加载中',
          icon: 'loading',
          duration: 20000
        });
        console.log("res--->", res);
        wx.request({
          url: 'http://wechat.casco.com.cn:9004/Point/GetSNSearchResult',
          method: 'GET',
          data: {
            sn: res.result
          },
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            //能够根据sn获取物料号码,就写入保存
            if (res.data.total > 0) {
              wx.showToast({
                title: '加载完成',
                icon: 'success',
                duration: 1000
              });
              that.setData({
                scanCodeQTInfo: res.data.rows[0],
                snCheck: true
              });
              var tempArr = res.data.rows;
              tempArr[0].UserNo = "61106";
              tempArr[0].CreateTime = (new Date()).toLocaleString();
              var arr = that.data.scanRecords;
              arr.splice(0, 0, tempArr[0]);
              that.setData({
                scanRecords: arr,
                scanCount: that.data.scanCount + 1
              });
            } else {
              wx.showToast({
                title: '查无此物料数据,请手动输入。',
                icon: 'success',
                duration: 2000
              });
              that.setData({
                snCheck: false
              });
            }
          }
        });
        that.update();
      }
    })
  },
  inputCode: function (e) {
    var that = this;
    that.setData({
      scanCheck: false,
      snInput: e.detail.value
    });
    if (e.detail.value.length <= 0) {
      that.setData({
        scanCheck: true,
        snInput: e.detail.value,
        scanCodeQTInfo: null,
        snCheck: true
      });
    }
  },
  //手动输入sn,点击查询物料
  searchSN: function () {
    var that = this;
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 20000
    });
    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/GetSNSearchResult',
      method: 'GET',
      data: {
        sn: that.data.snInput
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        //能够根据sn获取物料号码,就写入保存
        if (res.data.total > 0) {
          wx.showToast({
            title: '加载完成',
            icon: 'success',
            duration: 1000
          });
          that.setData({
            scanCodeQTInfo: res.data.rows[0],
            snCheck: true
          });
          var tempArr = res.data.rows;
          tempArr[0].UserNo = "61106";
          tempArr[0].CreateTime = (new Date()).toLocaleString();
          var arr = that.data.scanRecords;
          arr.splice(0, 0, tempArr[0]);
          that.setData({
            scanRecords: arr,
            scanCount: that.data.scanCount + 1
          });
        } else {
          wx.showToast({
            title: '查无此物料数据,请手动输入。',
            icon: 'success',
            duration: 2000
          });
          that.setData({
            snCheck: false,
            scanCodeQTInfo: {
              MaterialNo: "",
              EquipmentDesc: ""
            }
          });
        }
      }
    });
    that.update();
  },
  storePhotoRecord: function (event) {
    var that = this, data = {};
    console.log(event);
    if (that.data.fileNum <= 0) {
      wx.showToast({
        title: '请至少添加一张照片!',
        icon: 'success',
        duration: 2000
      });
      return false;
    }
    var tempItem = {};
    tempItem.UserNo = "61106";
    tempItem.CreateTime = (new Date()).toLocaleString();
    if (that.data.photoDesc === "" || that.data.photoDesc === null) {
      tempItem.Desc = event.currentTarget.dataset.desc;
    } else {
      tempItem.Desc = that.data.photoDesc;
    }
    tempItem.files = that.data.files;
    var arr = that.data.photoRecordList;
    arr.splice(0, 0, tempItem);

    that.setData({
      photoRecordList: arr,
      files: [],
      fileNum: 0,
      photoDesc: null,
      photoCount: that.data.photoCount + 1
    });

  },
  bindKeyInput: function (e) {
    this.setData({
      photoDesc: e.detail.value
    });
  },
  chooseProduct: function () {
    wx.navigateTo({
      url: "/pages/common/materialData/index"
    })
  },
  //回写物料号和描述,并添加至扫描记录
  addMaterial: function (id, desc) {
    var that = this;
    console.log(id, desc);
    that.setData({
      scanCodeQTInfo: {
        MaterialNo: id,
        EquipmentDesc: desc
      }
    });

    var tempArr = [{}];
    tempArr[0].EquipmentSerialNumber = that.data.snInput;
    tempArr[0].EquipmentDesc = desc;
    tempArr[0].MaterialNo = id;
    tempArr[0].UserNo = "61106";
    tempArr[0].CreateTime = (new Date()).toLocaleString();
    var arr = that.data.scanRecords;
    arr.splice(0, 0, tempArr[0]);
    that.setData({
      scanRecords: arr,
      scanCount: that.data.scanCount + 1
    });
  }
})