(function($) {
    /**
     *此处填充代码
     **/
    window.inputFlag = false;

    var Todo = Backbone.Model.extend({

        // Default attributes for the todo item.
        defaults : function() {
            return {
                title : "新增变更项",
                num : Todos.nextOrder(),
                locIdeCode : null,
                locIdeDesc : null,
                typeCode : '0',
                rwCorpCode : null,
                rwCorpDesc : null,
                rwSecCode : null,
                rwSecDesc : null,
                descDesc : null,
                countryCode : null,
                countryDesc : null,
                latitude : null,
                longitude : null
            };
        },
        validate : function(attrs, options) {
            var latRegex = /^-?(?:90(?:\.0{1,20})?|(?:[1-8]?\d(?:\.\d{8,20})?))$/;
            var lonRegex = /^-?(?:(?:180(?:\.0{1,20})?)|(?:(?:(?:1[0-7]\d)|(?:[1-9]?\d))(?:\.\d{8,20})?))$/;
            
            if (attrs.latitude&&!latRegex.test(attrs.latitude)) {
                return "纬度格式:[-90-->90](至少精确到小数点后8位)!";
            }
            if (attrs.longitude&&!lonRegex.test(attrs.longitude)) {
                return "经度格式:[-180-->180](至少精确到小数点后8位)!";
            }
        }
    });

    var TodoList = Backbone.Collection.extend({

        model : Todo,

        nextOrder : function() {
            if (!this.length)
                return 1;
            return this.last().get('num') + 1;
        },

        comparator : 'num'

    });

    var Todos = new TodoList;

    var TodoView = Backbone.View.extend({

        tagName : "li",

        template : _.template($('#item-template').html()),

        events : {
            "click .delBtn" : "clear",
            "click .title" : "collapse",
            "click .choice" : "gotoNewPage",
            "keyup .desc" : "setTitle",
            "change .locIde" : "setIde",
            "change .rwCorp" : "setCorp",
            "change .rwSec" : "setSec",
            "change .country" : "setCoun",
            "change .type" : "setType",
            "click .reposition" : "position",
            "change .latitude" : "setLati",
            "change .longitude" : "setLong",
            "change .desc" : "setTitle"
        },

        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        initialize : function() {
            this.listenTo(this.model, 'setAttr', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        clear : function() {
            this.model.destroy();
        },
        collapse : function() {
            this.$el.find('.panel').toggleClass('collapse');
            // this.$el.find('i').toggleClass('iColl');
            this.$el.siblings().find('.panel').addClass('collapse');
            // this.$el.siblings().find('i').removeClass('iColl');
            $("#content").scrollTop(this.$el[0].offsetTop);
        },
        gotoNewPage : function(obj) {
            // location.href="#/getAttrs/locIde";
            //跳转到城市页面
            if ($(obj.target).hasClass("locIde")) {
                appcan.setLocVal("type", "locIde");
            } else if ($(obj.target).hasClass("rwCorp")) {
                if (this.model.get('typeCode') === '0') {
                    $toast('请选择车站类型!', 2000);
                    return false;
                }
                appcan.setLocVal("type", "rwCorp");
                appcan.setLocVal("arg", this.$el.find('.type').val());
            } else if ($(obj.target).hasClass("rwSec")) {
                if (this.model.get('rwCorpCode') === null) {
                    $toast('请选择路局、地铁、地方铁路公司!', 2000);
                    return false;
                }
                appcan.setLocVal("type", "rwSec");
                appcan.setLocVal("arg1", this.$el.find('.rwCorp').attr('code').slice(-3));
            } else if ($(obj.target).hasClass("country")) {
                appcan.setLocVal("type", "country");
            }
            appcan.setLocVal("liIndex", this.$el.index());
            appcan.setLocVal("locationAction", "");
            appcan.window.open('mainData', './mainData.html', '10');
        },

        setTitle : function(obj) {
            this.model.set('title', $(obj.target).val());
            this.model.set('descDesc', $(obj.target).val());
            var t = this.$el.find('.desc').val();
            this.$el.find('.title p')[0].innerText = this.model.get('num')+'. '+t;
        },
        setIde : function() {
            this.model.set('locIdeCode', this.$el.find('.locIde').attr('code'));
            this.model.set('locIdeDesc', this.$el.find('.locIde').val());
            
            
            this.model.set('typeCode', this.$el.find('.type')[0].value);
            this.model.set('rwCorpDesc', this.$el.find('.rwCorp').val());
            this.model.set('rwCorpCode', this.$el.find('.rwCorp').attr('code'));
            this.model.set('rwSecDesc', this.$el.find('.rwSec').val());
            this.model.set('rwSecCode', this.$el.find('.rwSec').attr('code'));
            this.model.set('descDesc', this.$el.find('.desc').val());
            this.model.set('countryCode', this.$el.find('.country').attr('code'));
            this.model.set('countryDesc', this.$el.find('.country').val());
            this.model.set('latitude', this.$el.find('.latitude').val());
            this.model.set('longitude', this.$el.find('.longitude').val());
            //安装点信息加载后change标题描述
            this.$el.find('.desc').change();
            this.model.trigger('setAttr');
        },
        setType : function() {
            if (this.model.get('locIdeCode') === null) {
                this.$el.find('select').val('0');
                $toast('请选择安装地!', 2000);
                return false;
            }
            this.model.set('rwCorpCode', null);
            this.model.set('rwCorpDesc', null);
            this.model.set('rwSecCode', null);
            this.model.set('rwSecDesc', null);
            this.model.set('countryCode', null);
            this.model.set('countryDesc', null);
            this.model.set('descDesc', null);

            this.model.set('typeCode', this.$el.find('.type')[0].value);
            this.model.trigger('setAttr');
        },
        setCorp : function() {
            this.model.set('rwSecCode', null);
            this.model.set('rwSecDesc', null);
            // this.model.set('countryCode', null);
            // this.model.set('countryDesc', null);
            this.model.set('descDesc', null);

            this.model.set('rwCorpCode', this.$el.find('.rwCorp').attr('code'));
            this.model.set('rwCorpDesc', this.$el.find('.rwCorp').val());
            this.model.trigger('setAttr');
        },
        setSec : function() {
            this.model.set('rwSecCode', this.$el.find('.rwSec').attr('code'));
            this.model.set('rwSecDesc', this.$el.find('.rwSec').val());
            this.model.trigger('setAttr');
        },
        setCoun : function() {
            this.model.set('countryCode', this.$el.find('.country').attr('code'));
            this.model.set('countryDesc', this.$el.find('.country').val());
            this.model.trigger('setAttr');
        },
        setLati : function() {
            this.model.set('latitude', this.$el.find('.latitude').val());
            if (!this.model.isValid()) {
              $toast(this.model.validationError,2000);
              this.model.set('latitude', null);
            }
            this.model.trigger('setAttr');
        },
        setLong : function() {
            this.model.set('longitude', this.$el.find('.longitude').val());
            if (!this.model.isValid()) {
              $toast(this.model.validationError,2000);
              this.model.set('longitude', null);
            }
            this.model.trigger('setAttr');
        },
        position : function() {
            appcan.window.open('position', './position.html', '10');
        }
    });

    var AppView = Backbone.View.extend({

        el : $("#Page"),

        events : {
            "click #addBtn" : "createOnEnter",
            "click #submit" : "submit"
        },
        initialize : function() {
            this.listenTo(Todos, 'add', this.addOne);
        },

        addOne : function(todo) {
            var view = new TodoView({
                model : todo
            });
            this.$("#todo-list").append(view.render().el);
            if (Todos.length >= 2) {
                // $("#content").scrollTop($("#content li").last()[0].offsetTop);
                view.collapse();
            }
        },

        createOnEnter : function() {
            Todos.add(new Todo({
                title : '安装地'
            }));
        },
        
        submit : function(){
            var xmlJSON = {};
            var domArr = this.$el.find('li');
            
            if(domArr.length <= 0){
                $toast('请至少添加一个安装地变更项!', 2000);
                return;
            }
            
            console.log(Todos.models);
            var count  = 0;
            xmlJSON.item = [];
            for(var item of Todos.models){
                xmlJSON.item[count] = {};
                var num = item.get('num');
                var title = item.get('title');
                if(item.get('locIdeCode') === null){
                    $toast("请选择【"+num+". "+title+"】的安装地标识!",2000);
                    return;
                }
                if(item.get('typeCode') === '0'){
                    $toast("请选择【"+num+". "+title+"】的车站类型!",2000);
                    return;
                }
                if(item.get('rwCorpCode') === ""||item.get('rwCorpCode') === null){
                    $toast("请选择【"+num+". "+title+"】的路局、地铁、地方铁路公司!",2000);
                    return;
                }
                if(item.get('rwSecCode') === ""||item.get('rwSecCode') === null){
                    $toast("请选择【"+num+". "+title+"】的电务段、地铁线路!",2000);
                    return;
                }
                if(item.get('descDesc') === ""||item.get('descDesc') === null){
                    $toast("请选择【"+num+". "+title+"】的安装地名称!",2000);
                    return;
                }
                if(item.get('countryCode') === ""||item.get('countryCode') === null){
                    $toast("请选择【"+num+". "+title+"】的国家!",2000);
                    return;
                }
                if(item.get('longitude') === ""||item.get('longitude') === null){
                    $toast("请选择【"+num+". "+title+"】的经度!",2000);
                    return;
                }
                if(item.get('latitude') === ""||item.get('latitude') === null){
                    $toast("请选择【"+num+". "+title+"】的纬度!",2000);
                    return;
                }
                
                xmlJSON.item[count].ChangeInfo_Code = item.get('num');
                xmlJSON.item[count].ChangeInfo_IdeCode = item.get('locIdeCode');
                xmlJSON.item[count].ChangeInfo_TypeCode = "0"+item.get('typeCode');
                switch(item.get('typeCode')){
                    case "1":
                        xmlJSON.item[count].ChangeInfo_TypeValue = "国铁车站";
                        break;
                    case "2":
                        xmlJSON.item[count].ChangeInfo_TypeValue = "国铁车载";
                        break;
                    case "3":
                        xmlJSON.item[count].ChangeInfo_TypeValue = "地铁车站";
                        break;
                    case "4":
                        xmlJSON.item[count].ChangeInfo_TypeValue = "地铁车载";
                        break;
                    case "5":
                        xmlJSON.item[count].ChangeInfo_TypeValue = "地方铁路";
                        break;
                    case "6":
                        xmlJSON.item[count].ChangeInfo_TypeValue = "国外铁路";
                        break;
                }
                xmlJSON.item[count].ChangeInfo_BurValue = item.get('rwCorpDesc');
                xmlJSON.item[count].ChangeInfo_BurCode = item.get('rwCorpCode');
                xmlJSON.item[count].ChangeInfo_SecValue = item.get('rwSecDesc');
                xmlJSON.item[count].ChangeInfo_SecCode = item.get('rwSecCode');
                xmlJSON.item[count].ChangeInfo_LocValue = item.get('descDesc');
                xmlJSON.item[count].ChangeInfo_CouValue = item.get('countryDesc');
                xmlJSON.item[count].ChangeInfo_CouCode = item.get('countryCode');
                xmlJSON.item[count].ChangeInfo_Longi = item.get('longitude');
                xmlJSON.item[count].ChangeInfo_Lati = item.get('latitude');
                xmlJSON.item[count].ChangeInfo_Remark = "";
                count++;
            }
            
            if($.trim(this.$el.find('#reasonArea').val()) === ""){
                $toast('请填写安装地变更原因!', 2000);
                return;
            }
            xmlJSON.ChangeInfo_Reason = this.$el.find('#reasonArea').val()+"【申请由移动端发起】";
            console.log(JSON.stringify(xmlJSON));
            
            appcan.window.confirm({
                title : '提示',
                content : "确定提交吗？",
                buttons : ['确定', '取消'],
                callback : function(err, data, dataType, optId) {
                    if (data == 0) {
                        $toast("正在加载中");
                        //发起出差申请                                                               
                        ajaxRequest(configMasUrl.installation, {
                            "type" : "GET",
                            "data" : {
                                "action": 'startLocationChange',
                                "user" : gUserInfo["userId"],
                                'xmlData' : JSON.stringify(xmlJSON)
                            }
                            /*成功回调函数*/
                        }, function(data, status, requestCode, response, xhr) {
                            console.log(data);
                            $closeToast();
                            var json = JSON.parse(data);
                            if (json.string.Success != "0") {
                                //成功
                                appcan.window.alert('提示', json.string.Message);
                                //回退到上一页
                                appcan.window.close(-1);
                               
                            } else if (json.string.Success == "0") {
                                //失败
                                appcan.window.alert('提示', json.string.Message);
                            }
                        }, function(a,b,c) {
                            $toast("数据加载失败,请稍后再试.", 5000);
                        });
                    }
                }
            });
            
        }
    });

    // Finally, we kick things off by creating the **App**.
    var App = new AppView;
})(jQuery);
