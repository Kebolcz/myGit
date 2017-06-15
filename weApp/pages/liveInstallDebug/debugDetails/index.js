// page/liveInstallDebug/debugDetails/index.js
var config = require('../../../config.js');
Page({
    data: {
        RecordSheetCode: "",
        debugList: [],
        debugChoice: [],
        clearFlag: [],
        viewHide: [],
        itemslength: 0,
        filesObjArr: {},
        resizeObj: {},
        objArr: [],
        viewHideLabel: [],
        tempObjSub: {}

    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;
        var ProjectNo = options["ProjectNo"],
            ProductCode = options["ProductCode"],
            PointCode = options["PointCode"],
            RecordSheetCode = options["RecordSheetCode"],
            RecordSheetVersion = options["RecordSheetVersion"],
            ProductDesc = options["ProductDesc"],
            ID = options["ID"],
            info = wx.getStorageSync("userDataInfo"),
            UserName = info[0].UserName,
            UserNo = info[0].UserNo;
        this.setData({
            UserNo: UserNo,
            UserName: UserName
        });
        var sendObj = {
            ProjectNo: ProjectNo,
            PointCode: PointCode,
            ProductCode: ProductCode,
            RecordSheetCode: RecordSheetCode,
            RecordSheetVersion: RecordSheetVersion,
            CreateUser: UserNo,
            Item: []
        };
        this.setData({
            RecordSheetCode: RecordSheetCode,
            ProjectNo: ProjectNo,
            ProductCode: ProductCode,
            PointCode: PointCode,
            RecordSheetVersion: RecordSheetVersion,
            RecordID: ID,
            sendObj: sendObj
        });
        var key = "myPhoto" + ProjectNo + PointCode + ProductCode + RecordSheetCode;
        wx.getStorage({
            key: key,
            success: function(res) {
                if (res.data) {
                    that.setData({
                        filesObjArr: res.data
                    });
                    wx.getSavedFileList({
                        success: function(res2) {
                            console.log(res2);
                        }
                    })
                }
            },
            fail: function(res) {
                console.log(res)
            }
        });
        wx.getNetworkType({
            success: function(res) {
                // 返回网络类型, 有效值：
                // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
                var networkType = res.networkType;
                if (networkType == "none") {
                    wx.showToast({
                        title: '无网络，读取缓存数据',
                        icon: 'loading',
                        mask: true,
                        duration: 2000
                    });
                    that.getStorageData();
                    //获取未提交项
                    that.getStorageDataUnsubmit();
                    var tempRuaObj = that.data.LoadRecordObj,
                        obj = that.data.tempObjSub;
                    for (var item in obj) {
                        if (tempRuaObj[item]) {
                            tempRuaObj[item].SubId = obj[item].ItemSubId;
                            tempRuaObj[item].Remark = obj[item].Remark;
                        } else {
                            tempRuaObj[item] = {
                                SubId: obj[item].ItemSubId,
                                Remark: obj[item].Remark
                            }
                        }
                    }
                    var dataStorageRua = {
                        LoadRecordObj: tempRuaObj
                    };
                    that.setData(dataStorageRua);
                } else {
                    if (ID) {
                        that.loadRecords();
                    } else {
                        that.loadDebugList();
                    }
                }
            }
        });


    },
    getStorageData: function() {
        var that = this;
        var ProjectNo = that.data["ProjectNo"],
            ProductCode = that.data["ProductCode"],
            PointCode = that.data["PointCode"],
            RecordSheetCode = that.data["RecordSheetCode"];
        //获取调试列表缓存（同步）
        var dataGet1 = wx.getStorageSync("myDebugDetailRecord" + ProjectNo + ProductCode + PointCode + RecordSheetCode);
        that.setData(dataGet1);
        //获取已调试项（同步）
        dataGet1 = wx.getStorageSync("myDebugDetail" + ProjectNo + ProductCode + PointCode + RecordSheetCode);
        that.setData(dataGet1);

    },
    getStorageDataUnsubmit: function() {
        var that = this;
        var ProjectNo = that.data["ProjectNo"],
            ProductCode = that.data["ProductCode"],
            PointCode = that.data["PointCode"],
            RecordSheetCode = that.data["RecordSheetCode"];
        //获取未提交项(同步)
        var dataGet1 = wx.getStorageSync("myDebugDetailSubmit" + ProjectNo + ProductCode + PointCode + RecordSheetCode);
        that.setData(dataGet1);
    },
    loadDebugList: function() {
        var that = this;
        wx.request({
            url: config.host + '/Point/GetProductDebugInfo?RecordSheetCode=' + this.data["RecordSheetCode"],
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function(res) {
                that.getStorageDataUnsubmit();
                var length = res.data.rows.length,
                    tempObj = res.data.rows,
                    data = [],
                    data2 = [],
                    resizeObj = {},
                    objArr = [],
                    files = [],
                    viewHideLabel = [],
                    viewHideMarks = {},
                    tempRuaObj = that.data.LoadRecordObj,
                    obj = that.data.tempObjSub;
                for (var item in obj) {
                    if (tempRuaObj[item]) {
                        tempRuaObj[item].SubId = obj[item].ItemSubId;
                        tempRuaObj[item].Remark = obj[item].Remark;
                    } else {
                        tempRuaObj[item] = {
                            SubId: obj[item].ItemSubId,
                            Remark: obj[item].Remark
                        }
                    }
                }
                var dataStorageRua = {
                    LoadRecordObj: tempRuaObj
                };
                that.setData(dataStorageRua);
                // for (var i = 0; i < length; i++) {
                //     tempObj[data[i].ItemId] = {
                //         SubId: data[i].ItemSubId,
                //         Remark: data[i].Remark
                //     }
                // }

                // var dataStorage = {
                //     LoadRecordObj: tempObj
                // };
                for (var i = 0; i < length; i++) {
                    data.push(true);
                    data2.push(false);
                    var flag1 = tempObj[i]["HeadDescription"];
                    if (flag1) {
                        var flag2 = resizeObj[tempObj[i]["HeadDescription"]];
                        if (flag2) {
                            resizeObj[tempObj[i]["HeadDescription"]].push({
                                Description: tempObj[i]["Description"],
                                ID: tempObj[i]["ID"]
                            });
                        } else {
                            resizeObj[tempObj[i]["HeadDescription"]] = [];
                            resizeObj[tempObj[i]["HeadDescription"]].push({
                                Description: tempObj[i]["Description"],
                                ID: tempObj[i]["ID"]
                            });
                            objArr.push(tempObj[i]["HeadDescription"]);
                            viewHideLabel.push(false);
                        }
                    } else {
                        var flag2 = resizeObj["其他"];
                        if (flag2) {
                            resizeObj["其他"].push({
                                Description: tempObj[i]["Description"],
                                ID: tempObj[i]["ID"]
                            });
                        } else {
                            resizeObj["其他"] = [];
                            resizeObj["其他"].push({
                                Description: tempObj[i]["Description"],
                                ID: tempObj[i]["ID"]
                            });
                            objArr.push("其他");
                            viewHideLabel.push(false);
                        }
                    }
                }
                length = objArr.length;
                for (var i = 0; i < length; i++) {
                    var lengthj = resizeObj[objArr[i]].length;
                    viewHideMarks[i] = {};
                    for (var j = 0; j < lengthj; j++) {
                        viewHideMarks[i][j] = true;

                    }
                }

                var dataStorage = {
                    debugList: res.data.rows,
                    debugChoice: res.data.rows2,
                    viewHide: data,
                    itemslength: length,
                    clearFlag: data2,
                    resizeObj: resizeObj,
                    objArr: objArr,
                    viewHideLabel: viewHideLabel,
                    files: files,
                    viewHideMarks: viewHideMarks
                };
                that.setData(dataStorage);
                var ProjectNo = that.data["ProjectNo"],
                    ProductCode = that.data["ProductCode"],
                    PointCode = that.data["PointCode"],
                    RecordSheetCode = that.data["RecordSheetCode"];
                wx.setStorage({
                    key: "myDebugDetail" + ProjectNo + ProductCode + PointCode + RecordSheetCode,
                    data: dataStorage
                });
            }
        })
    },
    widgetsToggle: function(e) {
        var index = e.currentTarget.dataset.toggleindex,
            indexArr = index.split("_"),
            i = indexArr[0],
            j = indexArr[1],
            tempData = this.data['viewHideMarks'];
        tempData[i][j] = !tempData[i][j];
        this.setData({
            viewHideMarks: tempData
        });
    },
    widgetsToggle2: function(e) {
        var index = e.currentTarget.dataset.toggleindex,
            data = [],
            length = this.data['viewHideLabel'].length;
        for (var i = 0; i < length; i++) {
            data.push(this.data['viewHideLabel'][i]);
        }
        data[index] = !this.data['viewHideLabel'][index];
        this.setData({
            viewHideLabel: data
        });
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        prePage.refreshList();
    },
    radioChange: function(e) {
        var that = this;
        console.log(e);
        var name = e.currentTarget.dataset.index,
            value = e.detail.value,
            CreateUser = this.data.UserNo,
            CreateName = this.data.UserName,
            midSub = this.data.tempObjSub;
        if (midSub[name]) {
            midSub[name].ItemSubId = value;
        } else {
            var tempObj = {
                ItemId: name,
                ItemSubId: value,
                CreateUser: CreateUser,
                CreateName: CreateName,
                Remark: '',
                Image: ''
            };
            midSub[name] = tempObj;
        }
        var tempObjSublength = 0;
        for (var i in midSub) {
            tempObjSublength++;
        }
        var dataStorage = {
            tempObjSub: midSub,
            tempObjSublength: tempObjSublength
        };
        that.setData(dataStorage);
        var ProjectNo = that.data["ProjectNo"],
            ProductCode = that.data["ProductCode"],
            PointCode = that.data["PointCode"],
            RecordSheetCode = that.data["RecordSheetCode"];
        wx.setStorage({
            key: "myDebugDetailSubmit" + ProjectNo + ProductCode + PointCode + RecordSheetCode,
            data: dataStorage
        });
    },
    textareaBlur: function(e) {
        var i = e.currentTarget.dataset.index,
            obj = this.data.LoadRecordObj;
        if (!obj[i]) {
            return false;
        } else {
            var val = e.detail.value;

            if (val == obj[i].Remark) {
                return false;
            }
            var CreateUser = this.data.UserNo,
                CreateName = this.data.UserName;
            var tempObj = {
                    ItemId: i,
                    ItemSubId: obj[i].SubId,
                    CreateUser: CreateUser,
                    CreateName: CreateName,
                    Remark: '',
                    Image: ''
                },
                midSub = this.data.tempObjSub;
            midSub[i] = tempObj;
            obj[i].Remark = val;
            this.setData({
                LoadRecordObj: obj,
                tempObjSub: midSub
            })
        }
    },
    photo: function() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
            }
        })
    },
    deleteImage: function(e) {
        var that = this;
        wx.showModal({
            title: '删除提示',
            content: '是否要删除图片？',
            confirmText: "确定",
            cancelText: "取消",
            success: function(res) {
                console.log(res);
                if (res.confirm) {
                    var indexArr = (e.currentTarget.id).split("_"),
                        i = indexArr[0],
                        j = indexArr[1],
                        tempArr = that.data.filesObjArr;
                    tempArr[i].splice(j, 1);
                    that.setData({
                        filesObjArr: tempArr
                    });
                } else {

                }
            }
        });

    },
    chooseImage: function(e) {
        var that = this;
        var id = e.currentTarget.dataset.addindex,
            l,
            filesObjArr = that.data.filesObjArr;
        if (!that.data.filesObjArr[id]) {
            l = 0;
            filesObjArr[id] = [];
            that.setData({
                filesObjArr: filesObjArr
            });
        } else {
            l = that.data.filesObjArr[id].length;
        }

        if (l >= 5) {
            wx.showToast({
                title: '超过最大数',
                icon: 'warnning',
                duration: 2000
            });
            return false;
        }
        var count = 5 - l;
        wx.chooseImage({
            count: count,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempObj = that.data.filesObjArr;
                tempObj[id] = tempObj[id].concat(res.tempFilePaths);
                that.setData({
                    filesObjArr: tempObj
                });
                var ProjectNo = that.data.ProjectNo,
                    PointCode = that.data.PointCode,
                    ProductCode = that.data.ProductCode,
                    RecordSheetCode = that.data.RecordSheetCode,
                    key;
                key = "myPhoto" + ProjectNo + PointCode + ProductCode + RecordSheetCode;
                wx.setStorage({
                    key: key,
                    data: tempObj,
                    success: function(res) {
                        console.log("success:" + res);
                    },
                    fail: function(res) {
                        console.log("fail:" + res);
                    }
                });

            }
        })
    },
    previewImage: function(e) {
        var indexArr = (e.currentTarget.id).split("_");
        var i = indexArr[0],
            j = indexArr[1];
        wx.previewImage({
            current: this.data.filesObjArr[i][j], // 当前显示图片的http链接
            urls: this.data.filesObjArr[i] // 需要预览的图片http链接列表
        })
    },
    saveDebugInfo: function(e) {
        var that = this;
        var valueObj = e.detail.value,
            midSub = this.data.tempObjSub;
        for (var i in valueObj) {
            var arr = i.split("_"),
                flag1 = arr[0];
            if (flag1 == "marks") {
                var flag2 = arr[1];
                if (midSub[flag2]) {
                    midSub[flag2].Remark = valueObj[i];
                }
            } else if (flag1 == "photos") {

            }
        }
        this.setData({
            tempObjSub: midSub
        });
        midSub = this.data.tempObjSub;
        var sendObj = this.data.sendObj,
            dataSend = [];
        for (var i in midSub) {
            dataSend.push(midSub[i]);
        }
        if (dataSend.length <= 0) {
            wx.showToast({
                title: '无改动无需保存',
                image: '/images/warn.png',
                duration: 2000
            });
            return false;
        }
        sendObj.Item = dataSend;
        wx.showToast({
            title: '正在保存',
            icon: 'loading',
            duration: 20000,
            mask: true
        });
        wx.request({
            url: config.host + '/Point/SaveRecordSheetResultInfo',
            method: 'POST',
            data: sendObj,
            // {
            //   data: sendObj
            // },
            header: {
                // 'Accept': 'application/json'
                'Accept': 'x-www-form-urlencoded'
            },
            success: function(res) {
                if (res.data.result == 'S') {
                    wx.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 1500
                    });
                    var tempObjSub = {};
                    that.setData({
                        tempObjSub: tempObjSub,
                        tempObjSublength: 0
                    });
                    var ProjectNo = that.data["ProjectNo"],
                        ProductCode = that.data["ProductCode"],
                        PointCode = that.data["PointCode"],
                        RecordSheetCode = that.data["RecordSheetCode"];
                    wx.setStorage({
                        key: "myDebugDetailSubmit" + ProjectNo + ProductCode + PointCode + RecordSheetCode,
                        data: {
                            tempObjSub: tempObjSub,
                            tempObjSublength: 0
                        }
                    });
                } else {
                    wx.showToast({
                        title: '保存失败',
                        image: '/images/warn.png',
                        duration: 2000
                    });
                }
            }
        })
    },
    loadRecords: function() {
        var that = this;
        var ID = this.data.RecordID;
        wx.request({
            url: config.host + '/Point/GetProductDebugResultInfo',
            method: 'GET',
            data: {
                ID: ID
            },
            header: {
                'Accept': 'application/json'
            },
            success: function(res) {
                if (res.data.result == 'S') {
                    var data = res.data.rows,
                        length = data.length,
                        tempObj = {};
                    for (var i = 0; i < length; i++) {
                        tempObj[data[i].ItemId] = {
                            SubId: data[i].ItemSubId,
                            Remark: data[i].Remark
                        }
                    }

                    var dataStorage = {
                        LoadRecordObj: tempObj
                    };
                    that.setData(dataStorage);
                    var ProjectNo = that.data["ProjectNo"],
                        ProductCode = that.data["ProductCode"],
                        PointCode = that.data["PointCode"],
                        RecordSheetCode = that.data["RecordSheetCode"];
                    wx.setStorage({
                        key: "myDebugDetailRecord" + ProjectNo + ProductCode + PointCode + RecordSheetCode,
                        data: dataStorage
                    });

                    that.loadDebugList();

                }
            }
        })
    }
})