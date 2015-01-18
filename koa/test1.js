var koa = require('koa');
var views = require('co-views');
var router = require('koa-router');
var parse = require('co-body');
var statics = require('koa-static-cache');
var qs = require('querystring');

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
.post('/',dealindex);


function *index(){	
    this.body = yield render('index',{posts:posts});
}

function *dealindex(){
	// try{
	// 	var body = yield parse.json(this);
	// 	console.log(body);
	// 	this.body = '{"good":"boy"}';
	// }
	// catch(err){
	// 	this.app.emit('error',err,this);
	// }
	var body;
	this.req.on('data',function(data){
		body+=data;
	});
	this.req.on('end',function(){
		// console.log(qs);
		console.log(parse.json(body));
		this.body= '{"good":"boy"}';
	});
}


app.on('error', function(err){
  console.log(err);
});

app.listen(80);
