// pages/ProjectManagement/index/index.js
var sliderWidth = 0; // 需要设置slider的宽度，用于计算中间位置
var config = require("../../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["项目列表", "人员列表"],
    tabsMission: ["负责任务", "历史任务"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    icon: {
      icon60: '/images/project/lieche.png',
      icon50: '/images/man.png',
      icon40: '/images/project/lieche.png',
      icon30: ''
    },
    loadLength: 10,
    textColor: {
      "checked": "#515151",
      "unchecked": "#888888"
    },
    noMore: false,
    dataForTabbar: [
      {
        iCount: 6, //未读数目
        imgStr: "xiangmu",
        sIconUrl: Img("xiangmu"), //按钮图标
        sTitle: "项目",//按钮名称
        code: "Proj"

      },
      {
        iCount: 0, //未读数目
        imgStr: "renwu",
        sIconUrl: Img("renwu", "checked"), //按钮图标
        sTitle: "任务", //按钮名称
        checked: true,
        code: "Miss"
      },
      {
        iCount: 0, //未读数目
        imgStr: "dongtai",
        sIconUrl: Img("dongtai"), //按钮图标
        sTitle: "动态", //按钮名称
        code: "Dyna"
      },
      {
        iCount: 0, //未读数目
        imgStr: "rili",
        sIconUrl: Img("rili"), //按钮图标
        sTitle: "日历", //按钮名称
        code: "Cala"
      },
      {
        iCount: 0, //未读数目
        imgStr: "zhoubao",
        sIconUrl: Img("zhoubao"), //按钮图标
        sTitle: "周报", //按钮名称
        code: "Week"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth,
          windowHeight = res.windowHeight,
          scrollHeight = windowHeight / windowWidth * 750 - 274,
          data = {},
          temp = that.data.dataForTabbar;
        for (var i in temp) {
          var code = temp[i].code,
            sliderLeft = "sliderLeft" + code,
            sliderOffset = "sliderOffset" + code,
            activeIndex = "activeIndex" + code;
          if (!data[sliderLeft]) {
            data[sliderLeft] = 0;
          }
          if (!data[sliderOffset]) {
            data[sliderOffset] = windowHeight / that.data.tabs.length * that.data.activeIndex;
          }
          data["scrollHeight"] = scrollHeight;
          data[activeIndex] = 0;
        }
        that.setData(data);
      }
    });

    wx.request({
      url: config.host + '/project/MyProjectList',
      data: {
        userNo: '61106'
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        if (res.data.result == "S") {
          var projectList = res.data.rows,
            projectListShow = [],
            loadLength = projectList.length;
          that.data.dataForTabbar[0].iCount = projectList.length;
          for (var i = 0; i < loadLength; i++) {
            projectListShow.push(projectList[i])
          }

          that.setData({
            projectList: projectList,
            projectListShow: projectListShow,
            dataForTabbar: that.data.dataForTabbar,
            noMore: true
          });
        }


      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  inputTyping: function (e) {
    var strSearch = e.detail.value,
      eType = e.currentTarget.dataset.type,
      inputVal = "inputVal" + eType,
      data = {};
    data[inputVal] = strSearch;
    this.setData(data);
    var tempArr = this.data.projectList;
    if (!!strSearch && tempArr.length > 0) {
      var projectListShow = [];
      for (var i = 0; i < tempArr.length; i++) {
        var name = tempArr[i].ProjectName,
          code = tempArr[i].ProjectCode;
        if (name.indexOf(strSearch) > -1 || code.indexOf(strSearch) > -1) {
          projectListShow.push(tempArr[i]);
        }
      }
      this.setData({
        projectListShow: projectListShow,
        noMore: true
      });
    } else {
      this.setData({
        projectListShow: this.data.projectList,
        noMore: true
      });
    }
  },
  showInput: function (e) {
    var eType = e.currentTarget.dataset.type,
      isBarShow = "isBarShow" + eType,
      data = {};
    data[isBarShow] = true;
    this.setData(data);
  },
  hideInput: function (e) {
    var eType = e.currentTarget.dataset.type,
      isBarShow = "isBarShow" + eType,
      data = {};
    data[isBarShow] = false;
    this.setData(data);
  },
  clearInput: function (e) {
    var eType = e.currentTarget.dataset.type,
      inputVal = "inputVal" + eType,
      data = {};
    data[inputVal] = "";
    this.setData(data);
  },
  tabClick: function (e) {
    var eType = e.currentTarget.dataset.type,
      data = {},
      indexType = "activeIndex" + eType,
      offsetType = "sliderOffset" + eType;
    data[indexType] = e.currentTarget.id;
    data[offsetType] = e.currentTarget.offsetLeft;
    this.setData(data);

  },
  //底部tarBar切换效果
  onTabItemTap: function (e) {
    var data = this.data.dataForTabbar,
      i = e.currentTarget.dataset.clickindex;
    for (var j = 0; j < data.length; j++) {
      data[j]["sIconUrl"] = Img(data[j]["imgStr"]);
      data[j]["checked"] = false;
    }
    data[i]["sIconUrl"] = Img(data[i]["imgStr"], "checked");
    data[i]["checked"] = true;
    this.setData({
      dataForTabbar: data
    });
  },
  //   loadMoreProj:function(e){
  //       var projectListShow = this.data.projectListShow,
  //       projectList = this.data.projectList,
  //       concatArr = [],
  //       i = projectListShow.length,
  //       i2 = this.data.loadLength,
  //       k = projectList.length;
  //       if(i<k){
  //         if(i+i2<k){
  //             concatArr = projectList.slice(i,i+i2);
  //         }else{
  //             concatArr = projectList.slice(i,k)
  //         }
  //         projectListShow=projectListShow.concat(concatArr);
  //         this.setData({
  //             projectListShow:projectListShow
  //         });
  //       }
  //       var flag = projectListShow.length==k;
  //       this.setData({
  //           noMore:flag
  //       });


  //   }

  //加载任务列表
  loadMissions: function () {
    wx.request({
      url: config.host + '/project/MyMissionList',
      data: {
        userNo: '61106'
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        if (res.data.result == "S") {
          var missionList = res.data.rows,
            missionListShow = [],
            loadLength = missionList.length;
          that.data.dataForTabbar[1].iCount = missionList.length;
          for (var i = 0; i < loadLength; i++) {
            missionListShow.push(missionList[i])
          }

          that.setData({
            missionList: missionList,
            missionListShow: missionListShow,
            dataForTabbar: that.data.dataForTabbar,
            noMoreMission: true
          });
        }


      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
})
function Img(filename, state) {
  //定义img文件所在的文件夹
  const IMG_FILES_FOLDER = "/images/project/";
  //定义img文件的后缀
  const SUBFIX = ".png";
  //数组转换字符串
  if (state === undefined) {
    return [
      IMG_FILES_FOLDER,
      filename,
      SUBFIX
    ].join("");
  }
  //数组转换字符串并用-做分割
  else {
    return [
      IMG_FILES_FOLDER,
      filename,
      "-",
      state,
      SUBFIX
    ].join("");
  }
}
