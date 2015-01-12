/**
 * @name    前端公共的js
 */
define('global/g', ['common/veget'], function(vg) {
    var exports = {};    
    var urls = window._VE_Cfg.urls;
    var mod_name=$('body').attr('data-md');
    //顶部用户登录注册，欢迎部分
    vg.getuser(function(u){
        $.extend(u,urls);
        u.mod_name = mod_name;        

        var userinfo_top_tmp_login = '<div class="userinfo-top"><span>欢迎您,</span><a data-interaction="global|tuserinfo|1|1" href="{{ve.uc_account}}" class="c-reg">{{ve.user_name}}</a>\
                            <a data-interaction="global|tuserinfo|1|2" href="{{ve.logout}}">退出</a><i class="i-line"></i>\
                            <a data-interaction="global|tuserinfo|1|4" href="{{ve.uc_order}}">我的唯一</a><i class="i-line"></i></div>';
        var userinfo_top_tmp = '<div class="webcome-ve"><span>欢迎来到唯一优品，请</span><a data-interaction="global|tuserinfo|1|1"  href="{{ve.login}}" title="登录">登录</a><i class="i-line"></i>\
                            <a data-interaction="global|tuserinfo|1|2"  href="{{ve.register}}" class="c-reg" title="注册">免费注册</a><i class="i-line"></i>\
                            <a data-interaction="global|tuserinfo|1|4"  href="{{ve.uc_order}}">我的唯一</a><i class="i-line"></i></div>';
        
        userinfo = (u&&u.id>0) ? userinfo_top_tmp_login : userinfo_top_tmp;
        var userinfo = vg.rpl(userinfo,u).gettmp();
        if($('#userinfo_top').length) $('#userinfo_top').html(userinfo);
    });
      
    

    var register = {};    
    var register_one = {};
    var regi = function(zone,vari,fun){
        if(!register[zone]){
            register[zone] = {};        
        }
        var zzz = register[zone];
        if(!zzz['vari']) {
            zzz['vari'] = [];
            zzz['fun'] = [];
        }

        zzz['vari'].push(vari);
        zzz['fun'].push(fun);
    }

    var regiOne = function(zone,vari,fun){        
        register_one[zone] = {};
        var zzz = register_one[zone];
        zzz['vari'] = [];
        zzz['fun'] = [];

        zzz['vari'].push(vari);
        zzz['fun'].push(fun);
    }

    function useOne(type){        
        if(!type) return ;
        switch(type){
            case 'user':
                doUser(register_one['user']);
            break;
        }
    }

    function use(type){
        if(!type) return ;
        switch(type){
            case 'user':
                doUser(register['user']);
            break;                        
        }

    }
    function doUser(obj){
        // var zzz = register['user'];
        var zzz=obj
        vg.getdata(function(json){             
            var info_user, info_cart, info_coupon, cart_total_num, cart_total_price;
            if(json.user_info) info_user = json.user_info;
            if(json.cart_list) info_cart = json.cart_list;
            if(json.coupon) info_coupon = json.coupon;
            if(json.status==0) info_user='未登录';

            cart_total_num = json.cart_total_num;
            cart_total_price = json.cart_total_price;            

            for(var i=0;i<zzz.vari.length;i++){                
                if(zzz.vari[i]=='cart'){              
                    if(info_cart)
                        zzz.fun[i](info_cart);
                }//

                if(zzz.vari[i].indexOf('email')>-1){                    
                    var v = zzz.vari[i].split('##');
                    if(v.length<2) return;
                    (function(){
                        var j=i;
                        vg.getEmail(v[1],function(jmail){
                            if(jmail)
                                zzz.fun[j](jmail); 
                        })
                    })();
                }//
            }//       
        });
    }    

    function __getClass(object){
        return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
    };

    function __measureDoc(){
        var doch = document.documentElement.clientHeight, docw = document.documentElement.clientWidth,
        docST = document.documentElement.scrollTop||document.body.scrollTop,
        docSL = document.documentElement.scrollLeft||document.body.scrollLeft;
        return {dw:docw,dh:doch,st:docST,sl:docSL};
    };

    function __getRect(element) {
      var offset = $(element).offset();
      offset.bottom = offset.top+$(element).height();
      offset.right = offset.left+$(element).width();
      offset.width = $(element).width();
      offset.height= $(element).height();
      return offset;
    };

    //模板替换方法
    var tpl = function(tpl,jsondata){
        if(__getClass(tpl)=='String'){

        }
        
        if(__getClass(tpl)=='Object'){

        }

        if(__getClass(tpl)=='Array'){

        }
        return vg.rpl(tpl,jsondata).gettmp();
    }
    
    //md5
    //!function(n){"use strict";function t(n,t){var r=(65535&n)+(65535&t),e=(n>>16)+(t>>16)+(r>>16);return e<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,u,o,c,f){return t(r(t(t(e,n),t(o,f)),c),u)}function u(n,t,r,u,o,c,f){return e(t&r|~t&u,n,t,o,c,f)}function o(n,t,r,u,o,c,f){return e(t&u|r&~u,n,t,o,c,f)}function c(n,t,r,u,o,c,f){return e(t^r^u,n,t,o,c,f)}function f(n,t,r,u,o,c,f){return e(r^(t|~u),n,t,o,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[(r+64>>>9<<4)+14]=r;var e,i,a,h,d,g=1732584193,l=-271733879,v=-1732584194,C=271733878;for(e=0;e<n.length;e+=16)i=g,a=l,h=v,d=C,g=u(g,l,v,C,n[e],7,-680876936),C=u(C,g,l,v,n[e+1],12,-389564586),v=u(v,C,g,l,n[e+2],17,606105819),l=u(l,v,C,g,n[e+3],22,-1044525330),g=u(g,l,v,C,n[e+4],7,-176418897),C=u(C,g,l,v,n[e+5],12,1200080426),v=u(v,C,g,l,n[e+6],17,-1473231341),l=u(l,v,C,g,n[e+7],22,-45705983),g=u(g,l,v,C,n[e+8],7,1770035416),C=u(C,g,l,v,n[e+9],12,-1958414417),v=u(v,C,g,l,n[e+10],17,-42063),l=u(l,v,C,g,n[e+11],22,-1990404162),g=u(g,l,v,C,n[e+12],7,1804603682),C=u(C,g,l,v,n[e+13],12,-40341101),v=u(v,C,g,l,n[e+14],17,-1502002290),l=u(l,v,C,g,n[e+15],22,1236535329),g=o(g,l,v,C,n[e+1],5,-165796510),C=o(C,g,l,v,n[e+6],9,-1069501632),v=o(v,C,g,l,n[e+11],14,643717713),l=o(l,v,C,g,n[e],20,-373897302),g=o(g,l,v,C,n[e+5],5,-701558691),C=o(C,g,l,v,n[e+10],9,38016083),v=o(v,C,g,l,n[e+15],14,-660478335),l=o(l,v,C,g,n[e+4],20,-405537848),g=o(g,l,v,C,n[e+9],5,568446438),C=o(C,g,l,v,n[e+14],9,-1019803690),v=o(v,C,g,l,n[e+3],14,-187363961),l=o(l,v,C,g,n[e+8],20,1163531501),g=o(g,l,v,C,n[e+13],5,-1444681467),C=o(C,g,l,v,n[e+2],9,-51403784),v=o(v,C,g,l,n[e+7],14,1735328473),l=o(l,v,C,g,n[e+12],20,-1926607734),g=c(g,l,v,C,n[e+5],4,-378558),C=c(C,g,l,v,n[e+8],11,-2022574463),v=c(v,C,g,l,n[e+11],16,1839030562),l=c(l,v,C,g,n[e+14],23,-35309556),g=c(g,l,v,C,n[e+1],4,-1530992060),C=c(C,g,l,v,n[e+4],11,1272893353),v=c(v,C,g,l,n[e+7],16,-155497632),l=c(l,v,C,g,n[e+10],23,-1094730640),g=c(g,l,v,C,n[e+13],4,681279174),C=c(C,g,l,v,n[e],11,-358537222),v=c(v,C,g,l,n[e+3],16,-722521979),l=c(l,v,C,g,n[e+6],23,76029189),g=c(g,l,v,C,n[e+9],4,-640364487),C=c(C,g,l,v,n[e+12],11,-421815835),v=c(v,C,g,l,n[e+15],16,530742520),l=c(l,v,C,g,n[e+2],23,-995338651),g=f(g,l,v,C,n[e],6,-198630844),C=f(C,g,l,v,n[e+7],10,1126891415),v=f(v,C,g,l,n[e+14],15,-1416354905),l=f(l,v,C,g,n[e+5],21,-57434055),g=f(g,l,v,C,n[e+12],6,1700485571),C=f(C,g,l,v,n[e+3],10,-1894986606),v=f(v,C,g,l,n[e+10],15,-1051523),l=f(l,v,C,g,n[e+1],21,-2054922799),g=f(g,l,v,C,n[e+8],6,1873313359),C=f(C,g,l,v,n[e+15],10,-30611744),v=f(v,C,g,l,n[e+6],15,-1560198380),l=f(l,v,C,g,n[e+13],21,1309151649),g=f(g,l,v,C,n[e+4],6,-145523070),C=f(C,g,l,v,n[e+11],10,-1120210379),v=f(v,C,g,l,n[e+2],15,718787259),l=f(l,v,C,g,n[e+9],21,-343485551),g=t(g,i),l=t(l,a),v=t(v,h),C=t(C,d);return[g,l,v,C]}function a(n){var t,r="";for(t=0;t<32*n.length;t+=8)r+=String.fromCharCode(255&n[t>>5]>>>t%32);return r}function h(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;for(t=0;t<8*n.length;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function d(n){return a(i(h(n),8*n.length))}function g(n,t){var r,e,u=h(n),o=[],c=[];for(o[15]=c[15]=void 0,u.length>16&&(u=i(u,8*n.length)),r=0;16>r;r+=1)o[r]=909522486^u[r],c[r]=1549556828^u[r];return e=i(o.concat(h(t)),512+8*t.length),a(i(c.concat(e),640))}function l(n){var t,r,e="0123456789abcdef",u="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),u+=e.charAt(15&t>>>4)+e.charAt(15&t);return u}function v(n){return unescape(encodeURIComponent(n))}function C(n){return d(v(n))}function m(n){return l(C(n))}function s(n,t){return g(v(n),v(t))}function A(n,t){return l(s(n,t))}function p(n,t,r){return t?r?s(t,n):A(t,n):r?C(n):m(n)}"function"==typeof define&&define.amd?define(function(){return p}):n.md5=p}(window);

    var md5=function(name){
        return name;
    };

    var HashMap = function() {
        var size = 0;
        var entry = new Object();
        this.put = function (key, value) {
            var nkey = md5(key);
            entry[nkey] = value;  
            size++;  
        };
        this.putAll = function (map) {  
            if (typeof map == "object" && !map.sort) {  
                for (var key in map) {  
                    this.put(key, map[key]);  
                }  
            } else {  
                throw "输入类型不正确，必须是HashMap类型！";
            }  
        };           
        this.get = function (key) {  
            var nkey = md5(key);
            if(entry[nkey])
                return entry[nkey];
        };            
        this.remove = function (key) {  
            var nkey = md5(key);
            if(entry[nkey]){
                if (size == 0)  
                    return;  
                delete entry[nkey];  
                size--;  
            }
        };          
        this.containsKey = function (key) {  
            var nkey = md5(key);
            if (entry[nkey]) {  
                return true;  
            }  
            return false;  
        };            
        this.containsValue = function (value) {  
            for (var key in entry) {  
                if (entry[key] == value) {  
                    return true;  
                }  
            }  
            return false;  
        };            
        this.clear = function () {  
            entry = new Object();  
            size = 0;  
        };            
        this.isEmpty = function () {  
            return size == 0;  
        };            
        this.size = function () {  
            return size;  
        };            
        this.keySet = function () {  
            var keys = new Array();  
            for (var key in entry) {  
                keys.push(key);  
            }  
            return keys;  
        };           
        this.entrySet = function () {  
            var entrys = new Array();  
            for (var key in entry) {  
                var et = new Object();  
                et[key] = entry[key];  
                entrys.push(et);  
            }  
            return entrys;  
        };            
        this.values = function () {  
            var values = new Array();  
            for (var key in entry) {  
                values.push(entry[key]);  
            }  
            return values;  
        };           
        this.each = function (cb) {  
            for (var key in entry) {  
                cb.call(this, key, entry[key]);  
            }  
        };            
        this.toString = function () {  
            return __obj2str(entry);  
        };
    }

    /*
    *@ 对象转换成字符串
    *  o - json obj
    */
    __obj2str = function (o) {  
        var r = [];  
        if (typeof o == "string")  
            return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";  
        if (typeof o == "object") {  
            for (var i in o)  
                r.push("\"" + i + "\":" + __obj2str(o[i]));  
            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {  
                r.push("toString:" + o.toString.toString());  
            }  
            r = "{" + r.join() + "}";  
            return r;  
        }  
        return o.toString();  
    }

    function __arg2arr(args){ return Array.prototype.slice.call(args); }

    var _ctx;
    function init(context,opts,callback){
        var ctx = context==window ? context : (function(){ window.context = context; return window.context;})();
        var cbk = callback;
        var req;
        var ajaxitem;
        var defaults = {
            url:'',
            method:'post',
            data:'',
            type:'json'
        }

        //ajax stack priority high
        var ajaxStack=[];
        var ajaxVarStack=[];
        var ajaxResultStack=[];

        //normal stack  priority low
        var funStack = [];
        var funVerStack = [];
        var funResultStack = [];

        var resault={};
        for(var iii in opts){            
            if(__getClass(opts[iii])=='Object'){
                if(opts[iii].jquery){
                    var ele = opts[iii][0];
                    // console.log(ele);
                }else{
                    req = opts[iii];
                    if(!req.url||req.url=='') return;
                    ajaxitem = $.extend({},defaults,req);
                    ajaxitem.vari = iii;
                    ajaxStack.push(ajaxitem);
                    ajaxVarStack.push(iii);
                }
            }else if(__getClass(opts[iii])=='Function'){
                var fun = opts[iii];
                funStack.push(fun);
                funVerStack.push(iii);
                add_action(iii,fun,fun.length);
            }else if(__getClass(opts[iii])=='Array'){                
                var ary = opts[iii];                
                if(__getClass(ary[0])!=='Function') return;                
                funStack.push(ary);
                funVerStack.push(iii);
                add_action(iii,ary,ary[0].length);
            }
        }

        var tmp;
        function cb(err,data){
            var ttt;        
            if(data) {    
                var vtmp = ajaxVarStack.shift();
                resault[vtmp] = data;
                ajaxResultStack.push(data);
            }
            if(ajaxStack.length>0){
                tmp = ajaxStack.shift();
                runajax(tmp);
            }else{
                for(var v in resault){
                    ctx[v] = resault[v];                
                }
                ajaxStack=[];
                ajaxVarStack=[];
                ajaxResultStack=[];
                // resault={};

                if(funVerStack.length>0){                                  
                    var tfun;
                    var tprompt;
                    var doact;
                    clearTimeout(ttt);
                    for(var i=0; i<funVerStack.length; i++){
                        (function(j){
                            doact = funVerStack[j];
                            if(__getClass(funStack[j])=='Function'){
                                ctx[doact] = funStack[j];
                            }
                            else if(__getClass(funStack[j])=='Array'){                                
                                doact = funVerStack[j];
                                tfun = funStack[j][0];
                                tprompt = funStack[j].slice(1);
                                ctx[doact] = tfun;                                
                            }
                            if(tprompt&&tprompt.length>0){                         
                                setTimeout(function(){ do_action(doact,tprompt) }, 17);
                            }else{                                
                                setTimeout(function(){ do_action(doact) }, 17);
                            }
                        })(i)
                    }
                }
                if(callback) callback(ctx);
            }
        }

        function runajax(ttt){            
            $.ajax({
                url: ttt.url,
                dataType: ttt.type,
                data: ttt.data,
                type: ttt.method,
                success: function(data){
                    if(!data||data=='')
                        data={};
                    cb(null,data);
                },
                error: function(data){
                    if(!data||data=='')
                        data={};
                    cb(null,data);
                }
            });
        }
        // if(ajaxStack.length>0){cb(); } 
        cb();
    }

    //hooks
    var actmap = new HashMap();
    function do_action(name){
        var funs=[]; 
        var tmp;        
        var argmts = __arg2arr(arguments);               
        if(actmap.containsKey(name)){
            funs = actmap.get(name);            
            if(funs.length>0){                                
                for(var i=0; i<funs.length; i++){
                    tmp = funs[i];                     
                    if(__getClass(tmp.fun)!=='Function') {
                        if(__getClass(tmp.fun[0])!=='Function') return;
                        tmp.fun = tmp.fun[0];
                    }                    
                    if(tmp.propnum&&tmp.propnum>0){                        
                        if(argmts.length>2&&argmts.length>tmp.propnum){
                            argmts = argmts.splice(1,(1+tmp.propnum));
                        }else{
                            argmts = argmts.slice(1);
                        }
                        tmp.fun.apply(this,argmts);
                    }else
                        tmp.fun();
                }
            }
        }
    }

    function add_action(name,fun,propnum){       
        if(__getClass(fun)=='Function'||__getClass(fun)=='Array'){        
            var funs=[];
            var tmp = {};
            var hasdefine=false;        
            propnum = propnum ? propnum : 1;
            if(actmap.containsKey(name)){
                funs = actmap.get(name);                
                for(var j=0; j<funs.length; j++){                    
                    if(__getClass(fun)=='Array'){                        
                        if(__obj2str(funs[j].fun)==__obj2str(fun[0])){                                                        
                            hasdefine=true;
                        }
                    }else if(__obj2str(funs[j])==__obj2str(fun)){
                        hasdefine=true;
                    }
                }                
                if(hasdefine==false){
                    tmp.fun = fun;
                    tmp.propnum = propnum;
                    funs.push(tmp);
                    actmap.put(name,funs);
                }
            }else{                
                tmp.fun = fun;                
                tmp.propnum = propnum;
                funs.push(tmp);
                actmap.put(name,funs);
            }
        }
    }    
    
    var tips = function(show,msg,timeout){
        var msg_left, msg_top;
        var docRect = __measureDoc();
        var sl = docRect.sl;
        var st = docRect.st;
        var cw = docRect.dw;
        var ch = docRect.dh;

        function newmsg(mm){
            var tip = document.createElement('div');
            var subtip = document.createElement('div');
            tip.className = 'showmsg';
            tip.style.cssText = 'display:none;z-index:10030;width:100%;text-align:center; margin-top:10px;';
            subtip.style.cssText = 'width:100%;height:100%;color:#fff;background-color:#4ba2f9;line-height:40px;font-size:16px;';
            if(typeof(mm)=='undefined') mm = "请稍候。。。";
            subtip.innerHTML = mm;
            tip.appendChild(subtip);
            return tip;
        }

        function pushmsg(mm){
            clearTimeout(ggg);
            msg_left = Math.round((parseInt(cw)-300)/2);

            var msgitem = new newmsg(mm);
            $('#msgcontainer').length ? '' : $('body').append('<div id="msgcontainer" style="width:300px;position:fixed;top:10px;left:'+msg_left+'px;"></div>');
            $('#msgcontainer').append(msgitem);

            msgitem.style.left = msg_left+'px';
            $(msgitem).fadeIn('slow').delay(2000).animate({'height':0,'opacity':0,'margin':0},300);
            var ggg = setTimeout(function(){
                $(msgitem).remove();
                if($('.showmsg').length==0) $('#msgcontainer').remove();
            }, 3000);
        }

        init(this,{
            ttips: [pushmsg,msg]
        });        
    }   

    // window.tips = tips;
    
    //not recommended
    exports.regi = regi;
    exports.use = use;
    exports.regiOne = regiOne;
    exports.useOne = useOne;

    //hooks
    exports.do_action = do_action;
    exports.add_action = add_action;
    
    //pull remote data
    exports.init = init;
    exports.tpl = tpl;

    exports.tips = tips;

    exports.veget = vg;

    return exports;
})
