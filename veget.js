//拿数据
define('common/veget',[], function(){

    var Class = {create: function() {  return function() {this.initialize.apply(this, arguments);} } }
    var yjax = Class.create(); 
    yjax.prototype = {
        initialize: function() {
            this.jdata;
            this.rpltmp;
            this.aj={};
            this.aj.login = {url:'/',data:{'ctl':'ajax','act':'logininfo'}};
            return this;
        },  
        //get方法   json
        gjjax:function(){

        },
        //post方法 json
        pjjax:function(obj,callback){
            url = obj.url;
            data = obj.data;
            $.ajax({
                url: url,
                dataType: "json",
                data: data,
                type: "POST",
                success: function (ajaxobj) {
                    if(callback)callback.call(this,ajaxobj,'success');
                    return false;
                },
                error: function (ajaxobj) {       
                    if(callback)callback.call(this,ajaxobj,'error');
                    return false;
                }
            });
            return this;
        },
        //get   text
        gtjax:function(){
            return this;

        },
        //post  text
        ptjax:function(){
            return this;

        },
        //模板替换  统一json变量为ve
        rpl:function(tmp,ve){
            if(!ve)return false;
            tmp = tmp.replace(/\{\{(.*?)\}\}/gi,function(a,b){
                    return eval(b);
                });
            this.rpltmp = tmp;
            return this;
        },
        //返回rpl的数据，会切断链式结构
        gettmp:function(){
            return this.rpltmp;
        },
        //完整数据
        getdata:function(callback){
            this.pjjax(this.aj.login,function(ajaxdata,stat){
                callback.call(this,ajaxdata,stat);                
            });
            return this;
        },
        //拿用户数据
        getuser:function(callback){            
            this.pjjax(this.aj.login,function(ajaxdata,stat){
                if(stat=='success'&&ajaxdata.user_info)
                    callback.call(this,ajaxdata.user_info,stat);
                else
                    callback.call(this,'error');
            });
            return this;
        },
        //购物车数据
        getcart:function(callback){
            this.pjjax(this.aj.login,function(ajaxdata,stat){
                if(stat=='success'&&ajaxdata.user_info)
                    callback.call(this,ajaxdata.cart_list,stat);
                else
                    callback.call(this,'error');
            });
            return this;
        },
        //优惠券数据
        getcoupon:function(){
            this.pjjax(this.aj.login,function(ajaxdata,stat){
                if(stat=='success'&&ajaxdata.coupon)
                    callback.call(this,ajaxdata.coupon,stat);
                else
                    callback.call(this,'error');
            });
            return this;
        }
    }

    $.veget = function(){
        return new yjax();
    };

    return $.veget();
});