// pages/locationGather/productDetail/index.js
var app = getApp();
var config = require('../../../config.js');
/*
 *  获取并监听网络状态的func
 */
var isConnected = true;
//获取网络状态。
wx.getNetworkType({
  success: function (res) {
    // 返回网络类型, 有效值：
    // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
    isConnected = res.networkType === 'none' ? false : true;
  }
});
//监听网络状态变化。
wx.onNetworkStatusChange(function (res) {
  console.log(res.isConnected)
  console.log(res.networkType)
  isConnected = res.isConnected;
});
/*
 *  获取并监听网络状态的func
 */
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
  //转发当前页面
  onShareAppMessage: function () {
    return {
      title: '站点【' + this.data["pointDesc"] + '】的产品【' + this.data["productDesc"] + '】信息',
      path: '/pages/locationGather/productDetail/index?ProjectNo=' + this.data["projectNo"] + '&ProductCode=' + this.data["productCode"] + '&ProductDesc=' + this.data["productDesc"] + '&PointCode=' + this.data["pointCode"] + '&PointDesc=' + this.data["pointDesc"] + '&shareUserNo=' + this.data.userDataInfo[0].UserNo,
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  mySetStorage: function (key, value) {
    wx.setStorage({
      key: key,
      data: value
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    //加入缓存,缓存options,为下拉刷新缓存参数
    if (options) {
      wx.setStorage({
        key: "productDetailOptions",
        data: options
      })
    }
    //options为undefined时,获取下拉刷新缓存
    if (!options) {
      try {
        options = wx.getStorageSync('productDetailOptions')
      } catch (e) {
        wx.showToast({
          title: '获取下拉刷新缓存失败!',
          image: '/images/warn.png',
          duration: 2000
        });
      }
    }
    that.setData({
      userDataInfo: wx.getStorageSync("userDataInfo")
    });
    //如果存在shareUserNo,说明是转发的链接进入当前页面,这时伪造一个userDataInfo
    if (options.shareUserNo) {
      that.setData({
        userDataInfo: [{
          UserNo: options.shareUserNo
        }]
      });
    }
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
    if (isConnected) {
      wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        mask: true,
        duration: 20000
      });
      wx.request({
        url: config.host + '/Point/GetProjectProductMainData',
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
          //缓存接口返回数据
          //我的项目列表相关
          that.mySetStorage(that.data.projectNo + that.data.pointCode + that.data.productCode + "Records-records", res.data.rows);
          that.mySetStorage(that.data.projectNo + that.data.pointCode + that.data.productCode + "Records-equipmentCount", res.data.total);

          that.setData({
            records: res.data.rows,
            equipmentCount: res.data.total
          })
        }
      });
    } else {
      try {
        var records = wx.getStorageSync(that.data.projectNo + that.data.pointCode + that.data.productCode + 'Records-records');
        var equipmentCount = wx.getStorageSync(that.data.projectNo + that.data.pointCode + that.data.productCode + 'Records-equipmentCount');
        if (records && equipmentCount) {
          that.setData({
            records: records,
            equipmentCount: equipmentCount
          });
        } else {
          wx.showToast({
            title: '当前产品信息离线缓存内容为空!',
            image: '/images/warn.png',
            duration: 2000
          });
        }
      } catch (e) {
        wx.showToast({
          title: '获取无网络缓存失败!',
          image: '/images/warn.png',
          duration: 2000
        });
      }
    }
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh();
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
  chooseImage: function (e) {
    var that = this;
    var num = Number(that.data.fileNum) === 0 ? 1 : 1 - Number(that.data.fileNum);
    wx.chooseImage({
      count: num, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
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
    if (!isConnected) {
      wx.showToast({
        title: '当前无网络,操作不可用!请使用拍照收集功能!',
        image: '/images/warn.png',
        duration: 2000
      });
      that.setData({
        currentTab: 1
      });
      return
    }
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
          url: config.host + '/Point/GetSNSearchResult',
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
              tempArr[0].UserNo = that.data.userDataInfo[0].UserNo;
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
    if (!isConnected) {
      wx.showToast({
        title: '当前无网络,操作不可用!',
        image: '/images/warn.png',
        duration: 2000
      });
      return
    }
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      mask: true,
      duration: 20000
    });
    wx.request({
      url: config.host + '/Point/GetSNSearchResult',
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
          tempArr[0].UserNo = that.data.userDataInfo[0].UserNo;
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
        title: '请添加一张照片!',
        image: '/images/warn.png',
        duration: 2000
      });
      return false;
    }
    var tempItem = {};
    tempItem.UserNo = that.data.userDataInfo[0].UserNo;
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
    tempArr[0].UserNo = that.data.userDataInfo[0].UserNo;
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
    if (!isConnected) {
      wx.showToast({
        title: '当前无网络,操作不可用!',
        image: '/images/warn.png',
        duration: 2000
      });
      return
    }
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      mask: true,
      duration: 20000
    });

    wx.request({
      url: config.host + '/Point/SaveProjectPointEQInfo',
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
  upLoadPhotoRecords: function (e) {
    var that = this;
    if (!isConnected) {
      wx.showToast({
        title: '当前无网络,操作不可用!',
        image: '/images/warn.png',
        duration: 2000
      });
      return
    }
    wx.scanCode({
      success: (res) => {
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
        wx.showToast({
          title: '拍照记录识别中,识别结果请在扫描记录中查看',
          icon: 'loading',
          mask: true,
          duration: 20000
        });
        wx.request({
          url: config.host + '/Point/GetSNSearchResult',
          method: 'GET',
          data: {
            sn: res.result
            // sn: 'CNC6800956'
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
              tempArr[0].UserNo = that.data.userDataInfo[0].UserNo;
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
              wx.showToast({
                title: '识别成功,请在扫描记录中查询!',
                icon: 'success',
                duration: 2000
              });
              //修改图片缓存记录
              var index = Number(e.target.id);
              var photoArr = that.data.photoRecordList;
              photoArr.splice(index, 1);
              var storePhotoArr = {
                photoRecordList: photoArr,
                photoCount: that.data.photoCount - 1
              };
              that.setData(storePhotoArr);
              wx.setStorageSync(that.data.projectNo + that.data.pointCode + that.data.productCode + 'photo', storePhotoArr);
            } else {
              wx.showToast({
                title: '查无此物料数据!',
                image: '/images/warn.png',
                duration: 2000
              });
            }
          }
        });
      },
      fail: (res) => {
        wx.showToast({
          title: '没有识别到有效二维码信息!',
          image: '/images/warn.png',
          duration: 2000
        });
      }
    });
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