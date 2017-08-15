var express = require('express');
var router = express.Router();

// Get Dashboard
router.get('/', ensureAuthenticated, function (req, res) {
	res.render('dashboard', {
		css: ['/css/qw-dashboard.css'],
		js: [
			'/js/md5.min.js',
			'/js/param_util.js',
			'/js/qw-dashboard.js'
		]
	});
});

// Get Chart
router.get('/chart', ensureAuthenticated, function (req, res) {
	res.render('chart');
});

// Log List
router.get('/log', ensureAuthenticated, function (req, res) {
	res.render('log', {
		css: ['/css/qw-log.css'],
		js: [
			'/js/md5.min.js',
			'/js/param_util.js',
			'/js/qw-log.js'
		]
	});
});

// Log Detail
router.get('/log-detail', ensureAuthenticated, function (req, res) {
	res.render('log-detail', {
		css: ['/css/qw-log-detail.css'],
		js: [
			'/js/md5.min.js',
			'/js/param_util.js',
			'/js/qw-log-detail.js'
		]
	});
});

// Alert SMS or Email
router.get('/alert', ensureAuthenticated, function (req, res) {
	res.render('alert', {
		css: ['/css/qw-log.css']
	});
});

// Manual Test
router.get('/test/manual', ensureAuthenticated, function (req, res) {
	res.render('manual_test', {
		css: [
			'/css/demo_style.css'
		]
	});
});

// Auto Test Configuration
router.get('/test/config', ensureAuthenticated, function (req, res) {
	res.render('auto_test_config');
});


// Auto Test
router.post('/test/auto', ensureAuthenticated, function (req, res) {
	var testcase = req.body.testcase

	var testcases = testcase.split("\r\n")

	res.render('auto_test', {
		css: [
			'/css/demo_style.css'
		],
		testcases: testcases
	});
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		// req.flash('error_msg', '您没有登录');
		res.redirect('/users/login')
	}
}

module.exports = router;
