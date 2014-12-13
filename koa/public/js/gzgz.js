
//md5
!function(n){"use strict";function t(n,t){var r=(65535&n)+(65535&t),e=(n>>16)+(t>>16)+(r>>16);return e<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,u,o,c,f){return t(r(t(t(e,n),t(o,f)),c),u)}function u(n,t,r,u,o,c,f){return e(t&r|~t&u,n,t,o,c,f)}function o(n,t,r,u,o,c,f){return e(t&u|r&~u,n,t,o,c,f)}function c(n,t,r,u,o,c,f){return e(t^r^u,n,t,o,c,f)}function f(n,t,r,u,o,c,f){return e(r^(t|~u),n,t,o,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[(r+64>>>9<<4)+14]=r;var e,i,a,h,d,g=1732584193,l=-271733879,v=-1732584194,C=271733878;for(e=0;e<n.length;e+=16)i=g,a=l,h=v,d=C,g=u(g,l,v,C,n[e],7,-680876936),C=u(C,g,l,v,n[e+1],12,-389564586),v=u(v,C,g,l,n[e+2],17,606105819),l=u(l,v,C,g,n[e+3],22,-1044525330),g=u(g,l,v,C,n[e+4],7,-176418897),C=u(C,g,l,v,n[e+5],12,1200080426),v=u(v,C,g,l,n[e+6],17,-1473231341),l=u(l,v,C,g,n[e+7],22,-45705983),g=u(g,l,v,C,n[e+8],7,1770035416),C=u(C,g,l,v,n[e+9],12,-1958414417),v=u(v,C,g,l,n[e+10],17,-42063),l=u(l,v,C,g,n[e+11],22,-1990404162),g=u(g,l,v,C,n[e+12],7,1804603682),C=u(C,g,l,v,n[e+13],12,-40341101),v=u(v,C,g,l,n[e+14],17,-1502002290),l=u(l,v,C,g,n[e+15],22,1236535329),g=o(g,l,v,C,n[e+1],5,-165796510),C=o(C,g,l,v,n[e+6],9,-1069501632),v=o(v,C,g,l,n[e+11],14,643717713),l=o(l,v,C,g,n[e],20,-373897302),g=o(g,l,v,C,n[e+5],5,-701558691),C=o(C,g,l,v,n[e+10],9,38016083),v=o(v,C,g,l,n[e+15],14,-660478335),l=o(l,v,C,g,n[e+4],20,-405537848),g=o(g,l,v,C,n[e+9],5,568446438),C=o(C,g,l,v,n[e+14],9,-1019803690),v=o(v,C,g,l,n[e+3],14,-187363961),l=o(l,v,C,g,n[e+8],20,1163531501),g=o(g,l,v,C,n[e+13],5,-1444681467),C=o(C,g,l,v,n[e+2],9,-51403784),v=o(v,C,g,l,n[e+7],14,1735328473),l=o(l,v,C,g,n[e+12],20,-1926607734),g=c(g,l,v,C,n[e+5],4,-378558),C=c(C,g,l,v,n[e+8],11,-2022574463),v=c(v,C,g,l,n[e+11],16,1839030562),l=c(l,v,C,g,n[e+14],23,-35309556),g=c(g,l,v,C,n[e+1],4,-1530992060),C=c(C,g,l,v,n[e+4],11,1272893353),v=c(v,C,g,l,n[e+7],16,-155497632),l=c(l,v,C,g,n[e+10],23,-1094730640),g=c(g,l,v,C,n[e+13],4,681279174),C=c(C,g,l,v,n[e],11,-358537222),v=c(v,C,g,l,n[e+3],16,-722521979),l=c(l,v,C,g,n[e+6],23,76029189),g=c(g,l,v,C,n[e+9],4,-640364487),C=c(C,g,l,v,n[e+12],11,-421815835),v=c(v,C,g,l,n[e+15],16,530742520),l=c(l,v,C,g,n[e+2],23,-995338651),g=f(g,l,v,C,n[e],6,-198630844),C=f(C,g,l,v,n[e+7],10,1126891415),v=f(v,C,g,l,n[e+14],15,-1416354905),l=f(l,v,C,g,n[e+5],21,-57434055),g=f(g,l,v,C,n[e+12],6,1700485571),C=f(C,g,l,v,n[e+3],10,-1894986606),v=f(v,C,g,l,n[e+10],15,-1051523),l=f(l,v,C,g,n[e+1],21,-2054922799),g=f(g,l,v,C,n[e+8],6,1873313359),C=f(C,g,l,v,n[e+15],10,-30611744),v=f(v,C,g,l,n[e+6],15,-1560198380),l=f(l,v,C,g,n[e+13],21,1309151649),g=f(g,l,v,C,n[e+4],6,-145523070),C=f(C,g,l,v,n[e+11],10,-1120210379),v=f(v,C,g,l,n[e+2],15,718787259),l=f(l,v,C,g,n[e+9],21,-343485551),g=t(g,i),l=t(l,a),v=t(v,h),C=t(C,d);return[g,l,v,C]}function a(n){var t,r="";for(t=0;t<32*n.length;t+=8)r+=String.fromCharCode(255&n[t>>5]>>>t%32);return r}function h(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;for(t=0;t<8*n.length;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function d(n){return a(i(h(n),8*n.length))}function g(n,t){var r,e,u=h(n),o=[],c=[];for(o[15]=c[15]=void 0,u.length>16&&(u=i(u,8*n.length)),r=0;16>r;r+=1)o[r]=909522486^u[r],c[r]=1549556828^u[r];return e=i(o.concat(h(t)),512+8*t.length),a(i(c.concat(e),640))}function l(n){var t,r,e="0123456789abcdef",u="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),u+=e.charAt(15&t>>>4)+e.charAt(15&t);return u}function v(n){return unescape(encodeURIComponent(n))}function C(n){return d(v(n))}function m(n){return l(C(n))}function s(n,t){return g(v(n),v(t))}function A(n,t){return l(s(n,t))}function p(n,t,r){return t?r?s(t,n):A(t,n):r?C(n):m(n)}"function"==typeof define&&define.amd?define(function(){return p}):n.md5=p}(window);

(function(){	

	var Class = {create: function() {  return function() {this.initialize.apply(this, arguments);} } }
	var pendraw = false;
	var idindex = 0;

	var _wangs = new HashMap();
	
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
							#gzmenu ul{}\
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
						_pen.html('');
		    		}).on('mousemove',function(e){
						e=e||arguments[0];
						if(e.which==1&&pendraw){
							if(e.pageX<thegzrect.left){
		    					msg_box('show','超出绘制区域，请在绘制区域操作!',1000);
		    					return false;
		    				}else{
								_pen.css({'background-color':'red','width':e.pageX-parseInt(pos.startX),'height':e.pageY-parseInt(pos.startY)});
								_pen.html('<div style="position:absolute;top:48%;left:41%;">agzgz.com</div>');
		    				}
						}						
					}).on('mouseup',function(e){
						e = e||arguments[0];
						pendraw = false;  //					

						if(_pen.width()>30&&_pen.height()>30){
							kkk = e.ctrlKey ? new preCreatSubDiv(_pen,thegz,'float') : new preCreatSubDiv(_pen,thegz);
						}else if(_pen.width()>3&&_pen.height()>3)
							msg_box('show','最小30x30',1000);						
						pos = {};
					});	

				// $('#gzmenu ul li').on('mousedown',function(){
				$('#gzmenu ul li').on('mousedown',function(e){
					e=e||arguments[0];
					e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
					
					if(this.className.indexOf('remove')>-1){
						$(opdiv.div).remove();
						__remove(opdiv.idindex);
					}
					if(this.className.indexOf('clone')>-1){
						var clone = opdiv.div.cloneNode(true);
						$(clone).attr('idindex',idindex);
						$(opdiv.container).append(clone);
						new _unitDiv(clone,opdiv.container);
						__put(clone);						
						msg_box('show','clone ok',1000);
					}				
				});				
	    	});
	        return this;
	    }
	}

	var preCreatSubDiv = function(item,container,type){
		var 
		rect = __getRect(item),
		crect = __getRect(container);		
		var position;			
		(type=='float') ? position = 'float:left;' : position = 'position:absolute;';
		var rzunit = '<div class="rzunit" style="cursor:nw-resize;width:7px;height:7px;background-color:red;position:absolute;bottom:-3px;right:-3px;font-size:0;">1</div>';
		$(container).append('<div idindex="'+idindex+'" class="wangwang" style="z-index:1000;left:'+(rect.left-crect.left)+'px;top:'+(rect.top-crect.top)+'px;background-color:green;width:'+rect.width+'px;height:'+rect.height+'px;'+position+'">'+rzunit+'</div>');		
		var _unit = $('div[idindex='+idindex+']')[0];
		__put(_unit);
		new _unitDiv(_unit,container);
		// console.log(_wangs.size());
	}	


	var 
	_nrect,
	_rzrect, 
	_rzobj, 
	_rzaction=false,
	unitdrag = false,
	cloneunit = false,
	tt,
	opdiv;  //use for clone, remove

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
			that.idindex = $(item).attr('idindex');			
			that.type = 'absolute';
			that.div = _unit = item;
			that.container = container;
			
			$(_unit).children('.rzunit').mousedown(function(e){
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
						.css({'position':'absolute','background-color':'red','left':0,'top':0})
						.attr('idindex',idindex);						 
						tt = e.target;						
						tt.appendChild(clone);
						$('body').data('cloneunit',null);
						new _unitDiv(clone,tt);
						__put(_unit);						
					}
				}
			});

			
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
				opdiv = that;
			});		

			

			var endleft,endtop;
			$(container).mousemove(function(e){				
				e = e||arguments[0];				
				if(that.type==='absolute'&&unitdrag&&e.ctrlKey){
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
						var ounit = e.target;						
						cloneunit = true;				
						that.dataclone(ounit);						
					}
				}				
				unitdrag = false;
				pos={};
			});
			// console.log(e.relatedTarget);
		},	
		dataclone : function (item){
			var key = $(item).attr('idindex');
			$(item).remove();
			__remove(key);
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

    //stack opration
    var __put = function(unit){
    	var obj = {
    		'id'    : $(unit).attr('idindex'),
    		'unit'  : unit.outerHTML,
    		'class' : unit.className,
    		'css'   : (function(){  var ncss,css; ncss = (css = unit.style.cssText.toLowerCase()).lastIndexOf(';')<(css.length-1) ? css+';' : css; return ncss;})()    		
    	};
    	_wangs.put(idindex,obj);
    	idindex++;
    	__pjajax({'url':'/','data':obj},function(json){
            console.log(json);
        });		
    }
    var __get = function(id){
    	return _wangs.put(id);
    }
    var __remove =function(id){
    	_wangs.remove(id);
    }
    /* 2007-11-28 XuJian */  
    //截取字符串 包含中文处理  
    //(串,长度,增加...)  
    var _subString = function(str, len, hasDot) {  
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

    //post ajax
    var __pjajax = function(obj,callback){
    	var data = __obj2str(obj.data);
        $.ajax({
            url: obj.url,
            dataType: "json",
            data: data,
            // data: {'aaa':'bbb'},
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
    }


    function HashMap() {  
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
            return entry[nkey];
        };            
        this.remove = function (key) {  
        	var nkey = md5(key);
            if (size == 0)  
                return;  
            delete entry[nkey];  
            size--;  
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
        
    } 

	$.fn.gzgz = function(){
      	return new gzgz(this);
    };

})(jQuery);





$(function(){
	$('.gzgz').gzgz();
	
	// $(window).bind('beforeunload',function(){ return 'ggggggggggg';});
});

 