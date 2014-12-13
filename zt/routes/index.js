var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	var title="唯一优品 - 国内专业的母婴用品特卖平台_知名品牌婴儿用品【玩具,包包,书籍,辅食】特价专卖网站";
	res.output['title']=title;
	res.render('index.html',res.output) ;	
});
router.get('/helper-test', function(req, res) {
	var title="唯一优品 - 国内专业的母婴用品特卖平台_知名品牌婴儿用品【玩具,包包,书籍,辅食】特价专卖网站";
	res.output['title']=title;
	res.render('util/helper-test.html',res.output) ;	
});
router.get('/test', function(req, res) {
	var title="唯一优品 - 国内专业的母婴用品特卖平台_知名品牌婴儿用品【玩具,包包,书籍,辅食】特价专卖网站";
	res.output['title']=title;
	res.render('test.html',res.output);
});
module.exports = router;
