var appConfig = {
    //时间配置
    time : {
        // 提示时间配置(毫秒)
        toast : 1800,
        // 请求超时时间 （默认20秒超时）
        request : 20000
    },
    //接口IP地址配置
    masIP : {
        //开发环境
        //dev : "http://192.168.1.101:8101",
        dev : "http://localhost:8101",
        //UAT环境
        uat : "https://emmq.casco.com.cn:8101",
        //生产环境
        prd : "http://emmprd.casco.com.cn:8101"
    },
    //APP运行环境配置,value需要与接口IP地址配置的key照应[dev,uat,uatdebug,pro]
    appID : {
        dev : "aaali10031",
        //UAT环境
        uat : "aaali10031",
        //生产环境
        prd : "aaali10031"
    },
    SID : {
        dev : "public",
        //UAT环境
        uat : "public",
        //生产环境
        prd : "public"
    },
    requestVerify : false,
    //runtime : appcan.getLocVal("appRuntime")
    runtime : 'uat'
};

//private(接口基础地址)
var _masServerBaseUrl = appConfig.masIP[appConfig.runtime];
var _eportalConfig = appcan.getLocVal("EPORTAL_CONFIG");
if(_eportalConfig){
    _eportalConfig = JSON.parse(_eportalConfig);
    _masServerBaseUrl = _eportalConfig["masUrl"];
    //https://emmprd.casco.com.cn:9443
}
var gWgtAppID = appConfig.appID[appConfig.runtime];
var gSID = appConfig.SID[appConfig.runtime];
//门户获取工号测试时
//var gUserInfo={userId:'60250'};
//var gUserInfo={userId:'60312'};
var gUserInfo={userId:'60101'};
//var gUserInfo={userId:'61042'};
//var gUserInfo = JSON.parse(appcan.getLocVal("EMM_USER_INFO")).loginUser.entity;
if (!gUserInfo) {
    appcan.setLocVal("appLoginVailed", "unlogin");
} else {
    appcan.setLocVal("appLoginVailed", "login");
}
// {
// "userId":"",
// "fullName":"",
// "userIcon":"",
// "department":[{dptLd:""}],
// "brcLd":"卡斯柯信号有限公司",
// "personnelld":"23242"
// };
//alert(gUserInfo["userId"]);

//MAS接口全部地址配置
var configMasUrl = {
    // 获取待办数据
    "k2" : _masServerBaseUrl + "/k2/index",
    // 出差报销单据接口
    "ccbxdj" : _masServerBaseUrl + "/main/dj",
    //问题反馈接口
    "pbfeedback" : _masServerBaseUrl + "/pbfeedback/index",
    // 获取默认销售部门
    'dept':_masServerBaseUrl + "/k2/k2_data_sync",
    // 自定义单据
    'customerBill':_masServerBaseUrl + "/k2/index",
    //发起出差申请集成票务申请
    'mixFlow' : _masServerBaseUrl + "/k2/mixFlow",
    //发起安装地变更
    'installation' : _masServerBaseUrl + "/k2/installation",
    //发起外向交货单变更
    'deliveryChange' : _masServerBaseUrl + "/k2/deliveryChange",
    //业务出差申请
    'marketTrip' : _masServerBaseUrl + "/k2/marketTrip"
};
//AJAX 请求Action配置
var configAction = {
    "approve" : {
        //发起出差申请
        "startTravelTask":"startTravelTask"
    },
    "pbfeedback":{
        //获取项目列表
        "getXMXXListDataByName":"getXMXXListDataByName"
    },
    "getInstallation":{
        //安装地变更-->获取安装地标识
        "getLocIde":"get_installation_info",
        //安装地变更-->获取路局城市
        "getBureau":"get_installation_bureau",
        //安装地变更-->获取电务段
        "getSection":"get_installation_section",
        //安装地变更-->获取国家
        "getCountry":"get_installation_country"
    }
};

// window.onerror = function(errorMsg, url, lineNumber, column, errorObj) {
    // var message = 'Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + ' Column: ' + column + ' StackTrace: ' + errorObj;
    // if (errorMsg.indexOf('onPopoverLoadFinishInRootWnd') > -1) {
        // //临时处理这个错误不报出
    // } else {
        // alert(message);
    // }
// };
