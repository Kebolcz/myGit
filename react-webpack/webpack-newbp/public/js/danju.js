//以下给pop页面控制用的
// 关闭pop
function closePop() {
    appcan.closePopover('myDB_pop1');
    $("#slider").css("transform", "rotate(360deg)");
    sta = 0;
};
//同步导航栏数据
function stateKT() {
    $("#state").html("住宿费");
    $("#slider").css("transform", "rotate(360deg)");
    closePop();
}

function stateEss() {
    $("#state").html("往返交通费");
    $("#slider").css("transform", "rotate(360deg)");
    closePop();
}

function stateMoss() {
    $("#state").html("现场交通费");
    $("#slider").css("transform", "rotate(360deg)");
    closePop();
}
//头部点击事件
function headClick() {
        var sta = 0;
        $("#more").click(function() {
            $("#slider").css("transform", "rotate(180deg)");
            openPop();
        });
        function openPop() {
            if (sta == 0) {
                var s = $("#content");
                var x = 0;
                appcan.window.openPopover({
                    'name' : 'danju_pop',
                    'url' : 'danju_pop.html',
                    'left' : parseInt(x),
                    'top' : parseInt($('#header').offset().height),
                    'width' : $('#content').width(),
                    'height' : $('#content').height(),
                    'type' : 0,
                    'marginBottom' : 0,
                    'extraInfo' : '{"extraInfo":{"opaque":"true","delayTime":"250"}}'
                });
                sta = 1;
            } else {
                closePop();
            };
        };
        function closePop() {
            appcan.closePopover('danju_pop');
            $("#slider").css("transform", "rotate(360deg)");
            sta = 0;
        };
    }
