// page/liveInstallDebug/debugDetails/index.js
Page({
  data:{
    RecordSheetCode:"",
    debugList:[],
    debugChoice:[],
    clearFlag:[],
    viewHide:[],
    itemslength:0,
    filesObjArr: {},
    resizeObj:{},
    objArr:[],
    viewHideLabel:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.data["RecordSheetCode"] = options["RecordSheetCode"];
    var that = this;
    wx.request({
      url: 'http://wechat.casco.com.cn:9004/Point/GetProductDebugInfo?RecordSheetCode='+this.data["RecordSheetCode"],
//+this.data["ProductCode"]
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var length = res.data.rows.length,
        tempObj = res.data.rows,
        data=[],
        data2=[],
        resizeObj={},
        objArr=[],
        files=[],
        viewHideLabel=[],
        viewHideMarks={},
        filesObjArr={};
        for(var i = 0;i<length;i++){
            data.push(true);
            data2.push(false);
            var flag1 = tempObj[i]["HeadDescription"];
            if(flag1){
                var flag2 = resizeObj[tempObj[i]["HeadDescription"]];
                if(flag2){
                  resizeObj[tempObj[i]["HeadDescription"]].push(tempObj[i]["Description"]);
                }else{
                  resizeObj[tempObj[i]["HeadDescription"]]=[];
                  resizeObj[tempObj[i]["HeadDescription"]].push(tempObj[i]["Description"]);
                  objArr.push(tempObj[i]["HeadDescription"]);
                  viewHideLabel.push(false);
                }
            }else{
                var flag2 = resizeObj["其他"];
                if(flag2){
                  resizeObj[tempObj[i]["HeadDescription"]].push(tempObj[i]["Description"]);
                }else{
                  resizeObj["其他"]=[];
                  resizeObj[tempObj[i]["HeadDescription"]].push(tempObj[i]["Description"]);
                  objArr.push("其他");
                  viewHideLabel.push(false);
                }
            }   
        }
        length = objArr.length;
        for(var i = 0 ;i<length;i++){
            var lengthj = resizeObj[objArr[i]].length;
            filesObjArr[i]={};
            viewHideMarks[i]={};
            for(var j=0;j<lengthj;j++){
                filesObjArr[i][j]={
                        projectCode:"",
                        stationCode:"",
                        productCode:"",
                        debugType:"",
                        debugIndex:i+"."+j,
                        filesUrls:[]
                }
                viewHideMarks[i][j]=true;
                  
            }
          }
       
        that.setData({
          debugList: res.data.rows,
          debugChoice:res.data.rows2,
          viewHide:data,
          itemslength:length,
          clearFlag:data2,
          resizeObj:resizeObj,
          objArr:objArr,
          viewHideLabel:viewHideLabel,
          files:files,
          filesObjArr:filesObjArr,
          viewHideMarks:viewHideMarks
        })
      }
    })
  },
   widgetsToggle: function (e) {
    var index = e.currentTarget.dataset.toggleindex, 
    indexArr = index.split("_"),
    i = indexArr[0],
    j = indexArr[1],
    tempData = this.data['viewHideMarks'];
    tempData[i][j] = !tempData[i][j]; 
    this.setData({
      viewHideMarks:tempData
    });
  },
  widgetsToggle2:function(e){
    var index = e.currentTarget.dataset.toggleindex, 
    data=[],
    length = this.data['viewHideLabel'].length;
    for (var i=0;i<length;i++){
        data.push(this.data['viewHideLabel'][i]);
    }
    data[index] = !this.data['viewHideLabel'][index];
    this.setData({
      viewHideLabel:data
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  radioChange:function(e){
    console.log(e);
    var rua = e.detail.value;
  },
  photo:function(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      }
    })
  },
  deleteImage:function(e){
      var that = this;
      wx.showModal({
          title: '删除提示',
          content: '是否要删除图片？',
          confirmText: "确定",
          cancelText: "取消",
          success: function (res) {
              console.log(res);
              if (res.confirm) {
                  var indexArr = (e.currentTarget.id).split("_"),
                  i = indexArr[0],
                  j = indexArr[1],
                  k = indexArr[2],
                  tempArr = that.data.filesObjArr;
                  (tempArr[i][j].filesUrls).splice(k,1);
                  that.setData({
                      filesObjArr: tempArr
                  });
              }else{
                  
              }
          }
      });
        
  },
  chooseImage: function (e) {
        var that = this;
        var addindex = e.currentTarget.dataset.addindex;
        var arrIndex = addindex.split("_");
        var i = arrIndex[0];
        var j = arrIndex[1];
        var l = that.data.filesObjArr[i][j].filesUrls.length;
        if(l>=5){
            wx.showToast({
              title: '超过最大数',
              icon: 'warnning',
              duration: 2000
            });
            return false;
        }
        var temp = that.data.filesObjArr[i][j].filesUrls;
        var count = 5-temp.length;
        wx.chooseImage({
            count:count,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempObj = that.data.filesObjArr;
            tempObj[i][j].filesUrls = tempObj[i][j].filesUrls.concat(res.tempFilePaths);
                that.setData({
                    filesObjArr: tempObj
                });
            }
        })
    },
    previewImage: function(e){
        var indexArr = (e.currentTarget.id).split("_");
        var i = indexArr[0],
        j = indexArr[1],
        k = indexArr[2];
        wx.previewImage({
            current: this.data.filesObjArr[i][j].filesUrls[k], // 当前显示图片的http链接
            urls: this.data.filesObjArr[i][j].filesUrls // 需要预览的图片http链接列表
        })
    }
})