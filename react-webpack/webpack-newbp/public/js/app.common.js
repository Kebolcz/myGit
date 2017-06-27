/**
 * toast提示框 800
 */
function $toast(mes, t) {
    uexWindow.toast( t ? '0' : '1', '5', mes, t ? t : 0);
}

/**
 * 手动关闭加载框
 */
function $closeToast() {
    uexWindow.closeToast();
}

appcan.extend({
    isEmpty : function(str) {
        if (str == null || str == "" || str == undefined) {
            return true;
        }
        return false;
    }
});
//表情符号验证
function isEmoji(substring) {  
    for ( var i = 0; i < substring.length; i++) {  
        var hs = substring.charCodeAt(i);  
        if (0xd800 <= hs && hs <= 0xdbff) {  
            if (substring.length > 1) {  
                var ls = substring.charCodeAt(i + 1);  
                var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;  
                if (0x1d000 <= uc && uc <= 0x1f77f) {  
                    return true;  
                }  
            }  
        } else if (substring.length > 1) {  
            var ls = substring.charCodeAt(i + 1);  
            if (ls == 0x20e3) {  
                return true;  
            }  
        } else {  
            if (0x2100 <= hs && hs <= 0x27ff) {  
                return true;  
            } else if (0x2B05 <= hs && hs <= 0x2b07) {  
                return true;  
            } else if (0x2934 <= hs && hs <= 0x2935) {  
                return true;  
            } else if (0x3297 <= hs && hs <= 0x3299) {  
                return true;  
            } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030  
                    || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b  
                    || hs == 0x2b50) {  
                return true;  
            }  
        }  
    }  
}  
//判断是否为空
function m_isEmpty(str) {
    if (str == "" || str.length == 0 || str == null) {
        return true;
    }
}
//是否为正整数 
function isPositiveNum(s){ 
    var re = /^[0-9]*[1-9][0-9]*$/ ;  
    return re.test(s);  
} 
//是否为正数
function m_isNumber(num){
  var reg = /^\d+(?=\.{0,1}\d+$|$)/ ;
  if(reg.test(num)) {
    return true;
  }
  return false;  
}

function isOnline(cbFn) {
    appcan.device.getInfo(13, function(err, data) {
        if (err) {
            appcan.window.openToast('获取手机网络状态失败' + err, 1000);
            cbFn(true);
        } else {
            var retJson = JSON.parse(data);
            var connectStatus = parseInt(retJson.connectStatus);
            //0wifi,>0移动网络
            if (connectStatus >= 0) {
                cbFn(true);
            } else {
                //离线
                cbFn(false);
            }
        }
    });
}

function includeVoiceRec(fileUrl, contentID, cbFn){
    $.ajax({
        url: fileUrl,
        async: false,
        success: function (ret) {
            $("#"+contentID).html($.trim(ret));
            //alert(ret);
            appcan.window.subscribe("uexXunfei.onRecognizeError",function(info){
                onRecognizeError(info);
            });
            appcan.window.subscribe("uexXunfei.onBeginOfSpeech",function(info){
                onBeginOfSpeech(info);
            });
            appcan.window.subscribe("uexXunfei.onEndOfSpeech",function(info){
                onEndOfSpeech(info);
            });
            appcan.window.subscribe("uexXunfei.onRecognizeResult",function(info){
                //非undefined并且非"undefined"
                if(typeof(info) != "undefined"&& info!="undefined"){
                    onRecognizeResult(info);
                }
            });
            
            if (typeof (cbFn) == "function") {
                cbFn(ret);
                return;
            }
        }, error: function (s,e,t) { }
    });
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
// 动态加载css脚本
function loadStyleString(cssText) {
    var style = document.createElement("style");
    style.type = "text/css";
    try{
        // firefox、safari、chrome和Opera
        style.appendChild(document.createTextNode(cssText));
    }catch(ex) {
        // IE早期的浏览器 ,需要使用style元素的stylesheet属性的cssText属性
        style.styleSheet.cssText = cssText;
    }
    document.getElementsByTagName("head")[0].appendChild(style);
}
