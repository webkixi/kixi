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
            this.aj.email = {url:'/',data:{'ctl':'ajax','act':'checkmail'}};
            return this;
        },        
        gjjax:function(){

        },
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
        gtjax:function(){
            return this;
        },
        ptjax:function(){
            return this;
        },
        rpl:function(tmp,ve){
            if(!ve)return false;
            tmp = tmp.replace(/\{\{(.*?)\}\}/gi,function(a,b){
                    return eval(b);
                });
            this.rpltmp = tmp;
            return this;
        },
        gettmp:function(){
            return this.rpltmp;
        },
        getdata:function(callback){
            this.pjjax(this.aj.login,function(ajaxdata,stat){
                callback.call(this,ajaxdata,stat);                
            });
            return this;
        },
        getuser:function(callback){
            this.pjjax(this.aj.login,function(ajaxdata,stat){
                if(stat=='success'&&ajaxdata.user_info)
                    callback.call(this,ajaxdata.user_info,stat);
                else
                    callback.call(this,ajaxdata);
            });
            return this;
        },
        getcart:function(callback){
            this.pjjax(this.aj.login,function(ajaxdata,stat){
                if(stat=='success'&&ajaxdata.user_info)
                    callback.call(this,ajaxdata.cart_list,stat);
                else
                    callback.call(this,ajaxdata);
            });
            return this;
        },
        getcoupon:function(){
            return this;
        },
        getEmail:function(email,callback){
            if(!email) return;
            this.aj.email.data.email = email;
            this.pjjax(this.aj.email,function(ajaxdata,stat){
                callback.call(this,ajaxdata,stat);
            });
            return this;
        }
    }

    $.veget = function(){
        return new yjax();
    };

    return $.veget();
});