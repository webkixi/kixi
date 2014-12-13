
/**
 * Module dependencies.
 */

var views = require('co-views');
var router = require('koa-router');
var parse = require('co-body');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var koa = require('koa');
var fJSON = require("fbbk-json");
var isjson = require("is-json");
var app = koa();

var fs = require('fs');
var fse = require('fs-extra');

var render = views('views',{
    map:{html:'swig'}
})

// "database"
var posts = [
 {id:1,title:'hello',content:'this just test'}
,{id:2,title:'good',content:'i can\'t say any more'}
,{id:3,title:'ni mei',content:'just your sister'}
];

// route middleware
// app.use(route.get('/', index));
app.use(router(app));

app
.get('/',index)
.post('/',test)

function * index(){
    this.body = yield render('index',{posts:posts});
}

var body
function * test(id){
    body = yield parse(this);
    console.log(isjson(fJSON.parse(body.id)));
}

/**
 * Create a post.
 */

// function *create() {
//   var post = yield parse(this);
//   var id = posts.push(post) - 1;
//   post.created_at = new Date;
//   post.id = id;
//   this.redirect('/');
// }

// listen

app.listen(3000);
console.log('listening on port 3000');