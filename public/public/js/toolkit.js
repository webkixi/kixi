function CurrentStyle(element){
    return element.currentStyle || document.defaultView.getComputedStyle(element, null);
};   
function __getClass(object){
    return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
};
function __getRect(element) {
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
function _subString(str, len, hasDot) {  
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

function creatstyle(name,cb){
    var nstyle ;
    if(!$('#'+name).length){
        nstyle = $('<style type="text/css" id="'+name+'"></style>');            
        $('head').append(nstyle);
    }else{
        nstyle = $('#'+name);
    }
    cb && cb.call(this,nstyle);
}

function msg_box(show,msg,timeout){
    console.log('aaaaaaaaaaa');
    var msg_left, msg_top;
    var docRect = __measureDoc();
    var sl = docRect.sl;
    var st = docRect.st;
    var cw = docRect.dw;
    var ch = docRect.dh;
    var flymsg;

    timeout = timeout ? timeout : 17;

    // !$('.showmsg').length ? $("body").append("<div class='showmsg yuanjiao2 yinying2' style='z-index:10030;color:#fff;background-color:#4ba2f9;width:auto;padding:10px;text-align:center;position:fixed;font-size:16px;line-height:220%;'>请稍候。。。</div>") : '';
    // var msgitem = $("<div class='showmsg yuanjiao2 yinying2'>请稍候。。。</div>");
    // flymsg = msgitem;    
    $("body").append("<div class='showmsg' style='z-index:10030;color:#fff;background-color:#4ba2f9;width:auto;padding:10px;text-align:center;position:fixed;font-size:16px;line-height:220%;'>请稍候。。。</div>");
    flymsg = $('.showmsg');
    if(typeof(msg)=='undefined') msg = "请稍候。。。";
    // flymsg[0].style.opacity = 1;
    flymsg.html(msg);
    flymsg[0].style.cssText = 'z-index:10030;color:#fff;background-color:#4ba2f9;width:auto;padding:10px;text-align:center;position:fixed;font-size:16px;line-height:220%;';
    
    //position:absolute
    // msg_left = sl + Math.round((parseInt(cw)-$("#showmsg").width())/2);          
    // msg_top = st+Math.round((parseInt(ch)-50)/2);    
    //position:fixed            
    var msgct = __getRect(flymsg[0]);
    console.log(msgct);
    msg_left = Math.round((parseInt(cw)-msgct.width)/2);
    msg_top  = Math.round((parseInt(ch)-msgct.height)/2);
    flymsg.css({"left":msg_left,"top":msg_top,"opacity":1});
    // flymsg[0].style.left = msg_left+'px';
    // flymsg[0].style.top = msg_top+'px';
    // flymsg.show().animate({top:0},600).delay(1000).fadeOut('slow');
    flymsg.show().addClass('t6');

    // if(show == "show"){          
    //  setTimeout(function(){$('#showmsg').show().animate({top:0},400).delay(1000).fadeOut('slow')},timeout);
    // }
    // else if(show == "hide"){
    //  if(typeof(msg)=='undefined') msg = "拖放完成";
    //  $("#showmsg")[0].innerHTML = msg;
    //  setTimeout(function(){$('#showmsg').animate({top:0,opacity:'0'},200)},1000);
    // }else{           
    //  $("#showmsg")[0].style.opacity = 1;
    //  $("#showmsg")[0].innerHTML = show;
    //  setTimeout(function(){$('#showmsg').animate({top:0,opacity:'0'},200)},1500);
    // }    
}

function __measureDoc(){      
    var doch = document.documentElement.clientHeight, docw = document.documentElement.clientWidth,
    docST = document.documentElement.scrollTop||document.body.scrollTop,
    docSL = document.documentElement.scrollLeft||document.body.scrollLeft;
    return {dw:docw,dh:doch,st:docST,sl:docSL};
};