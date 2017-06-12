const code = new Array('144031539110', '131001570151', '133011501118', '111001571071');
//返回发票类型编码
var alxd = function(a) {
    var b;
    var c = "99";

    if (a.length == 12) {
        b = a.substring(7, 8);
        for (var i = 0; i < code.length; i++) {
            if (a == code[i]) {
                c = "10";
                break;
            }
        }
        if (c == "99") {//增加判断，判断是否为新版电子票
            if (a.charAt(0) == '0' && a.substring(10, 12) == '11') {
                c = "10";
            }
            if (a.charAt(0) == '0' && (a.substring(10, 12) == '06' || a.substring(10, 12) == '07')) {//判断是否为卷式发票  第1位为0且第11-12位为06或07
                c = "11";
            }
        }
        if (c == "99") {//如果还是99，且第8位是2，则是机动车发票
            if (b == 2 && a.charAt(0) != '0') {
                c = "03";
            }
        }

    } else if (a.length == 10) {
        b = a.substring(7, 8);
        if (b == 1 || b == 5) {
            c = "01";
        } else if (b == 6 || b == 3) {
            c = "04";
        } else if (b == 7 || b == 2) {
            c = "02";
        }
    }
    return c;
};

// 显示隐藏查验按钮
function acb(fplx) {
    if (avai(fplx)) {
        $('#uncheckfp').hide();
        $('#checkfp').show();
    } else {
        $('#checkfp').hide();
        $('#uncheckfp').show();
    }
}

//get获取验证码请求路径
function getSwjg(fpdm, ckflag) {
    var citys = [{
        'code' : '1100',
        'sfmc' : '北京',
        'Ip' : 'https://zjfpcyweb.bjsat.gov.cn:443',
        'address' : 'https://zjfpcyweb.bjsat.gov.cn:443'
    }, {
        'code' : '1200',
        'sfmc' : '天津',
        'Ip' : 'https://fpcy.tjsat.gov.cn:443',
        'address' : 'https://fpcy.tjsat.gov.cn:443'
    }, {
        'code' : '1300',
        'sfmc' : '河北',
        'Ip' : 'https://fpcy.he-n-tax.gov.cn:82',
        'address' : 'https://fpcy.he-n-tax.gov.cn:82'
    }, {
        'code' : '1400',
        'sfmc' : '山西',
        'Ip' : 'https://fpcy.tax.sx.cn:443',
        'address' : 'https://fpcy.tax.sx.cn:443'
    }, {
        'code' : '1500',
        'sfmc' : '内蒙古',
        'Ip' : 'https://fpcy.nm-n-tax.gov.cn:443',
        'address' : 'https://fpcy.nm-n-tax.gov.cn:443'
    }, {
        'code' : '2100',
        'sfmc' : '辽宁',
        'Ip' : 'https://fpcy.tax.ln.cn:443',
        'address' : 'https://fpcy.tax.ln.cn:443'
    }, {
        'code' : '2102',
        'sfmc' : '大连',
        'Ip' : 'https://fpcy.dlntax.gov.cn:443',
        'address' : 'https://fpcy.dlntax.gov.cn:443'
    }, {
        'code' : '2200',
        'sfmc' : '吉林',
        'Ip' : 'https://fpcy.jl-n-tax.gov.cn:4432',
        'address' : 'https://fpcy.jl-n-tax.gov.cn:4432'
    }, {
        'code' : '2300',
        'sfmc' : '黑龙江',
        'Ip' : 'https://fpcy.hl-n-tax.gov.cn:443',
        'address' : 'https://fpcy.hl-n-tax.gov.cn:443'
    }, {
        'code' : '3100',
        'sfmc' : '上海',
        'Ip' : 'https://fpcyweb.tax.sh.gov.cn:1001',
        'address' : 'https://fpcyweb.tax.sh.gov.cn:1001'
    }, {
        'code' : '3200',
        'sfmc' : '江苏',
        'Ip' : 'https://fpdk.jsgs.gov.cn:80',
        'address' : 'https://fpdk.jsgs.gov.cn:80'
    }, {
        'code' : '3300',
        'sfmc' : '浙江',
        'Ip' : 'https://fpcyweb.zjtax.gov.cn:443',
        'address' : 'https://fpcyweb.zjtax.gov.cn:443'
    }, {
        'code' : '3302',
        'sfmc' : '宁波',
        'Ip' : 'https://fpcy.nb-n-tax.gov.cn:443',
        'address' : 'https://fpcy.nb-n-tax.gov.cn:443'
    }, {
        'code' : '3400',
        'sfmc' : '安徽',
        'Ip' : 'https://fpcy.ah-n-tax.gov.cn:443',
        'address' : 'https://fpcy.ah-n-tax.gov.cn:443'
    }, {
        'code' : '3500',
        'sfmc' : '福建',
        'Ip' : 'https://fpcyweb.fj-n-tax.gov.cn:443',
        'address' : 'https://fpcyweb.fj-n-tax.gov.cn:443'
    }, {
        'code' : '3502',
        'sfmc' : '厦门',
        'Ip' : 'https://fpcy.xm-n-tax.gov.cn',
        'address' : 'https://fpcy.xm-n-tax.gov.cn'
    }, {
        'code' : '3600',
        'sfmc' : '江西',
        'Ip' : 'https://fpcy.jxgs.gov.cn:82',
        'address' : 'https://fpcy.jxgs.gov.cn:82'
    }, {
        'code' : '3700',
        'sfmc' : '山东',
        'Ip' : 'https://fpcy.sd-n-tax.gov.cn:443',
        'address' : 'https://fpcy.sd-n-tax.gov.cn:443'
    }, {
        'code' : '3702',
        'sfmc' : '青岛',
        'Ip' : 'https://fpcy.qd-n-tax.gov.cn:443',
        'address' : 'https://fpcy.qd-n-tax.gov.cn:443'
    }, {
        'code' : '4100',
        'sfmc' : '河南',
        'Ip' : 'https://fpcy.ha-n-tax.gov.cn',
        'address' : 'https://fpcy.ha-n-tax.gov.cn'
    }, {
        'code' : '4200',
        'sfmc' : '湖北',
        'Ip' : 'https://fpcy.hb-n-tax.gov.cn:443',
        'address' : 'https://fpcy.hb-n-tax.gov.cn:443'
    }, {
        'code' : '4300',
        'sfmc' : '湖南',
        'Ip' : 'https://fpcy.hntax.gov.cn:8083',
        'address' : 'https://fpcy.hntax.gov.cn:8083'
    }, {
        'code' : '4400',
        'sfmc' : '广东',
        'Ip' : 'https://fpcy.gd-n-tax.gov.cn:443',
        'address' : 'https://fpcy.gd-n-tax.gov.cn:443'
    }, {
        'code' : '4403',
        'sfmc' : '深圳',
        'Ip' : 'https://fpcy.szgs.gov.cn:443',
        'address' : 'https://fpcy.szgs.gov.cn:443'
    }, {
        'code' : '4500',
        'sfmc' : '广西',
        'Ip' : 'https://fpcy.gxgs.gov.cn:8200',
        'address' : 'https://fpcy.gxgs.gov.cn:8200'
    }, {
        'code' : '4600',
        'sfmc' : '海南',
        'Ip' : 'https://fpcy.hitax.gov.cn:443',
        'address' : 'https://fpcy.hitax.gov.cn:443'
    }, {
        'code' : '5000',
        'sfmc' : '重庆',
        'Ip' : 'https://fpcy.cqsw.gov.cn:80',
        'address' : 'https://fpcy.cqsw.gov.cn:80'
    }, {
        'code' : '5100',
        'sfmc' : '四川',
        'Ip' : 'https://fpcy.sc-n-tax.gov.cn:443',
        'address' : 'https://fpcy.sc-n-tax.gov.cn:443'
    }, {
        'code' : '5200',
        'sfmc' : '贵州',
        'Ip' : 'https://fpcy.gz-n-tax.gov.cn:80',
        'address' : 'https://fpcy.gz-n-tax.gov.cn:80'
    }, {
        'code' : '5300',
        'sfmc' : '云南',
        'Ip' : 'https://fpcy.yngs.gov.cn:443',
        'address' : 'https://fpcy.yngs.gov.cn:443'
    }, {
        'code' : '5400',
        'sfmc' : '西藏',
        'Ip' : 'https://fpcy.xztax.gov.cn:81',
        'address' : 'https://fpcy.xztax.gov.cn:81'
    }, {
        'code' : '6100',
        'sfmc' : '陕西',
        'Ip' : 'https://fpcyweb.sn-n-tax.gov.cn:443',
        'address' : 'https://fpcyweb.sn-n-tax.gov.cn:443'
    }, {
        'code' : '6200',
        'sfmc' : '甘肃',
        'Ip' : 'https://fpcy.gs-n-tax.gov.cn:443',
        'address' : 'https://fpcy.gs-n-tax.gov.cn:443'
    }, {
        'code' : '6300',
        'sfmc' : '青海',
        'Ip' : 'https://fpcy.qh-n-tax.gov.cn:443',
        'address' : 'https://fpcy.qh-n-tax.gov.cn:443'
    }, {
        'code' : '6400',
        'sfmc' : '宁夏',
        'Ip' : 'https://fpcy.nxgs.gov.cn:443',
        'address' : 'https://fpcy.nxgs.gov.cn:443'
    }, {
        'code' : '6500',
        'sfmc' : '新疆',
        'Ip' : 'https://fpcy.xj-n-tax.gov.cn:443',
        'address' : 'https://fpcy.xj-n-tax.gov.cn:443'
    }];
    var dqdm = null;
    var swjginfo = new Array();

    if (fpdm.length == 12) {
        dqdm = fpdm.substring(1, 5);
    } else {
        dqdm = fpdm.substring(0, 4);
    }
    if (dqdm != "2102" && dqdm != "3302" && dqdm != "3502" && dqdm != "3702" && dqdm != "4403") {
        dqdm = dqdm.substring(0, 2) + "00";
    }
    for (var i = 0; i < citys.length; i++) {
        if (dqdm == citys[i].code) {
            swjginfo[0] = citys[i].sfmc;
            // if (flag == 'debug') {//如果是开发调试模式或测试模式
            // //swjginfo[1] = "http://172.30.11.88:7010/WebQuery";  //这里是省局服务器的外网地址，开发/测试时填写相应值
            // swjginfo[1] = "http://127.0.0.1:7001/WebQuery";
            // } else {
            swjginfo[1] = citys[i].Ip + "/WebQuery";
            // }
            break;
        }
    }
    //只有北京，上海，深圳的发票可以查询  如果全国开放，此处加注释
    /*
     if ((fpdm.length == 10 && fpdm.substring(0,1) != '0' && $.inArray(fpdm, code10) == -1) || fpdm.length == 12) {
     if (fpdm.substring(0,1) == '1' && (fpdm.substring(1,5) == '1100' || fpdm.substring(1,5) == '3100' || fpdm.substring(1,5) == '4403')) {
     } else {
     if (dqdm != "1100" && dqdm != "3100" && dqdm != "4403") {
     swjginfo = new Array();
     jAlert("该省尚未开通发票查验功能！","提示");
     }
     }
     }*/

    return swjginfo;
}

function arw() {
    $('#fpdm').val("");
    $('#fphm').val("");
    $('#kprq').val("");
    $('#kprq').attr("placeholder", "YYYYMMDD");
    $('#fpje').val("");
    $("#yzmtp").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAyCAIAAAAYxYiPAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEI1OEJBN0NCNjI2MTFFNkFFMUU5RTY4RTUwNEI4NDEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEI1OEJBN0RCNjI2MTFFNkFFMUU5RTY4RTUwNEI4NDEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0QjU4QkE3QUI2MjYxMUU2QUUxRTlFNjhFNTA0Qjg0MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0QjU4QkE3QkI2MjYxMUU2QUUxRTlFNjhFNTA0Qjg0MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Puy7evQAAAzbSURBVHja7Nt5sJfzFwdw39u1lO2iIiHXUmizlCVLIVvSZktmUiiUEpPU0BhLTSkhZBlCwyBa7ZRCKRItVEhXq7K1EaKf3+veY565v++tm29//Gb8fs93pmc+neecz+d8znmf5Xk+98n8/vvvX3/99ffff19YWLjDDjsYux544IE//PCDsUHlypWLioo2btxo7Iq41157GadSOUllFi5cWKFChby8vE2bNm233XYGrsZ5Jb9/lfwwIBq4GhtgSKVyksr78ccfMe2+++788/PPP++88868sW7dOvf4wdUYBX3Dhg14cOJPpXKVyqxateqnn37C4Tbz43M1RkHfZZddyCDiRnQ1RkFPpXKSyvMPzpHcy8/P/+OPP8hvv/32QXQ1RkF3Fw/in3/+mUrlKpWZNWvWHnvsUalSpdWrV0srBQUFrmvWrKlYsSK6gRhBJI9BgCCiGKdSOUnl8waf6D2SFM4bJspkMuEN4/Bh5Huc4cNUKiepvBo1ahD75ptvOIT55XUpZp999jGR1sTVGEWnEk7DiT+VylUqs3TpUq7ghOI8kskYuxqjRCbCF35DdEXkN+NUKiepvMWLFyPtu+++kWu036rkypUrMem0XY1R0N3FU61aNfypVK5SfyE6ySk8EFUyy4eRaLJ8mEr9fam8PffcE4fKKKNLMZLLb7/9tttuu5H3TOlqHP2gu3jWrl1LPpXKVSozb968kAF73MauxiETzz8GuI1djVGMU6mcpIpb7sjc8cwefXjStQiB6FrQo2uJfJ9K5SqVkbyjHYF/HBoXV2MUdAOPkgZyjbFZjHlJvk+lcpLKy+rDE28glu/DVCo3qazWJMy/atWqpDUxRkGPR8nNNjSp1Fal/uN9tJwSL1uTd6nK62effXbssccGkffKvoEtLSVS3n777eOPP36//fZLiFuVQhk5ciTlzjnnnJykst4Rb0lK6RfOhx9+eE5S27bWlqT+egRfsWJF8vjIuHvvvTcOj4+uDz744CmnnPLcc8+VfegsK1W1atX333+/cePGrijoW5J6+eWXzz///FGjRsVabHHttddasRwpd995551OnTolUqGhB9yyUvYGR7EWK3Ph66+/XlZq+fLlX3zxBUr5+ypnrXXr1plk/PjxjRo1uuOOO3bcccfNSm39hIVFunXr9tRTT5188sl/50wBNm+66aZXXnmldu3a5Z9EtGvXrlWr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");
    $("#context").text("开具金额(不含税)：");
    $("#fpje").attr("placeholder", "请输入开具金额(不含税)");
    $('#yzm').val("");
    $('#yzm').attr("placeholder", "请输入验证码");
    $("#yzminfo").text("验证码Info");
    $("#fpdm").focus();
    $("#info").hide();
}

function clearYzm() {
    $('#yzm').val("");
    $('#yzm').attr("placeholder", "请输入验证码");
    $("#yzminfo").text("验证码Info");
    $("#yzmtp").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAyCAIAAAAYxYiPAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEI1OEJBN0NCNjI2MTFFNkFFMUU5RTY4RTUwNEI4NDEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEI1OEJBN0RCNjI2MTFFNkFFMUU5RTY4RTUwNEI4NDEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0QjU4QkE3QUI2MjYxMUU2QUUxRTlFNjhFNTA0Qjg0MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0QjU4QkE3QkI2MjYxMUU2QUUxRTlFNjhFNTA0Qjg0MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Puy7evQAAAzbSURBVHja7Nt5sJfzFwdw39u1lO2iIiHXUmizlCVLIVvSZktmUiiUEpPU0BhLTSkhZBlCwyBa7ZRCKRItVEhXq7K1EaKf3+veY565v++tm29//Gb8fs93pmc+neecz+d8znmf5Xk+98n8/vvvX3/99ffff19YWLjDDjsYux544IE//PCDsUHlypWLioo2btxo7Iq41157GadSOUllFi5cWKFChby8vE2bNm233XYGrsZ5Jb9/lfwwIBq4GhtgSKVyksr78ccfMe2+++788/PPP++88868sW7dOvf4wdUYBX3Dhg14cOJPpXKVyqxateqnn37C4Tbz43M1RkHfZZddyCDiRnQ1RkFPpXKSyvMPzpHcy8/P/+OPP8hvv/32QXQ1RkF3Fw/in3/+mUrlKpWZNWvWHnvsUalSpdWrV0srBQUFrmvWrKlYsSK6gRhBJI9BgCCiGKdSOUnl8waf6D2SFM4bJspkMuEN4/Bh5Huc4cNUKiepvBo1ahD75ptvOIT55XUpZp999jGR1sTVGEWnEk7DiT+VylUqs3TpUq7ghOI8kskYuxqjRCbCF35DdEXkN+NUKiepvMWLFyPtu+++kWu036rkypUrMem0XY1R0N3FU61aNfypVK5SfyE6ySk8EFUyy4eRaLJ8mEr9fam8PffcE4fKKKNLMZLLb7/9tttuu5H3TOlqHP2gu3jWrl1LPpXKVSozb968kAF73MauxiETzz8GuI1djVGMU6mcpIpb7sjc8cwefXjStQiB6FrQo2uJfJ9K5SqVkbyjHYF/HBoXV2MUdAOPkgZyjbFZjHlJvk+lcpLKy+rDE28glu/DVCo3qazWJMy/atWqpDUxRkGPR8nNNjSp1Fal/uN9tJwSL1uTd6nK62effXbssccGkffKvoEtLSVS3n777eOPP36//fZLiFuVQhk5ciTlzjnnnJykst4Rb0lK6RfOhx9+eE5S27bWlqT+egRfsWJF8vjIuHvvvTcOj4+uDz744CmnnPLcc8+VfegsK1W1atX333+/cePGrijoW5J6+eWXzz///FGjRsVabHHttddasRwpd995551OnTolUqGhB9yyUvYGR7EWK3Ph66+/XlZq+fLlX3zxBUr5+ypnrXXr1plk/PjxjRo1uuOOO3bcccfNSm39hIVFunXr9tRTT5188sl/50wBNm+66aZXXnmldu3a5Z9EtGvXrlWr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");
    $("#yzm").focus();
}

//校验发票号码func
var ahm = function(a) {
    var b = /^\d{8}$/;
    var c = /^0{8}$/;
    var d = /^0{11}-?[1-9]*\w\d*$/;
    var e = b.test(a);
    var f = c.test(a);
    if (e == true && f == false) {
        return true;
    } else {
        return false;
    }
};
//校验发票代码func
var adm = function(a) {
    var b = /^1|0\d{11}$|^\d{6}[1-9]\d{2}0$/;
    var c = /^0{8}[1-9]?\w[1-9]\d*$/;

    var e = b.test(a);
    var f = c.test(a);

    if (e == true && bc(a) && alxd(a) != "99") {
        return true;
    } else {
        return false;
    }
};

var bc = function(a) {
    var b;
    var d = new Date();
    var e = d.getFullYear();
    var f = e.toString();
    var g = f.substring(2);
    if (a.length == 12) {
        b = a.substring(5, 7);
    } else {
        b = a.substring(4, 6);
    }
    //console.log(b + " " + g);
    if (b <= 00 || b > g) {
        return false;
    }
    return true;
};

function cb(a,b,c){
    if(c>31){
        return false;
    }else if(c<1){
        return false;
    }else{
        if(b==2){
            if(c>29){//2月不会超过29
                return false;
            }
            if (((a % 4)==0) && ((a % 100)!=0) || ((a % 400)==0)) {//闰年1--29
                return true;
            }else{//平年1--28
                if(c>28){
                    return false;
                }
            }
        }else if((b==4||b==6||b==9||b==11)&&c>30){
            return false;
        }
    }
    return true;
}
//check当日开具发票次日查验!
var acq=function(a){
    var b=/^\d{8}$/;
    var c=/^0{8}$/;
    var d=/^0{11}-?[1-9]*\w\d*$/;
    var e=b.test(a);
    if(e==true){
        var g=new Date();
        var h=g.getFullYear();
        var i=g.getMonth()+1;
        var j=g.getDate();
        var k=a.substring(0,4);
        var l=parseInt(a.substring(4,6), 10);
        var m=parseInt(a.substring(6), 10);
        var n=ca(0);
        var t=ca(1);
        if((h!=k&&h-1!=k)||l == 0 || l>12|| m == 0 || m>31 || a>n||!cb(k,l,m)||(h==k && i== l && j==m)){
            return false;
        }       
        if(h-1==k&&a<=t){
            return false;
        }
        return true;
    }else{
        return false;
    }
};

function ca(i){
    var a = new Date();
    var b = 0;
    var c = 0;
    var d = 0;
    var e = "";
    b= a.getFullYear()-i;
    c= a.getMonth()+1;
    d = a.getDate();
    e += b;
    if (c >= 10 ){
        e += c;
    }else{
        e += "0" + c;
    }
    if (d >= 10 ){
        e += d ;
    }else{
        e += "0" + d ;
    }
    return e;
}

var kprqChange = function(kprq) {
    if (kprq != "") {
        if (!acq(kprq)) {
            var g = new Date();
            var h = g.getFullYear();
            var i = g.getMonth() + 1;
            var j = g.getDate();
            var dd = h + "" + i + j;
            if (kprq == dd) {
                $toast("当日开具发票次日查验！", 2000);
                // alert("当日开具发票次日查验");
                $("#kprq").val("");
                $("#kprq").focus();
            } else {
                $toast("开票日期有误！", 2000);
                // alert("开票日期有误");
                $("#kprq").val("");
                $("#kprq").focus();
            }
        } else {
            if (kprq == ca(0)) {
                if (!(fplx == "04" || fplx == "10" || fplx == "11")) {
                    $toast("开票日期有误！", 2000);
                    // alert("开票日期有误");
                    $("#kprq").val("");
                    $("#kprq").focus();
                }
            }
        }
    }
}
