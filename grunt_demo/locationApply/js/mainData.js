(function($) {
    /**
     *此处填充代码
     **/
    function showMask() {
        $("#ajaxloader").css("height", $(document).height());
        $("#ajaxloader").css("width", $(document).width());
        $("#loading").show();
    }
    function hideMask() {
        $("#ajaxloader").css("height", "0");
        $("#ajaxloader").css("width", "0");
        $("#loading").hide();
    }
    
    var Todo = Backbone.Model.extend({

        defaults : function() {
            return {
                key : "key",
                value : 'value',
                CityBureau : null,
                CityBureauDes : null,
                LineSection : null,
                LineSectionDes : null,
                LocationType : null,
                LocationTypeDes : null,
                CountryCode : null,
                CountryDes : null,
                Longitude : null,      
                Latitude : null,                          
            };
        }
    });

    var TodoList = Backbone.Collection.extend({

        model : Todo,
        url : configMasUrl.installation,
        // url : 'data.json',
        comparator : 'key',
        parse : function(response) {
            hideMask();
            Todos.reset();
            $("#data-list").empty();
            $('#noContent').addClass('collapse');
            if(response.data&&response.data.length !== 0){
                console.log(response);
                appcan.setLocVal("isIde","false");
                _.invoke(response.data,function(){
                    Todos.add(new Todo({
                        key : this.keyt,
                        value : this.valuet
                    }));
                });
            }else if(response.Table&&response.Table.length !== 0){
                console.log(response);
                appcan.setLocVal("isIde","true");
                _.invoke(response.Table,function(){
                    Todos.add(new Todo({
                        key : this.LocationCode,
                        value : this.LocationDes,
                        CityBureau : this.CityBureau,
                        CityBureauDes : this.CityBureauDes,
                        LineSection : this.LineSection,
                        LineSectionDes : this.LineSectionDes,
                        LocationType : this.LocationType,
                        LocationTypeDes : this.LocationTypeDes, 
                        CountryCode : this.CountryCode,
                        CountryDes : this.CountryDes,  
                        Longitude : this.Longitude,
                        Latitude : this.Latitude  
                    }));
                });
            }else{
                appcan.setLocVal("isIde","false");
                $('#noContent').removeClass('collapse');
            }
        }
    });

    var Todos = new TodoList;

    var TodoView = Backbone.View.extend({

        tagName : "li",

        template : _.template($('#item-template').html()),

        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            // this.listenTo(this.model, 'destroy', this.remove);
        }
    });

    var AppView = Backbone.View.extend({

        el : $("#Page"),
        
        addTemplate: _.template($('#add-template').html()),
        
        events : {
            "click li" : "choice",
            "keyup #search" : "search"
        },
        
        initialize : function() {
            this.render();
            this.listenTo(Todos, 'add', this.addOne);
            // this.listenTo(Todos, 'reset', this.clear);
            var type = appcan.getLocVal("type");
            var arg = appcan.getLocVal("arg");
            var arg1 = appcan.getLocVal("arg1");
            switch(type) {
                case 'locIde':
                    Todos.fetch({data: {action: configAction.getInstallation.getLocIde,keyt:$.trim(this.$("#search").val())}});
                    showMask();
                    break;
                case 'rwCorp':
                    Todos.fetch({data: {action: configAction.getInstallation.getBureau,typeCode:arg,key:$.trim(this.$("#search").val())}});
                    showMask();
                    break;
                case 'rwSec':
                    Todos.fetch({data: {action: configAction.getInstallation.getSection,typeCode:arg1,key:$.trim(this.$("#search").val())}});
                    showMask();
                    break;
                case 'country':
                    Todos.fetch({data: {action: configAction.getInstallation.getCountry,key:$.trim(this.$("#search").val())}});
                    showMask();
                    break;
            }
        },

        render: function(){
            var tempHtml = this.$('#ipt')[0].innerHTML;
            this.$('#ipt')[0].innerHTML = tempHtml+this.addTemplate();
        },

        addOne : function(todo) {
            var view = new TodoView({
                model : todo
            });
            this.$("#data-list").append(view.render().el);
        },
        
        // clear : function (){
//             
        // },

        choice : function(obj) {
            var dt = $(obj.currentTarget).find('dt')[0].innerText;
            var dd = $(obj.currentTarget).find('dd')[0].innerText;
            var type = appcan.getLocVal("type");
            var liIndex = appcan.getLocVal("liIndex");
            // var pageScript = "$('#todo-list>li').eq("+liIndex+").find('."+type+"').val('"+dd+"');";
            var pageScript = "$('#todo-list>li').eq("+liIndex+").find('."+type+"').attr('value','"+dd+"');";
            pageScript += "$('#todo-list>li').eq("+liIndex+").find('."+type+"').attr('code','"+dt+"');";
            
            if(appcan.getLocVal("isIde")==='true'){
                var CB = $(obj.currentTarget).find('.CityBureau')[0].value;
                var CBD = $(obj.currentTarget).find('.CityBureauDes')[0].value;
                var LS = $(obj.currentTarget).find('.LineSection')[0].value;
                var LSD = $(obj.currentTarget).find('.LineSectionDes')[0].value;
                var LT = $(obj.currentTarget).find('.LocationType')[0].value.slice(-1);
                var LTD = $(obj.currentTarget).find('.LocationTypeDes')[0].value;
                var CC = $(obj.currentTarget).find('.CountryCode')[0].value;
                var CD = $(obj.currentTarget).find('.CountryDes')[0].value;
                var Long = $(obj.currentTarget).find('.Longitude')[0].value;
                var Lati = $(obj.currentTarget).find('.Latitude')[0].value;
                pageScript += "$('#todo-list>li').eq("+liIndex+").find('select').val('"+LT+"');";
                pageScript += "$('#todo-list>li').eq("+liIndex+").find('.rwCorp').attr('code','"+CB+"');";
                pageScript += "$('#todo-list>li').eq("+liIndex+").find('.rwCorp').attr('value','"+CBD+"');";
                pageScript += "$('#todo-list>li').eq("+liIndex+").find('.rwSec').attr('code','"+LS+"');";
                pageScript += "$('#todo-list>li').eq("+liIndex+").find('.rwSec').attr('value','"+LSD+"');";
                pageScript += "$('#todo-list>li').eq("+liIndex+").find('.desc').attr('value','"+dd+"');";
                pageScript += "$('#todo-list>li').eq("+liIndex+").find('.country').attr('code','"+CC+"');";
                pageScript += "$('#todo-list>li').eq("+liIndex+").find('.country').attr('value','"+CD+"');";
                pageScript += "$('#todo-list>li').eq("+liIndex+").find('.longitude').attr('value','"+Long+"');";
                pageScript += "$('#todo-list>li').eq("+liIndex+").find('.latitude').attr('value','"+Lati+"');";
            }
            
            pageScript += "$('#todo-list>li').eq("+liIndex+").find('."+type+"').change();";
            if(appcan.getLocVal("locationAction")==="add"){
                appcan.window.evaluateScript('locationAdd', pageScript);
            }else{
                appcan.window.evaluateScript('locationApply', pageScript);
            }
            appcan.window.close("-1");
        },
        
        search : function() {
            var type = appcan.getLocVal("type");
            var arg = appcan.getLocVal("arg");
            var arg1 = appcan.getLocVal("arg1");
            switch(type) {
                case 'locIde':
                    Todos.fetch({data: {action: configAction.getInstallation.getLocIde,keyt:$.trim(this.$("#search").val())}});
                    break;
                case 'rwCorp':
                    Todos.fetch({data: {action: configAction.getInstallation.getBureau,typeCode:arg,key:$.trim(this.$("#search").val())}});
                    break;
                case 'rwSec':
                    Todos.fetch({data: {action: configAction.getInstallation.getSection,typeCode:arg1,key:$.trim(this.$("#search").val())}});
                    break;
                case 'country':
                    Todos.fetch({data: {action: configAction.getInstallation.getCountry,key:$.trim(this.$("#search").val())}});
                    break;
                default :
                    showMask();
            }
        }
    });

    // Finally, we kick things off by creating the **App**.
    var App = new AppView;
})(jQuery);
