
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
	    		$('body').append("<span id='drawselect' title='右键编辑' style='z-index:1001;position:absolute;left:0;top:0;display:none;'></span>");	

	    	var gzmenu = '<div id="gzmenu"><ul>\
			<li class="remove">remove</li>\
			<li class="clone">clone</li>\
			<li>contextmenuitem 3</li></ul></div>';
			if(!$('#gzmenu').length) $('body').append(gzmenu);
			creatstyle('gzgzgz',function(gzgzgz){
				gzgzgz.text('#gzmenu{position:absolute;width:150px;background-color:#fff;display:none;border:1px solid #666;border-bottom-width:0;}\
							#gzmenu li{list-style:none;text-indent:1em;}\
							#gzmenu li {display:block;height:30px;line-height:30px;border-bottom:1px solid #666;text-decoration:none;color:#666;font:12px/30px tahoma;}\
							#gzmenu li:hover{background:#eee;color:black;} ');
			});			

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
	    		
	    		$(_pen)
	    			.on('mousedown',function(e){
	    				e = e||arguments[0];
	    				e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
	    			});
	    		
	    		$(document)
		    		.on('mousedown',function(e){
		    			e = e||arguments[0];
		    			if(e.target == thegz) {
			    			pendraw = true;		    			
			    			if(e.which == 1){		    				
								_pen.show();
								_pen.css({'left':e.pageX,'top':e.pageY,'width':0,'height':0});
								pos.startX = e.pageX;
								pos.startY = e.pageY;
							}
						}
						$('#gzmenu').hide();
		    		}).on('mousemove',function(e){
						e=e||arguments[0];
						if(e.which==1&&pendraw){
							if(e.pageX<thegzrect.left){
		    					msg_box('show','超出绘制区域，请在绘制区域操作!',1000);
		    					return false;
		    				}else
								_pen.css({'background-color':'red','width':e.pageX-parseInt(pos.startX),'height':e.pageY-parseInt(pos.startY)});
						}
					}).on('mouseup',function(e){
						e = e||arguments[0];
						pendraw = false;  //					

						if(_pen.width()>30&&_pen.height()>30){
							kkk = e.ctrlKey ? new preCreatSubDiv(_pen,thegz,'float') : new preCreatSubDiv(_pen,thegz);							
							subelement.push(kkk);
						}else if(_pen.width()>3&&_pen.height()>3)
							msg_box('show','最小30x30',1000);						
						pos = {};
					});					
	    	});
	        return this;
	    }
	}

	var preCreatSubDiv = function(item,container,type){
		var 
		_rect = __getRect(item),
		_crect = __getRect(container);
		var position;			
		(type=='float') ? position = 'float:left;' : position = 'position:absolute;';
		var idindex = subelement.length>0 ?  subelement.length : 0;
		var _rzunit = '<div class="_rzunit" style="cursor:nw-resize;width:7px;height:7px;background-color:red;position:absolute;bottom:-3px;right:-3px;font-size:0;">1</div>';
		$(container).append('<div idindex="'+idindex+'" class="wangwang" style="z-index:1000;left:'+(_rect.left-_crect.left)+'px;top:'+(_rect.top-_crect.top)+'px;background-color:green;width:'+_rect.width+'px;height:'+_rect.height+'px;'+position+'">'+_rzunit+'</div>');			
		var _unit = $('div[idindex='+idindex+']')[0];
		new _unitDiv(_unit,container);
	}


	var 
	_nrect,
	_rzrect, 
	_rzobj, 
	_rzaction=false,
	unitdrag = false,
	cloneunit = false,
	tt;

	var 
	_unitDiv = Class.create();
	_unitDiv.prototype = {
		// initialize: function(item,container,type) {			
		initialize: function(item,container) {			
			var theunit;
			var _unit;
			var pos={};
			var _rect = __getRect(item),
			_crect = __getRect(container);
			
			var that = this;
			that.div = _unit = item;
			that.container = container;
			
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
						var 
						clone = $('body').data('cloneunit');	
						clone.style.left = null;
						clone.style.top = null;
						$(clone)
						.css({'position':'absolute','background-color':'red','left':0,'top':0});
						 
						tt = e.target;						
						tt.appendChild(clone);
						$('body').data('cloneunit',null);
						new _unitDiv(clone,tt);
					}
				}
			});

			var opdiv;
			$(_unit).mousedown(function(e){	
				_rect = __getRect(item),
				_crect = __getRect(container);

				e = e||arguments[0];
				e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
				$(this).css('z-index',2000);
				unitdrag   = true;
				cloneunit  = false;
				_nrect     = __getRect(this);
				pos.startX = e.pageX;
				pos.startY = e.pageY;	

			}).contextmenu(function(e){				
				e = e||arguments[0];
				e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
				e.preventDefault();
				unitdrag = pendraw = false;				
				that.rightmenu(e);
				opdiv = this;
			});		

			$('#gzmenu ul li').mousedown(function(e){
				e=e||arguments[0];
				e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
				if(this.className.indexOf('remove')>-1){
					$(opdiv).remove();
				}
				if(this.className.indexOf('clone')>-1){
					$(container).append($(opdiv).clone(true));
					msg_box('show','clone ok',1000);
				}				
			});

			var endleft,endtop;
			$(container).mousemove(function(e){				
				e = e||arguments[0];				
				if(unitdrag&&e.ctrlKey){
					endleft = _nrect.left+(e.pageX-pos.startX)-_crect.left;
					endtop  = _nrect.top+(e.pageY-pos.startY)-_crect.top;
					endleft = endleft < 0 ? 0 : endleft+_nrect.width > _crect.right-_crect.left ? (_crect.right-_crect.left-_nrect.width) : endleft;
					endtop  = endtop  < 0 ? 0 : endtop+_nrect.height>_crect.bottom-_crect.top   ? (_crect.bottom-_crect.top-_nrect.height) : endtop;
					that.div.style.left = endleft+'px';
					that.div.style.top = endtop+'px';
				}
			});

			$(_unit).mouseup(function(e){
				e = e||arguments[0];
				e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
				_rzaction = false;   
				that.div.style.zIndex = 1000;
				if(unitdrag&&e.ctrlKey){					
					if(e.altKey) {
						cloneunit = true;				
						that.dataclone(e.target);
						$(e.target).remove();
					}
				}				
				unitdrag = false;
				pos={};
			});
			// console.log(e.relatedTarget);
		},	
		dataclone : function (item){	
			$('body').data('cloneunit',item);	
			return;
		},		
		rect:function(){
			return __getRect(this.div);
		},
		rightmenu:function(e){
			var rightmenu = $('#gzmenu');
			rightmenu.css({'display':'block','left':e.pageX-5+'px','top':e.pageY-5+'px','z-index':9999});			
		}
	}

	var creatstyle=function(name,callback){
    	var nstyle ;
    	if(!$('#'+name).length){
    		nstyle = $('<style type="text/css" id="'+name+'"></style>');	    	
    		$('head').append(nstyle);
    	}else{
    		nstyle = $('#'+name);
    	}
		if(callback) callback.call(this,nstyle);
	}

	var CurrentStyle = function(element){
	    return element.currentStyle || document.defaultView.getComputedStyle(element, null);
	};
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

 