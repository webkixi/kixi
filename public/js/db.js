//stack opration
function __put(unit){
	var obj = {
		'id'    : $(unit).attr('idindex'),
		'class' : unit.className,
		'css'   : (function(){  var ncss,css; ncss = (css = unit.style.cssText.toLowerCase()).lastIndexOf(';')<(css.length-1) ? css+';' : css; return ncss;})(),
		'unit'  : unit.outerHTML,
		'location': window.location.href
	};
	_wangs.put(obj.id,obj);
	idindex++;
	__pjajax({'url':'/add','data':obj},function(json,stat){
		if(stat=='error') return;
    });		
}

function __get(id){
	return _wangs.get(id);
}

function __edit(item){    	
	if(!item)return false;
	var opdiv = item;
	var nowrect = __getRect(opdiv.div);
	var obj = __get(opdiv.idindex);
	opdiv.div.style.width = nowrect.width;
	opdiv.div.style.height = nowrect.height;
	obj.css = opdiv.div.style.cssText.toLowerCase();
	obj.unit = opdiv.div.outerHTML;
	__pjajax({'url':'/edit','data':obj},function(json,stat){
		if(json.responseText!=='ok')
			alert('edit faile');
    });
}

function __move(item){    	
	if(!item)return false;
	var opdiv = item;
	var nowrect = opdiv.move;
	var obj = __get(opdiv.idindex);
	opdiv.div.style.left = nowrect.left;
	opdiv.div.style.top = nowrect.top;    	
	obj.css = opdiv.div.style.cssText.toLowerCase();
	obj.unit = opdiv.div.outerHTML;
	__pjajax({'url':'/move','data':obj},function(json,stat){
		if(json.responseText!=='ok') 
			alert('move faile');
    });
}

function __clone(id){
	var obj = __get(id);
	__pjajax({'url':'/remove','data':obj},function(json,stat){
		if(json.responseText!=='ok') return;
        $(opdiv.div).remove();
    	_wangs.remove(id);
    });
}

function __remove(id){
	var obj = __get(id);
	__pjajax({'url':'/remove','data':obj},function(json,stat){
		if(json.responseText!=='ok') return;
        $(opdiv.div).remove();
    	_wangs.remove(id);
    });
}

//post ajax
function __pjajax(obj,callback){
	var data = __obj2str(obj.data);
    $.ajax({
        url: obj.url,
        dataType: "json",
        data: data,
        type: "POST",
        success: function (ajaxobj) {
            if(callback)callback.call(this,ajaxobj,'success');
        },
        error: function (ajaxobj) {       
            if(callback)callback.call(this,ajaxobj,'error');
        }
    });        
}