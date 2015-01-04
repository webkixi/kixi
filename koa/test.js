var koa = require('koa');
var views = require('co-views');
var router = require('koa-router');
var parse = require('co-body');
var statics = require('koa-static-cache');
var url = require('url');

var env = require('jsdom').env;
var ssdb = require('ssdb');
var sc = ssdb.createClient();

var jq = require('jquery');
var $,jQuery;

// var fs = require('fs');
// var ws = fs.createWriteStream('message.txt');


var app = koa();
app.use(router(app));
app.use(statics('./public'));
var render = views('views',{
    map:{html:'swig'}
});

var posts = [
 {id:1,title:'hello',content:'this just test'}
,{id:2,title:'good',content:'i can\'t say any more'}
,{id:3,title:'ni mei',content:'just your sister'}
];


app
.get('/',index)
.get('/Index.js',index)
.post('/',dealindex)
.post('/add',add);

var __getClass = function(object){
    return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
};

function trim(s){
    return s.replace(/(^\s*)|(\s*$)/g, '').replace(/\s+/g,' ');
}

var hset = function(name,key,val){
	return function(fn){
		sc.hset(name,key,val,fn);
	}
}

var hget = function(name,key){
	return function(fn){
		sc.hget(name,key,fn);
	}
}


var tpl = function(tpl,data){	
	return function(fn){
		var tmp = tpl.split(/[=]{5,}/);
		var doc = tmp[0];
		var head = [];
		var jqstr = trim(tmp[1].replace(/<[\/|\s]?(script)>/g,''));
		var browseconsoles = tmp[1].match(/bc\((.*?)\)[\;]?[\s]?/g);
		var browseJs = tmp[1].match(/bjs\((.*?)\)[\;]?[\s]?/g);
		jqstr = jqstr.replace(/bc\((.*?)\)[\;]?[\s]?/g,'');
		jqstr = jqstr.replace(/bjs\((.*?)\)[\;]?[\s]?/g,'');


		env(doc,function(err,window){
			$ = jQuery = jq(window);
			
			function bc(){				
				if(browseconsoles&&browseconsoles.length>0){
					head.push('<script type="text/javascript">');
					var b = browseconsoles;
					for(var i=0; i<b.length; i++){
						var para = b[i].match(/\((.*)\)/);
						if(para[0].indexOf("('")>-1){
							head.push('console.log('+para[1]+');');
						}else{
							var tmppara = eval(para[1]);
							if(__getClass(tmppara)=='Array'){
								$.each(tmppara,function(j,v){
									tmppara[j]=JSON.stringify(v);
								});
								head.push("var tmpdata=["+tmppara.toString()+"];\nconsole.log(tmpdata);");
							}
							if(__getClass(tmppara)=='Object'){
								tmppara = JSON.stringify(tmppara);
								head.push("console.log("+tmppara+");");
							}							
						}
					}					
				}				
			}
			function bjs(){
				var bjs = browseJs;
				if(bjs&&bjs.length>0){
					for(var i=0; i<bjs.length; i++){
						var para = bjs[i].match(/\((.*)\)/);
						if(para[0].indexOf("('")>-1){
							if(para[1].indexOf('\'\+')>-1){
								var pos = para[1].indexOf('\'+')
								,leftend = para[1].substring(1,pos)
								,rightend = eval(para[1].substring(pos+2));
								para[1] = leftend+rightend+';';
							}							
							head.push(para[1]);
						}else{	
							throw new Error('bjs function parameter must be String');
						}
					}
				}
			}
			eval(jqstr);
			bc();
			bjs();
			doc = $('html').html();
			head.push('</script>');
			if(browseconsoles&&browseconsoles.length>0)doc = doc.replace('</head>',head.join('\n')+'\n</head>');
			fn(null,doc);
		});
	}
}

function *index(){		
	var theme = 'index';
	var attr = [];
	var data = [];
	var size=0;
	var exist = yield function(fn){sc.hexists(theme,'attr',fn);};
	console.log(exist);
	if(exist){
		attr.push(yield hget(theme,'attr'));
		size = yield function(fn){sc.hsize(theme+'_data',fn);};
		for(var i=0; i<size; i++){
			data.push(JSON.parse(yield hget(theme+'_data','id'+i)));
		}
		var tmp = yield render('index');	
		var kkk = yield tpl(tmp,data);
		this.body = kkk;
	}else
	    this.body = yield render('index',{posts:posts});	
}

function *dealindex(){
	var page = yield function(kkk){client.hexists('kixi','index',kkk)};	
	var body = yield parse.json(this);
	console.log(body);
}

/**
 * [*add description]
 * @Schema  hset('index','attr',val) hset('index_data','0',val)
 */
function *add(){	
	var 
	body = yield parse.json(this),
	path = url.parse(body.location).pathname.replace('/','').replace(/(\.[\w]+)/,'').toLowerCase(),
	id   = 'id'+body.id;
	body = JSON.stringify(body);
	path = path==''?'index':path;		

	var exist = yield function(fn){sc.hexists(path,'attr',fn);};
	if(exist){
		yield hset(path+'_data',id,body);
	}else{
		yield hset(path,'attr',JSON.stringify({'user':'xxx','passwd':'123456'}));
		yield hset(path+'_data',id,body);
	}
	this.body = 'ok';
}


app.on('error', function(err){
  console.log(err);
});

app.listen(80);
