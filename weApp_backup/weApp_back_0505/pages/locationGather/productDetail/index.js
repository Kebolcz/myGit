// pages/locationGather/productDetail/index.js
var app = getApp();
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
      mask: true,
      duration: 20000
    });
    wx.setNavigationBarTitle({
      title: options.PointDesc + " ~ " + options.ProductCode
    });
    that.setData({
      projectNo: options.ProjectNo,
      productCode: options.ProductCode,
      productDesc: options.ProductDesc,
      pointCode: options.PointCode,
      pointDesc: options.PointDesc
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
    // 获取缓存数据-scan
    wx.getStorage({
      key: that.data.projectNo + that.data.pointCode + that.data.productCode,
      success: function (res) {
        // success
        that.setData(res.data);
      }
    });
    // 获取缓存数据-photo
    wx.getStorage({
      key: that.data.projectNo + that.data.pointCode + that.data.productCode + 'photo',
      success: function (res) {
        // success
        that.setData(res.data);
      }
    });
    that.loadRecords();
  },
  loadRecords: function () {
    var that = this;
    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/GetProjectProductMainData',
      method: 'GET',
      data: {
        projectNo: that.data.projectNo,
        pointCode: that.data.pointCode,
        prductCode: that.data.productCode
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideToast();
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
    //缓存扫描记录
    var storeArr = {
      scanRecords: arr,
      scanCount: that.data.scanCount - 1
    };
    that.setData(storeArr);
    wx.setStorageSync(that.data.projectNo + that.data.pointCode + that.data.productCode, storeArr);
    // that.update();
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

    //缓存扫描记录
    var storeArr = {
      photoRecordList: arr,
      photoCount: that.data.photoCount - 1
    };
    that.setData(storeArr);
    wx.setStorageSync(that.data.projectNo + that.data.pointCode + that.data.productCode + 'photo', storeArr);

    // that.update();
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 2000
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
    // that.update();
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

        for (var elem of that.data.scanRecords) {
          if (res.result === elem.EquipmentSerialNumber) {
            wx.showToast({
              title: '已存在该序列号记录,请勿重复收集!',
              image: '/images/warn.png',
              duration: 3000
            });
            return false;
          }
        }
        that.setData({
          scanCodeInfo: res.result,
          snInput: res.result
        });
        wx.showToast({
          title: '数据加载中',
          icon: 'loading',
          mask: true,
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
              wx.hideToast();
              that.setData({
                scanCodeQTInfo: res.data.rows[0],
                snCheck: true
              });
              var tempArr = res.data.rows;
              tempArr[0].UserNo = "61106";
              tempArr[0].CreateTime = (new Date()).toLocaleString();
              var arr = that.data.scanRecords;
              arr.splice(0, 0, tempArr[0]);
              //缓存扫描记录
              var storeArr = {
                scanRecords: arr,
                scanCount: that.data.scanCount + 1
              };
              that.setData(storeArr);
              wx.setStorageSync(that.data.projectNo + that.data.pointCode + that.data.productCode, storeArr);
            } else {
              wx.showToast({
                title: '查无此物料数据,请手动输入。',
                image: '/images/warn.png',
                duration: 2000
              });
              that.setData({
                snCheck: false
              });
            }
          }
        });
        // that.update();
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
    var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    if (that.data.snInput.length <= 0 || reg.test(that.data.snInput)) {
      wx.showToast({
        title: '序列号不能为空或包含汉字!',
        image: '/images/warn.png',
        duration: 2000
      });
      return false;
    }

    for (var elem of that.data.scanRecords) {
      if (that.data.snInput === elem.EquipmentSerialNumber) {
        wx.showToast({
          title: '已存在该序列号记录,请勿重复收集!',
          image: '/images/warn.png',
          duration: 3000
        });
        return false;
      }
    }

    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      mask: true,
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
          wx.hideToast();
          that.setData({
            scanCodeQTInfo: res.data.rows[0],
            snCheck: true
          });
          var tempArr = res.data.rows;
          tempArr[0].UserNo = "61106";
          tempArr[0].CreateTime = (new Date()).toLocaleString();
          var arr = that.data.scanRecords;
          arr.splice(0, 0, tempArr[0]);
          //缓存扫描记录
          var storeArr = {
            scanRecords: arr,
            scanCount: that.data.scanCount + 1
          };
          that.setData(storeArr);
          wx.setStorageSync(that.data.projectNo + that.data.pointCode + that.data.productCode, storeArr);
        } else {
          wx.showToast({
            title: '查无此物料数据,请选择对应物料。',
            image: '/images/warn.png',
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
    // that.update();
  },
  storePhotoRecord: function (event) {
    var that = this, data = {};
    console.log(event);
    if (that.data.fileNum <= 0) {
      wx.showToast({
        title: '请至少添加一张照片!',
        image: '/images/warn.png',
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

    //缓存扫描记录
    var storeArr = {
      photoRecordList: arr,
      photoCount: that.data.photoCount + 1
    };
    that.setData(storeArr);
    wx.setStorageSync(that.data.projectNo + that.data.pointCode + that.data.productCode + 'photo', storeArr);
    that.setData({
      files: [],
      fileNum: 0,
      photoDesc: null
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
    //缓存扫描记录
    var storeArr = {
      scanRecords: arr,
      scanCount: that.data.scanCount + 1
    };
    that.setData(storeArr);
    wx.setStorageSync(that.data.projectNo + that.data.pointCode + that.data.productCode, storeArr);

  },
  upLoadScanRecords: function () {
    var result = [], that = this;

    that.data.scanRecords.forEach(function (elem) {
      var temp = {};
      temp.ProjectNo = that.data.projectNo;
      temp.ProductCode = that.data.productCode;
      temp.ProductDesc = that.data.productDesc;
      temp.PointCode = that.data.pointCode;
      temp.PointDesc = that.data.pointDesc;
      temp.EquipmentSerialNumber = elem.EquipmentSerialNumber;
      temp.MaterialNo = elem.MaterialNo;
      temp.EquipmentDesc = elem.EquipmentDesc;
      temp.UserNo = elem.UserNo;
      this.push(temp);
    }, result);


    console.log(result);
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      mask: true,
      duration: 20000
    });
    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/SaveProjectPointEQInfo',
      method: 'POST',
      data: result,
      header: {
        'Accept': 'x-www-form-urlencoded'
      },
      success: function (res) {

        if (res.data.result === 'S') {
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000
          });
          // 从本地缓存中同步移除指定 key 。
          try {
            wx.removeStorageSync(that.data.projectNo + that.data.pointCode + that.data.productCode);
          } catch (e) { }
          that.setData({
            scanRecords: [],
            scanCount: 0,
            snCheck: true,
            scanCheck: true,
            scanCodeInfo: "",
            scanCodeQTInfo: []
          });
          that.loadRecords();
        } else if (res.data.result === 'E') {
          wx.showToast({
            title: res.data.message + ',请稍后再试!',
            image: '/images/warn.png',
            duration: 2000
          });
        }
      }
    });
  },
  upLoadPhotoRecords: function () {
    // 待完善......
  },
  deleteFiles: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '确认操作',
      content: '确认删除该图片吗?',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        var arr = that.data.files;
        arr.splice(index, 1);
        if (res.confirm) {
          that.setData({
            files: arr,
            fileNum: that.data.fileNum - 1
          });
        } else {
          console.log('取消！');
        }
      }
    });
  }
});