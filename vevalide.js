//.ve-reg-info, .ve-reg-hint, .ve-reg-flag 的css用于调整信息提示的CSS类
//$('#regform .email').vevalide('email').vardump();  另外一种写法
;(function (vevalide) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define('user/vevalide',[ "jquery","user/base64" ], vevalide);
    } else {
        // 全局模式
        vevalide($);
    }
})(function($){
    $.base64 = base64;
    $.extend($.fn, {
        defaults:{
            //设置
            enquip      : true,
            Flag        : 'width:auto;background-color:#eee;margin:0px;margin-left:5px;',
            Hint        : 'overflow:hidden;width:auto;color:#999;height:30px;line-height:26px;margin:0px;padding:0px;',

            //校验
            chkEMail    : /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
            chkUsername : /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            chkVerify   : /^[a-z\d]{4}$/i,
            chkPhone    : /^(13|15|18|14|17)[0-9]{9}$/,
            chkMVerify   : /^[\d]{6}$/,

            //提示信息~~        
            infoMail    : "邮箱可用来登录和找回密码",
            infoUsername: "用户名应为4-16位，只能包含中文、数字、字母、下划线",
            infoPwd     : "密码为8-20位字母和数字的组合",
            infoPwdf    : ["<div style='background-color:#d9534f;margin:0px;width:30px;text-align:center;'>弱</div>", 
                            "<div style='background-color:#f0ad4e;margin-bottom:0px;width:30px;margin-left:30px;text-align:center;'>中</div>", 
                            "<div style='background-color:#5cb85c;margin-bottom:0px;width:30px;margin-left:60px;text-align:center;'>强</div>"
                            ],
            infoRePwd   : '请再次输入密码',
            infoVerify  : '请按右图填写',
            infoMVerify : '请输入6位数短信校验码',
            infoPhone   : '输入11位手机号码',

            //错误信息
            errMail      : "请输入正确格式的电子邮箱",
            errUsername  : "此用户名已被占用，选择另外的用户名吧",
            errUsernameE : "用户名不能为空",
            errPwd       : "为了您的账号安全，密码需为6-16位字母和数字的组合",
            errRePwd     : "两次密码输入不一致",
            errRePwdE    : "请重复密码",
            errVerify    : '验证码错误',
            errPhone     : '手机号码不正确，请确认',
            errMVerify   : '手机验证码不正确'
        },

        opts:{},

        vevalide:function(name,options){
            if(window.ve){                          
                window.ve.regins ? '' : window.ve = $.extend({}, window.ve, {regins:null,regindex:0,regcommit:[]});
            }else{
                window.ve = {regins:null,regindex:0,regcommit:[]};                      
            }   

            this.velen(); //自定义长度方法，检测中文
            ve.regins = this;
            var regindex = ve.regindex;
            ve.submitcount=0;

            var stat, p = typeof(options)==='string' ? options.toString() : undefined;
            ve.opts = this.opts = (!!options && (ve.regins.__getClass(options)==="Object")) ? (function(){ return $.extend({}, this.defaults, options) })() : this.defaults;                
            if(!ve.regcommit[regindex]) ve.regcommit[regindex]={'type':{},'item':{},'value':{}};                
            
            if(name){
                ve.regins.__getClass(name)==="Object" ? (function(){
                    var i, t;
                    for(i in name){
                        t = $(ve.regins).find(name[i]);
                        stat = ve.regins.vecheck(t,i,p,regindex);
                    }
                })() : stat = ve.regins.vecheck(this,name,p,regindex);
            }
            
            return ve.regins;
        }, 

        //检测中文长度
        velen:function(){
            String.prototype.velen=function(){return this.replace(/[^\x00-\xff]/g,"aaa").length;}            
        },

        setEnquip:function(val){
            if(!val) $(this).find('.ve-reg-flag').remove();
            ve.opts.enquip = val;
            return this;
        },          

        //测试打印
        vardump:function(){
            console.log(ve.regins);
        },

        //input下显示信息
        veshowmsg:function(item,hint,flag){
            hint = hint ? hint : '';                
            $(item.parentNode).find('.ve-reg-hint').html(hint);
            flag ? $(item.parentNode).find('.ve-reg-flag').html(flag) : '';
            hint ? ve.regins.setAlertMsgStyle(item): ve.regins.removeAlertMsgStyle(item);
        },

        //出错后input样式
        setAlertMsgStyle:function (item){                               
            item.style.border = "1px solid #E24A4A";
            item.style.boxShadow = "0px 0px 4px 1px rgba(228, 36, 36, 0.6)";                
        },

        removeAlertMsgStyle:function (item){                               
            item.style.border = "solid 1px #cfcfcf";
            item.style.boxShadow = "none";                
        },

        // *__getClass(5);  => "Number"
        // * __getClass({});  => "Object"
        // * __getClass(/foo/);  => "RegExp"
        // * __getClass('');  => "String"
        // * __getClass(true);  => "Boolean"
        // * __getClass([]);  => "Array"
        // * __getClass(undefined);  => "Window"
        // * __getClass(Element);  => "Constructor"
        //判断对象类型
        __getClass:function(object){
            return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
        },

        //添加隐藏input的内容{name:val}
        appendValue:function(options){                 
            if(!!options && (ve.regins.__getClass(options)==="Object")) {
                ve.regcommit[ve.regindex]['value'] = $.extend({}, ve.regcommit[ve.regindex]['value'], options); 
            }else if(!!options && (ve.regins.__getClass(options)==="String")){
                var key,val
                if(options.charAt(0) === '.') {   //捡class                    
                    key = $(options).attr('name');
                    val = $(options).attr('value');                    
                }else if(options.charAt(0) === '#' || /\w/.test(options.charAt(0))){
                    options.replace('#','');
                    var handle = document.getElementById(options);
                    key = handle.name;
                    val = handle.value;
                }
                $.extend({}, ve.regcommit[ve.regindex]['value'], {key:val}); 
            }
            return this;                
        },

        //初始化提交
        commit:function(act,callback){
            if(!act) {
                alert('请提交url');
                return false;
            }
            var curindex = ve.regindex;
            ve.regindex++;

            //执行设置
            ve.opts.enquip ? '' : (function(){                          
                $(ve.regins).find('.ve-reg-info').remove();
            })();

            if($(this).find(".submit").length>0){                
                $(this).find(".submit").click(function(e){                     
                    e = e||arguments[0];
                    e.preventDefault();
                    if(ve.submitcount==0){
                        ve.submitcount++;
                        tijiao(curindex,callback);
                    }
                });
            }else{
                alert('请检查注册信息');
                return false;
            }                     

            function ccc(index){
                var v = ve.regcommit[index]['value']; var t = ve.regcommit[index]['type']; var i = ve.regcommit[index]['item']; 
                var stat=false;
                for(var j in v){
                    if(i[j]){
                        stat = ve.regins.vecheck(i[j],t[j],'submit',index);                    
                        if(!stat) {
                            break;
                        }
                    }
                }                           
                return stat;
            }

            function tijiao(index,callback){
                ve.regins.stat = true;
                var stat = false;
                (function(){ 
                    stat = ccc(index);
                })();
                if(!ve.regins.stat) {
                    ve.submitcount--;
                    return false;
                }
                var cbdata = {};
                $.ajax({
                    url: act,
                    dataType: "json",
                    data: ve.regcommit[index]['value'],
                    type: "POST",
                    success: function (ajaxobj) { 
                        ve.submitcount--;
                        cbdata.success = ajaxobj;
                        callback.call(this,cbdata);
                        return false;                         
                    },
                    error: function (ajaxobj) {
                        ve.submitcount--;
                        cbdata.error = ajaxobj;
                        callback.call(this,cbdata);
                        return false;                        
                    }
                });
                
            }            
        },

        //检测分类
        vecheck:function(item,name,p,identify){
            var pp, submit = 'submit' == p ? true : (function(){ pp = p; return false;})();  
            var itemitem = false;                   
            if(name){
                (function(){
                    return  function(type,p,identify){                  
                        var info,erro;
                        var domethod;
                        var objs = this;   
                        var stat = true;                         
                        switch(type){
                            case 'email':
                                info = ve.opts.infoMail;
                                erro = ve.opts.errMail;
                                domethod = this.chkemail;
                            break;

                            case 'username':
                                info = ve.opts.infoUsername;
                                erro = ve.opts.infoUsername;
                                domethod = this.chkusername;
                            break;

                            case 'password':
                                info = ve.opts.infoPwd;
                                erro = ve.opts.errPwd;
                                domethod = this.chkpassword;
                            break;

                            case 'repassword':
                                info = ve.opts.infoRePwd;
                                erro = ve.opts.errRePwd;
                                domethod = this.chkrepassword;
                            break;

                            case 'verify':
                                info = pp === 'mob' ? ve.opts.infoMVerify : ve.opts.infoVerify;
                                erro = ve.opts.errVerify;
                                domethod = this.chkverify;
                            break;

                            case 'mobverify':
                                info = ve.opts.infoMVerify;
                                erro = ve.opts.errMVerify;
                                domethod = this.chkmverify;
                            break;

                            case 'phone':
                                info = ve.opts.infoPhone;
                                erro = ve.opts.errPhone;
                                domethod = this.chkphone;
                            break;
                        };                        
                        
                        $.each(objs,function(index,item){                                   
                            itemitem = item.tagName.toLowerCase() == 'input' ? (
                                function(){
                                    var returnitem = false;
                                    ve.regcommit[identify]['value'][item.name] = false;                 
                                    ve.regcommit[identify]['type'][item.name] = type;
                                    ve.regcommit[identify]['item'][item.name] = objs;
                                    ve.opts.enquip ? objs.createInfoBox(index,item,type) : '';
                                    if(!submit){
                                        item.value = '';
                                        $(item).focus(function(){
                                            $(item.parentNode).find('.ve-reg-hint').html(info);
                                        })                                        
                                        .focusout(function(){                                            
                                            item.value&&item.value!=='' ? returnitem = domethod.call(item,index,item,pp,identify) : ve.regins.veshowmsg(item,'');
                                            return returnitem;
                                        })
                                        .keyup(function(){
                                            if(item.value == '') {
                                                ve.regcommit[identify]['value'][item.name] = false;
                                            }
                                            returnitem = domethod.call(item,index,item,pp,identify,'kyup');
                                            return returnitem;
                                        });                                        
                                    }else{                                       
                                        returnitem = domethod.call(item,index,item,pp,identify);                                        
                                        ve.regins.stat = returnitem;
                                        return returnitem;
                                    }
                                }
                            )() : false;                            
                        });
                    }
                })().call(item,name,p,identify);
                return itemitem;  
            }
        },          

        //包装input
        createInfoBox:function(index,item,type){
            if($(item).parent().find('.ve-reg-info').length) return;            
            $(item).parent().append(
                 "<span class='ve-reg-info'>\
                    <span class='ve-reg-flag' style='"+ve.opts.Flag+"'></span>\
                 </span>\
                 <div class='ve-reg-info ve-reg-hint' style='"+ve.opts.Hint+"'></div>"
            );
        },

        //检测函数开始
        chkemail:function(index,item,p,identify){               
            var chkvalue = item ? item.value : index;
            if (!ve.opts.chkEMail.test(chkvalue)) {
                ve.regins.veshowmsg(item,ve.opts.errMail);
                return false;
            }else{
                ve.regcommit[identify]['value'][item.name] = chkvalue;
                ve.regins.veshowmsg(item,'');
                return true;
            }
        },

        chkusername:function(index,item,p,identify){
            var chkvalue = item ? item.value : index;
            if(chkvalue==''){
                ve.regins.veshowmsg(item,ve.opts.errUsernameE);
                return false;
            }
            if (!ve.opts.chkUsername.test(chkvalue)) {
                ve.regins.veshowmsg(item,ve.opts.infoUsername);
                return false;
            }else{
                if(chkvalue.velen()>16||chkvalue.velen()<4){                    
                    ve.regins.veshowmsg(item,ve.opts.infoUsername);
                    return false;
                }                
                ve.regcommit[identify]['value'][item.name] = chkvalue;
                ve.regins.veshowmsg(item,'');
                return true;
            }            
        },

        chkpassword:function(index,item,p,identify){
            var chkvalue = item ? item.value : index;            
            var psw = chkvalue; 
            var repsw = $('body').data('repswitem');
            $('body').data('pswitem',item);
            var level = (psw.length>8) ? 0 + (psw.length>8) + (/[a-z]/.test(psw) && /[A-Z]/.test(psw)) + (/\d/.test(psw) && /\D/.test(psw)) + (/\W/.test(psw) && /\w/.test(psw)) + (psw.length > 12) : 0;
            if(psw.length>20||/\s/.test(psw)) level=0; //不包括空格
            if (!level) {
                if(repsw&&repsw.value!=='') {
                    repsw.value='';
                    ve.regins.veshowmsg(repsw,'');
                }
                ve.regins.veshowmsg(item,ve.opts.errPwd);
                return false;
            }else{
                if(repsw&&repsw.value!==''&&psw!==repsw.value){
                    ve.regcommit[identify]['value'][repsw.name] = false;
                    ve.regins.veshowmsg(repsw, ve.opts.errRePwd);                    
                    return false;
                }else if(repsw&&repsw.value!==''&&psw==repsw.value){
                    ve.regins.veshowmsg(repsw,'');
                }
                var flag = level>=4 ? ve.opts.infoPwdf[2] :
                level>2 ? ve.opts.infoPwdf[1] :
                level>=1 ? ve.opts.infoPwdf[0] : '';
                //ve.regins.veshowmsg(item,'',flag);   //提示强弱
                ve.regins.veshowmsg(item,'');
                ve.regcommit[identify]['value'][item.name] = $.base64.encode(chkvalue);
                return true;
            }            
        },

        chkrepassword:function(index,item,p,identify){            
            var chkvalue = item ? item.value : index;            
            var pswitem =  $('body').data('pswitem');    

            if(!pswitem){
                alert('请先填写密码！');
                ve.regcommit[identify]['value'][item.name] = false;
                return false;
            }else{
                $('body').data('repswitem',item);            
                var psw = pswitem.value;             
                var repsw = chkvalue; 
                if(chkvalue==''){
                    ve.regins.veshowmsg(item, ve.opts.errRePwd);
                    return false;
                }
                if(psw==''){                    
                    if(arguments[4]=='kyup') alert('请先填写密码！');
                    ve.regcommit[identify]['value'][item.name] = false;
                    return false;
                }
                return (psw === repsw && repsw!=='') ? (function(){                    
                    ve.regins.veshowmsg(item,''); 
                    ve.regcommit[identify]['value'][item.name] = $.base64.encode(chkvalue); 
                    return true;
                })() : (function(){
                    //pswitem.value='';
                    ve.regins.veshowmsg(item, ve.opts.errRePwd);
                    // ve.regcommit[identify]['value'][item.name] = false;  
                    return false;
                })();
            }
        },

        chkverify:function(index,item,p,identify){
            var chkvalue = item ? item.value : index;                           
            if (!ve.opts.chkVerify.test(chkvalue)) {
                ve.regins.veshowmsg(item,ve.opts.errVerify);
                return false;
            }else{
                ve.regins.veshowmsg(item,'');
                ve.regcommit[identify]['value'][item.name] = chkvalue;
                return true;
            }            
        },

        chkmverify:function(index,item,p,identify){
            var chkvalue = item ? item.value : index;               
            if (!ve.opts.chkMVerify.test(chkvalue)) {
                ve.regins.veshowmsg(item,ve.opts.errMVerify);
                return false;
            }else{
                ve.regins.veshowmsg(item,'');
                ve.regcommit[identify]['value'][item.name] = chkvalue;
                return true;
            }            
        },

        chkphone:function(index,item,p,identify){
            var chkvalue = item ? item.value : index;
            if (!ve.opts.chkPhone.test(chkvalue)) {             
                ve.regins.veshowmsg(item,ve.opts.errPhone);
                return false;
            }else{
                ve.regins.veshowmsg(item,'');
                ve.regcommit[identify]['value'][item.name] = chkvalue;
                return true;
            }            
        }
        
    });     

    return $.fn.vevalide;

});