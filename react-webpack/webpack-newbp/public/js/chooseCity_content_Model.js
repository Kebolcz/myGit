/*
 *本文件用于获取chooseCity_content.html页面的数据
 */
var DataFromHtml = {
    //获取最新选择过的城市
    getNewestCity : function() {
        var newestCity = appcan.getLocVal("NEWEST_CITY");
        if(newestCity == null){
            return "nocache";
        }else{
            return newestCity;
        }
    },
    //缓存最新选择过的城市
    setNewestCity : function(chosCity) {
        // alert(chosCity);
        console.log("chosCity>>>" + chosCity);
        chosCity = JSON.parse(chosCity);
        var newestCity = appcan.getLocVal("NEWEST_CITY");
        if (newestCity == null) {
            newestCity = {
                "total" : "0",
                "data" : []
            };
            newestCity.data.push(chosCity);
            newestCity.total++;
        } else {
            newestCity = JSON.parse(newestCity);
            var len = newestCity.data.length;
            for (var idx = 0; idx < len; idx++) {
                console.log(JSON.stringify(newestCity));
                if (newestCity.data[idx].Res_Code == chosCity.Res_Code) {
                    newestCity.data.splice(idx, 1);
                    newestCity.total--;
                    break;
                }
            }
            newestCity.data.splice(0, 0, chosCity);
            newestCity.total++;
        }
        while (1) {
            if (newestCity.total > 25) {
                newestCity.data.pop();
                newestCity.total--;
            } else {
                break;
            }
        }
        appcan.setLocVal("NEWEST_CITY",JSON.stringify(newestCity));
        console.log("newestCity>>" + JSON.stringify(newestCity));
    }
};

