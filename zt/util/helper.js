var helper = function(hbs) {
	var fs = require('fs');
	var path = require('path');
	var when = require('when');
	console.log(when);
	var tplPath = path.join(__dirname, '../views/templates')
	console.log(tplPath)
	//link
	hbs.registerHelper('link', function(text, link) {
		return "<a href='" + link + "'>" + text + "</a>"
	});
	//getFileContent
	hbs.registerHelper('getTplTpl', function(text, link) {
		return "<a href='" + link + "'>" + text + "</a>"
	});
	hbs.registerHelper('getTplHtml', function(tplName, tag) {
		var str = '';
		var tp = path.join(tplPath, './' + tplName + '.tpl');
		console.log(tp);
		var callBack = function(html) {
			var tplstr = html.toString();
			console.log(tplstr)
			return tplstr;
		}
		return callBack(fs.readFileSync(tp));
	});
	hbs.registerHelper('getTplCss', function(text, link) {
		return "<a href='" + link + "'>" + text + "</a>"
	});
	hbs.registerHelper('getTplJs', function(text, link) {
		return "<a href='" + link + "'>" + text + "</a>"
	});
}
module.exports = helper;