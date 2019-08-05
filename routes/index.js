var express = require('express');
var router = express.Router();
var UserService = require('../services/user')
var config = require('config');

router.get('/endpoint.js', (req, res)=>{
	res.send(`var bot_endpoint = '${config.deploy_domain_name}/api/chat';`);
});

router.get('/test', (req, res)=>{
	if (typeof req.query.appkey == 'undefined' || typeof req.query.appkey == 'undefined' || typeof req.query.appsecret == 'undefined') {
		res.send("missing appkey or appsecret or name!");
		return;
	}
	res.render('test/public_test', {
		css: [
			'/css/qw/demo_style.css'
		],
		appkey: req.query.appkey,
		appsecret: req.query.appsecret,
		name: req.query.name,
	})
});


// Get Dashboard
router.get('/', UserService.ensureAuthenticated, function (req, res, next) {
	res.render('dashboard/dashboard', {
		css: ['/css/qw/dashboard.css'],
		js: [
			'/js/util/md5.min.js',
			'/js/util/param_util.js',
			'/js/qw/dashboard.js'
		]
	});
});

// Get Chart
router.get('/chart', UserService.ensureAuthenticated, function (req, res, next) {
	res.render('dashboard/chart');
});

// Get Table
// router.get('/table',UserService.ensureAuthenticated, function(req,res,next){
// 	res.render('dashboard/table',{
// 		css:[
// 			'/css/util/bootstrap4.css',
// 			'/css/util/mdb.min.css',
// 		],
// 		js:[
// 			'/js/util/jquery-3.2.1.min.js',
// 			'/js/util/popper.min.js',
// 			'/js/util/bootstrap4.min.js',
// 			'/js/util/mdb.min.js',
// 			'/js/qw/table.js'
// 		]

// 	})
// })

router.get('/table',UserService.ensureAuthenticated, function(req,res,next){
	res.redirect("http://analytics.chewrobot.com");
	//res.render('dashboard/table')
});
module.exports = router;
