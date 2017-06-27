/**
 * ajax请求服务器通用方法
 * @param {Object} targetUrl 请求URL
 * @param {Object} paraData  请求参数
 * @param {Object} successCallBack 成功回调
 * @param {Object} errorCallBack    失败回调
 */
function ajaxRequest(targetUrl, reqOption, successCallBack, errorCallBack) {
    $toast("正在加载数据...");
    
    var reqType = "GET";
    if(reqOption["type"]){
        reqType = reqOption["type"];
    }
    console.log(targetUrl);
    var paraData = {};
    if(reqOption["data"]){
        paraData = reqOption["data"];
    }
    var reqDataType = "text";
    if(reqOption["dataType"]){
        reqDataType = reqOption["dataType"];
    }
    paraData["runtime"] = appConfig.runtime;
    
    var masAppVerifyInfo = ( gWgtAppID + "/" + gSID);
    if(appConfig.requestVerify){
        var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
        masAppVerifyInfo = ( "/" + emmToken.info.accessToken);
    }
    appcan.request.ajax({
        type : reqType,
        url : targetUrl,
        timeout : 20000,
        data : paraData,
        dataType : reqDataType,
        appVerify : appConfig.requestVerify, // 在请求头中加入appVerify字段 true、false
        offline : undefined, // 是否直接调用离线数据，包括true,false,undefined
        headers : {
            "x-mas-app-info" : masAppVerifyInfo
        },
        success : function(data, status, requestCode, response, xhr) {
            $closeToast();
            if (successCallBack) {
                successCallBack(data, status,requestCode,response,xhr);
            }
        },
        error : function(xhr, erroType, error, msg) {
            $closeToast();
            if (errorCallBack) {
                errorCallBack(xhr, erroType, error, msg);
            }
        }
    });
}

/**
 * ajax请求服务器通用方法
 * @param {Object} targetUrl 请求URL
 * @param {Object} paraData  请求参数
 * @param {Object} requestType  请求方式 POST / GET
 * @param {Object} requestContent  请求内容类型
 * @param {Object} successCallBack 成功回调
 * @param {Object} errorCallBack    失败回调
 */
function ajaxRequestByType(targetUrl, paraData, requestType, requestContent, successCallBack, errorCallBack, callBack) {
    appcan.request.ajax({
        type : requestType,
        url : targetUrl,
        timeout : config.TimeOut,
        data : paraData,
        datatype : "json",
        contentType : requestContent,
        headers : {
            "x-mas-app-info" : gAppID + "/" + gSID
        },
        success : function(data, status, requestCode, response, xhr) {
            if (successCallBack) {
                successCallBack(data, status, callBack);
            }
        },
        error : function(xhr, erroType, error, msg) {
            if (errorCallBack) {
                errorCallBack();
            }
        }
    });
}

/**
 * ajax请求同步服务器通用方法
 * @param {Object} targetUrl 请求URL
 * @param {Object} paraData  请求参数
 * @param {Object} requestType  请求方式 POST / GET
 * @param {Object} successCallBack 成功回调
 * @param {Object} errorCallBack    失败回调
 */
function ajaxRequestBySynch(targetUrl, paraData, requestType, successCallBack, errorCallBack, callBack) {
    $.ajax({
        url : targetUrl,
        data : paraData,
        cache : true,
        async : false,
        type : requestType,
        headers : {
            "x-mas-app-info" : gAppID + "/" + gSID
        },
        success : function(data, status, requestCode, response, xhr) {
            if (successCallBack) {
                successCallBack(data, status, callBack);
            }
        },
        error : function(xhr, erroType, error, msg) {
            if (errorCallBack) {
                errorCallBack();
            }
        }
    });
}