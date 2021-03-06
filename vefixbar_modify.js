// ;(function (vefixbar) {
//     if (typeof define === "function" && define.amd) {
//         // AMD模式
//         define([ "jquery"], vefixbar);
//     } else {
//         // 全局模式
//         vefixbar($);
//     }
// })
define('sidebar/vefixbar',[], function(){

    var Class = {create: function() {  return function() {this.initialize.apply(this, arguments);} } }
    var vfixbar = Class.create(); 
    vfixbar.prototype = {
    initialize: function(item,position) {                          
        $('body').append('<div id="fixpop" style="position: fixed;overflow-y: auto; overflow-x: hidden;display:none;width:atuo;height:auto;top:0;background-color:#fff;z-index:9000;"></div>');
        this.css = {'position':'fixed',       
        'z-index':'9001',
        'width':'35px',
        'height':'100%',
        'background-color':'#333'
        };         
        this.jdata;
        window.fixbar = this;
        window._measurePopPos = _measurePopPos;
        window._subString = _subString;
        this.fixpop = $('#fixpop');
        this.bar = item;
        this.box;
        this.appendbox=[];
        this.appendindex=0;
        this.bar.btnindex;
        this.bar.btnmethod;
        this.position;
        this.popcss = {};

        var doc   = _measurePopPos();
        this.popcss.draw = {'top':'0','height':'100%','width':'auto'};
        this.popcss.hove = {'top':'none','height':'auto','width':'auto'};
        this.debug = false;
        position ? eval( 'this.'+position+'()') : this.position = 'right';
        return this;
    },
    pop:function(item,callback){
        var thefixpop = this.fixpop;
        callback.call(item,thefixpop);       
        return this; 
    },
    scroll:function(scroll,callback){
        var thefixpop = this.fixpop;       

        var p = 0, t = scroll;
        $(window).scroll(function(e){
            p = $(this).scrollTop();
            if(t < p){}
            else{ 
                callback.call(item,thefixpop);
                console.log('aaaaaaaa'); 
            }
            setTimeout(function(){ t = p ;},0);
        });
        // $(window).scroll
        return this;
    },
    fixed:function(callback){
        var thebar = this.bar;
        $(thebar[0]).css(this.css);
        if(callback)callback.call(this);
    },
    left:function(){
        this.position = 'left';
        $.extend(this.css,{'left':0}); 
        $(this.bar).removeAttr("style",'right');
        return this;
    },
    right:function(){
        this.position = 'right';
        $(this.bar).removeAttr("style",'left');
        return this;
    },
    center:function(){
        this.position = 'center';
        $.extend(this.css,{'left':'25%'}); 
        $(this.bar).removeAttr("style",'right');
        return this;
    },
    top:function(){
        this.position = 'top';
        $.extend(this.css,{'left':'0','top':'0','width':'100%','height':'50px'});
        $(this.bar).removeAttr("style",'bottom');
        return this;
    },
    bottom:function(){
      this.position = 'bottom';     
      $.extend(this.css,{'bottom':'0','left':'0','width':'100%','height':'50px'});
      $(this.bar).removeAttr("style",'top');
      return this;
    },
    setCss:function(options){        
        if(!!options && (__getClass(options)==="Object")) {      
          if(typeof $ === 'function')
              $.extend(this.css,options);
        }
        return this;      
    },
    append:function(div,callback){
        var thebar = this.bar;
        var divcount, divstr,tmp;
        this.appendindex++;
        if(div && (__getClass(div)=="String")) {
          if(/\*[\d]{1}/.test(div) ){
            tmp = div.split('*');
            div = tmp[0];
            divcount = parseInt(tmp[1]);            
          }                 
      divstr = /(#)/.test(div) ? '<div style="~sty~" id="'+div.replace('#','')+'">sidebar</div>' : /(\.)/.test(div) ? '<div style="~sty~" class="'+div.replace('.','')+'">sidebar</div>' : (function(){return '<div style="~sty~" class="'+div+'">sidebar</div>';})();
      divstr = divstr.replace('~sty~','position:relative;height:auto;width:auto;z-index:9500;');                    
      if(divcount>1){
        tmp='';
        for(var i=0;i<divcount;i++){
          tmp+=divstr+'\n';
        }
      }
      divstr = tmp;   
      thebar.append(divstr);
        }
        // this.bar.find(div).each(function(i,e){
        //  this.appendbox.push(e);
        // }); //this.appendbox.push(this.bar.find(div));
        callback.call(this,this.appendindex-1,this.bar.find(div)); 
        return this;
    },
    gotop:function(){
        document.documentElement.scrollTop = 0; document.body.scrollTop = 0;
    },
      //pop:function()  弹窗
      //scroll:function  滚动显示
      //lazy:function  延时显示
      //tag:function
    tag:function(tag,data,callback){      
      var position = this.position;
      var vtag,etag,tagtab;
      if(tag && tag.jquery && tag.length>0){
          vtag = '.tag*'+tag.length;          
          etag = tag;
        }else if((__getClass(tag)=="String")){   
          if(/\*[\d]{1}/.test(tag) ){
            tag = '.'+tag.replace('.','');
            vtag = tag;
            var tmp = tag.split('*');
            tag = tmp[0];
            etag = $(tag);
          }else{
            vtag = tag;
            etag = $(tag);
          }          
        }   
      this.append(vtag,function(i,box){
        $(box).each(function(k,v){
          if(etag[k]){            
            $(v).html("<a href='#"+etag[k].name+"'>"+(data[k]?data[k]:'sidebar')+"</a>");          
          }
        });
        var csss = (position=='left'||position=='right') ? {width:'100%',height:'auto','margin-top':'10px'} : {width:'auto',height:'100%','float':'left','margin-left':'10px'};
          $(box).css(csss).css('background-color','red');   
          tagtab = box;     
        });
      if(callback)callback.call(this,etag,tagtab);
      return this;
    },
    ajax:function(act,data,callback){        
        $.ajax({
            url: act,
            dataType: "json",
            data: data,
            type: "POST",
            success: function (ajaxobj) {
                // cbdata.success = ajaxobj;   
                window.fixbar.jdata = ajaxobj;             
                if(callback)callback.call(this,ajaxobj);
                return false;                         
            },
            error: function (ajaxobj) {       
                window.fixbar.jdata = ajaxobj;         
                if(callback)callback.call(this,ajaxobj);
                return false;                        
            }
        });
        return this;
    },
    btn:function(idf,method,callback){         
        var thebar = this.bar, fix = this, position = this.position;        
        var thefixpop = this.fixpop;        
        if(!method)method='nomal';

        if(idf && (__getClass(idf)==="String")) {          
            btn = this.bar.find(idf);
            $.each(btn,function(i,v) {
                v.setAttribute('idindex',i);
            });
            //执行回调 
            callback.call(btn,thefixpop,fix);
            $(btn).on('mouseenter',function(e){
                var doc   = _measurePopPos(),
                cur_btn   = this, 
                p         = $(this).offset(),    
                btnindx   = this.getAttribute('idindex') ;

                //绑定方法//必须回调之前
                method == 'gotop' ?  $(this).click(function(){fix.gotop();}) : '';
                thefixpop.css(fix.popcss.hove);
                             
                //计算位置
                var fixpoprect = __getRect(thefixpop[0]);
                var diftop = (function(){  return (p.top+200>doc.dh+doc.st) ? fixpoprect.top+(p.top+cur_btn.offsetHeight-fixpoprect.bottom-doc.st) : p.top-doc.st; })();
                var difleft = (function(){ return (position=='right'||p.left+160>doc.dw) ?cur_btn.offsetWidth : p.left+cur_btn.offsetWidth; })();              
                var inifixpop=function(){
                    (position=='right'||p.left+160>doc.dw) ? thefixpop.hide().css({'right': -(200+fixpoprect.width)+'px'})
                    : thefixpop.hide().css({'left': -(200+fixpoprect.width)+'px'}); // thefixpop.hide();
                }

                $('#fixpop').live('mouseleave',function(){  //重新测量弹出框
                    inifixpop();
                });
                !thebar.btnindex?inifixpop():'';
                thefixpop.stop();
                thefixpop.show(100).animate({'top':diftop+'px'},160);
                (p.left+160>doc.dw) ? thefixpop.show(100).animate({right:difleft+"px"},160) : thefixpop.show(100).animate({left:difleft+"px"},160);
          
                thebar.btnindex = btnindx;
                thebar.btnmethod = method;              
          });
        }
        return this;
    },
    rsp:function(options,callback){
        var thebar = this.bar;
        var fix = this;
        var other;
        defaults={
          xs:'',
          sm:'.aaa',
          md:'',
          lg:''
        };  
        var opts;     
        var showunit;
        var showit;
        if(options && (__getClass(options)==="Object")) {
          var opts = $.extend({},defaults,options);
        }else
          opts = defaults;        

        $(window).resize(function(){
            var doc = _measurePopPos();
            // $(thebar).children().hide();
            $(thebar).children().css('visibility','hidden');
            $(thebar).mouseover(function(){
                $(thebar).css('background-color','#333');
                $(thebar).children().css('visibility','visible');
            });
            
            if(doc.dw>0&&doc.dw<768){
                //xs  
                showunit =opts.xs.replace(/(^[\s|,]*|[\s|,]*$)/g,'');
                if(opts.xs.length) {
                    showit = $(thebar).children(showunit);
                    showit.css('visibility','visible');
                }

                $(thebar).css('background-color','transparent');

                $(thebar).mouseout(function(){
                    $(thebar).children().css('visibility','hidden');
                    $(thebar).css('background-color','transparent');
                    showit.css('visibility','visible');
                });

                if(callback)callback.call(fix,showit,thebar);
            }
            else if(doc.dw>768&&doc.dw<992){
                //sm    
                // thebar.css('background-color','transparent');          
                showunit = (opts.xs+','+opts.sm).replace(/(^[\s|,]*|[\s|,]*$)/g,'');
                if(showunit.length){
                    showit = $(thebar).children(showunit);
                    showit.css('visibility','visible');
                }

                $(thebar).css('background-color','transparent');

                $(thebar).mouseout(function(){
                    $(thebar).children().css('visibility','hidden');
                    $(thebar).css('background-color','transparent');
                    showit.css('visibility','visible');
                });

                if(callback)callback.call(fix,showit,thebar);
            }
            else if(doc.dw>992&&doc.dw<1220){
                //md
                thebar.css('background-color','#333');    
                showunit = (opts.xs+','+opts.sm+','+opts.md).replace(/(^[\s|,]*|[\s|,]*$)/g,'');
                if(showunit.length){
                    showit = $(thebar).children(showunit);
                    showit.css('visibility','visible');
                }

                $(thebar).mouseout(function(){
                    thebar.css('background-color','#333');
                });

                if(callback)callback.call(fix,showit,thebar);
            }
            else if(doc.dw>1220){
                //lg                
                $(thebar).mouseout(function(){
                    thebar.css('background-color','#333');
                });

                showit = $(thebar).children();
                $(thebar).css('background-color','#333');
                showit.css('visibility','visible');
                if(callback)callback.call(fix,showit,thebar);
            }
        });          
        return this;
      }      
    };
    _measurePopPos=function(){      
      var doch = document.documentElement.clientHeight, docw = document.documentElement.clientWidth,
      docST = document.documentElement.scrollTop||document.body.scrollTop,
      docSL = document.documentElement.scrollLeft||document.body.scrollLeft;
      return {dw:docw,dh:doch,st:docST,sl:docSL};
    };    
    __getClass = function(object){
        return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
    };
    __getRect = function(element) {
      var offset = $(element).offset();
      offset.bottom = offset.top+$(element).height();
      offset.right = offset.left+$(element).width();
      offset.width = $(element).width();
      offset.height= $(element).height();
      return offset;
    };
    /* 2007-11-28 XuJian */  
    //截取字符串 包含中文处理  
    //(串,长度,增加...)  
    _subString = function(str, len, hasDot)  
    {  
        var newLength = 0;  
        var newStr = "";  
        var chineseRegex = /[^\x00-\xff]/g;  
        var singleChar = "";  
        var strLength = str.replace(chineseRegex,"**").length;  
        for(var i = 0;i < strLength;i++) {
            singleChar = str.charAt(i).toString();  
            if(singleChar.match(chineseRegex) != null) newLength += 2;
            else newLength++;

            if(newLength > len) break;
            newStr += singleChar;  
        }
        if(hasDot && strLength > len) newStr += "...";
        return newStr;
    }


    $.fn.vefixbar = function(position){
      return new vfixbar(this,position);
    };

    return $.fn.vefixbar;
});