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

function tanbox(msg,cb){
    var docRect = __measureDoc();
    var scrollleft = docRect.sl;
    var scrolltop = docRect.st;
    var clientwidth = docRect.dw;
    var clientheight = docRect.dh;

    var tan = new tipsbox();
    tan.tipsBox = function(){
        // var tip = document.createElement('div');        
        var msg_left = Math.round((parseInt(clientwidth)-500)/2);
        var msg_top = Math.round((parseInt(clientheight)-500)/2);
        var tanboxhtml = '<div id="msgtan" style="display:none;background-color:#fff;z-Index:10000;width:500px;height:500px;position:fixed;top:'+msg_top+'px;left:'+msg_left+'px;"></div>';
        $('#msgtan').length ? 
        (function(){
            $('#msgtan').remove();
            $('body').append(tanboxhtml);
        })()
        : $('body').append(tanboxhtml);
        return $('#msgtan')[0];
    };
    tan.tipsItem = function(){
        var subtip = document.createElement('div');
        subtip.id = 'tancontent'
        subtip.style.cssText = 'width:100%;height:100%;text-align:center;display:'        
        return subtip;
    };
    tan.anim = function(item,container){
        $(container).fadeIn(1000);
    };

    if(cb) tan.pop(msg,'',cb);
    else
        tan.pop(msg);
}

// function __measureDoc(){      
//     var doch = document.documentElement.clientHeight, docw = document.documentElement.clientWidth,
//     docST = document.documentElement.scrollTop||document.body.scrollTop,
//     docSL = document.documentElement.scrollLeft||document.body.scrollLeft;
//     return {dw:docw,dh:doch,st:docST,sl:docSL};
// };