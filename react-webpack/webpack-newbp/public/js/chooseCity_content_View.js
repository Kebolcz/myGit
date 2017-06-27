/*
 * 本文件用于读取，输入缓存值
 */
var DisplayData = {
    //在页面上显示缓存值
    displayNewestCity : function() {
        var newestCity = DealDataFromHtml.dealNewestCity();
        if (newestCity == "nocache") {

        } else {
            newestCity = JSON.parse(newestCity);
            var newestCityData = newestCity.data;
            var bodyStr = "";
            $.each(newestCityData, function(i) {
                //bodyStr += '<div id="" class="ub uinn2 bg-w list3 ub-ac bb">' + '               <div id="" class="ub-f1 ub-ver">' + '                   <div class="ub ub-ac tc-b umar-b CNName">' + json[i].CNName + '                   </div> ' + '                   <div id="" class="ub ub-ac">' + json[i].ENName + '                   </div>' + '                </div>' + '                <div id="" class="ub-f1 ub  tc-b ub-ac ub-pe">' + json[i].Res_Data1 + '                </div>' + '            </div> ';
                bodyStr += '<div id="" class="ub uinn2 bg-w list3 ub-ac bb">';
                bodyStr += '<div id="" class="ub-f1 ub-ver">';
                bodyStr += '<div id="" class="ub ub-ac tc-b umar-b CNName">';
                bodyStr += newestCityData[i].CNName;
                bodyStr += '</div>';
                bodyStr += '<div id="" class="ub ub-ac">';
                bodyStr += newestCityData[i].ENName;
                bodyStr += '</div>';
                bodyStr += '</div>';
                bodyStr += '<div id="" class="ub-f1 ub  tc-b ub-ac ub-pe">';
                bodyStr += newestCityData[i].Res_Data1;
                bodyStr += '</div>';
                bodyStr += '<span class="jsonData dis-hiddenIM">';
                bodyStr += JSON.stringify(newestCityData[i]);
                bodyStr += '</span>';
                bodyStr += '</div>';
            });
            $("#list").html(bodyStr);
            //对城市列表监听
            appcan.button(".list3", "btn-act", function(first, second) {
                //用于缓存
                var jsonData = $(this).find(".jsonData").html();
                DataFromHtml.setNewestCity(jsonData);
                // 数据赋值
                var cnname = $.trim($(this).find('.CNName').html());

                var page = "";
                var pageScript = "";
                //判断调用城市的页面
                if (appcan.getLocVal('pageFlag') == 'add_zs') {
                    page = "addZsCost";
                    pageScript = "$('#sCity').html('" + cnname + "')";
                } else if (appcan.getLocVal('pageFlag') == 'edit_zs') {
                    page = "editZsCost";
                    pageScript = "$('#sCity').html('" + cnname + "')";
                } else if (appcan.getLocVal('pageFlag') == 'add_wf_start') {
                    page = "addWfCost";
                    pageScript = "$('#s_StartCity').html('" + cnname + "')";
                } else if (appcan.getLocVal('pageFlag') == 'add_wf_end') {
                    page = "addWfCost";
                    pageScript = "$('#s_EndCity').html('" + cnname + "')";
                } else if (appcan.getLocVal('pageFlag') == 'edit_wf_start') {
                    page = "editWfCost";
                    pageScript = "$('#s_StartCity').html('" + cnname + "')";
                } else if (appcan.getLocVal('pageFlag') == 'edit_wf_end') {
                    page = "editWfCost";
                    pageScript = "$('#s_EndCity').html('" + cnname + "')";
                }
                //给前一页面赋值
                appcan.window.evaluatePopoverScript(page, "content", pageScript);
                // 关闭页面
                appcan.window.evaluateScript('chooseCity', 'appcan.window.close("-1");');
            });
        }
    }
};

