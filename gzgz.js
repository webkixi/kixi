
// $(function(){
// 	var 
// 	_gzs = [],
// 	_body = $('body'),
// 	_gzgz = {},
// 	_pen;
// 	_body.append("<span id='drawselect' title='右键编辑' style='position:absolute;left:0;top:0;display:none;'></span>");	

// 	$('.gzgz').each(function(_i,_gz){
// 		_gzs.push(this);
// 		_pen = $('#drawselect');
// 		_gzgz.offset = $(this).offset();
// 		_gzgz.offset.width = $(this).width();
// 		_gzgz.offset.height = $(this).height();
// 		_gzgz.offset.right = _gzgz.offset.left + _gzgz.offset.width;
// 		_gzgz.offset.bottom = _gzgz.offset.top + _gzgz.offset.height

// 		var pos = {};
// 		$(this)
		// .on('mousedown',function(e){
		// 	e = e||arguments[0];
		// 	if(e.which == 1){				
		// 		_pen.show();
		// 		_pen.css({'left':e.pageX-_gzgz.offset.left,'top':e.pageY+_gzgz.offset.top,'width':0,'height':0});
		// 		pos.startX = e.pageX;
		// 		pos.startY = e.pageY;
		// 	}
		// }).on('mousemove',function(e){
		// 	e=e||arguments[0];
		// 	if(e.which==1)		
		// 		_pen.css({'background-color':'red','width':e.pageX-pos.startX,'height':e.pageY-pos.startY});			
		// }).on('mouseup',function(e){
			
		// })
// 	});
// });

(function(){	

	var Class = {create: function() {  return function() {this.initialize.apply(this, arguments);} } }
	var pendraw = false;
	var subelement = [];
	
    var gzgz = Class.create(); 
    gzgz.prototype = {
	    initialize: function(item) {
	    	this._body = $('body');
	    	if(!$('#drawselect').length)
	    		this._body.append("<span id='drawselect' title='右键编辑' style='z-index:1001;position:absolute;left:0;top:0;display:none;'></span>");	

	    	this._gzs = [];
	    	this._pen = $('#drawselect');
	    	var 
	    	_pen = this._pen,
	    	_body = this._body;
	    	this.length = item.length;	    	
	    	
	    	for(var i=0;i<item.length;i++)
	    		{ item[i].setAttribute('gzindex',i); this._gzs.push(item[i]); }

	    	$(item).each(function(){
	    		var thegz = this;
	    		var thegzrect = __getRect(this);
	    		var pos = {};	    		

	    		$(_body)
	    			.on('mouseup',function(){
	    				pendraw = false;	
	    				_rzaction = false;    				
	    			});
	    		$(_pen)
	    			.on('mousedown',function(e){
	    				e = e||arguments[0];
	    				e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
	    			});
	    		
	    		$(document)
		    		.on('mousedown',function(e){
		    			e = e||arguments[0];
		    			pendraw = true;		    			
		    			if(e.which == 1){		    				
							_pen.show();
							_pen.css({'left':e.pageX,'top':e.pageY,'width':0,'height':0});
							pos.startX = e.pageX;
							pos.startY = e.pageY;
						}
		    		}).on('mousemove',function(e){
						e=e||arguments[0];
						if(e.which==1&&pendraw){
							if(e.pageX<thegzrect.left){
		    					msg_box('show','超出绘制区域，请在绘制区域操作!',1000);
		    					return false;
		    				}else
								_pen.css({'background-color':'red','width':e.pageX-parseInt(pos.startX),'height':e.pageY-parseInt(pos.startY)});
						}
						// console.log(e.pageX);
					}).on('mouseup',function(e){
						e = e||arguments[0];
						if(_pen.width()>30&&_pen.height()>30){
							kkk = e.ctrlKey ? new _unitDiv(_pen,thegz,'float') : new _unitDiv(_pen,thegz);							
							subelement.push(kkk);
						}else if(_pen.width()>3&&_pen.height()>3)
							msg_box('show','最小30x30',1000);						
						pos = {};
					});

					// $('.wangwang .wangwang').attr('draggable',true);
					// $('.wangwang .wangwang').each(function(i){
					// 	console.log(i);
					// });
					
	    	});
	        return this;
	    }
	}
	var _nrect;
	var _rzrect, _rzobj, _rzaction=false;
	var unitdrag = false;
	var _unitDiv=Class.create();
	var cloneunit = false;
	_unitDiv.prototype={
		initialize: function(item,container,type) {			
			var theunit;	
			var _the = this;
			var pos={};
			var _rect = __getRect(item),
			_crect = __getRect(container);
			
			var position;			
			// position = 'position:absolute;';
			(type=='float') ? position = 'float:left;' : position = 'position:absolute;';
			var idindex = subelement.length>0 ?  subelement.length : 0;
			var _unit = $('<div idindex="'+idindex+'" class="wangwang" style="z-index:1000;left:'+(_rect.left-_crect.left)+'px;top:'+(_rect.top-_crect.top)+'px;background-color:green;width:'+_rect.width+'px;height:'+_rect.height+'px;'+position+'"></div>');			
			$(_unit).append('<div class="_rzunit" style="cursor:nw-resize;width:7px;height:7px;background-color:red;position:absolute;bottom:-3px;right:-3px;font-size:0;">1</div>');
			this.div = _unit[0];
			$(container).append(_unit);
			
			$(_unit).children('._rzunit').mousedown(function(e){
				e = e||arguments[0];
				e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
				_rzaction=true;
				_rzrect = __getRect(this.parentNode);
				_rzobj = this.parentNode;
			});
			$(document).mousemove(function(e){
				e = e||arguments[0];
				if(e.which==1&&_rzaction===true){
					$(_rzobj).css({'width':e.pageX-_rzrect.left,'height':e.pageY-_rzrect.top});
				}
			});
			
			$(_unit).mouseover(function(e){		
				e = e||arguments[0];
				if(cloneunit) {
					if($('body').data('cloneunit')){
						cloneunit=false;
						var clone = $('body').data('cloneunit');
						$('body').data('cloneunit',null);
						clone.style.left = null;
						clone.style.top = null;
						$(clone).css({'position':'relative','background-color':'red','float':'left'});
						var tt = e.target;						
						$(tt).append(clone);
					}
				}
			});
			$(_unit).mousedown(function(e){
				e = e||arguments[0];
				e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
				$(_unit).css('z-index',2000);			
				// theunit = this;
				// pendraw = false;
				unitdrag = true;
				cloneunit = false;
				_nrect = __getRect(this);
				pos.startX = e.pageX;
				pos.startY = e.pageY;				
			}).contextmenu(function(e){
				e = e||arguments[0];
				e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
				unitdrag = pendraw = false;			
				console.log('contextmenu');
			});		

			var endleft,endtop;
			$(container).mousemove(function(e){				
				e = e||arguments[0];				
				if(unitdrag&&e.ctrlKey){					
					endleft = _nrect.left+(e.pageX-pos.startX)-_crect.left;					
					endtop = _nrect.top+(e.pageY-pos.startY)-_crect.top;					
					$(_unit).css({'left':endleft,'top':endtop});
				}
			}).mouseup(function(e){
				e = e||arguments[0];
				var ttt;
				if(e.target.className.toString().indexOf('wangwang')>-1){
					e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
				}
				$(_unit).css('z-index',1000)
				if(e.ctrlKey&&e.altKey) {					
					cloneunit = true;					
					dataclone(e.target);
					$(e.target).remove();
				}

				function dataclone(item){
					$('body').data('cloneunit',item)					
				}
				unitdrag = false;
				pos={};
			});
		},
		rect:function(){
			return __getRect(this.div);
		}
	}


	var _measurePopPos=function(){      
      var doch = document.documentElement.clientHeight, docw = document.documentElement.clientWidth,
      docST = document.documentElement.scrollTop||document.body.scrollTop,
      docSL = document.documentElement.scrollLeft||document.body.scrollLeft;
      return {dw:docw,dh:doch,st:docST,sl:docSL};
    };    
    var __getClass = function(object){
        return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
    };
    var __getRect = function(element) {
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
    var _subString = function(str, len, hasDot)  
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




	$.fn.gzgz = function(){
      return new gzgz(this);
    };  
})(jQuery);

$(function(){
	$('.gzgz').gzgz();
});