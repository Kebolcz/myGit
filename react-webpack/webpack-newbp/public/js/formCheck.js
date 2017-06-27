//集合表单验证的方法

//判断是否为空
function m_isEmpty(str) {
    if (str == "" || str.length == 0 || str == null) {
        return true;
    }
}

//是否为正整数
function isPositiveNum(s){ 
    var re = /^[0-9]*[1-9][0-9]*$/ ;  
    return re.test(s)  
}

//判断是否正数
function isPositive(s){ 
    var re = /^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/ ;  
    return re.test(s)  
}
//判断非负数 
function isFeifu(s){ 
    var re = /^\d+(\.{0,1}\d+){0,1}$/ ;  
    return re.test(s)  
}
//特殊字符验证
function isdataspecial(s) {
    var re = /[@/'\"#$%&^*]+/;
    return re.test(s)
}

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
// function isemoji(s) {
    // var re = /[\ud800-\udbff][\udc00-\udfff]/;
    // return re.test(s)
// }

