var express = require('express');
var router = express.Router();
var UserService = require('../services/user')

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
	if (next) {
        next();
    }
});

// Get Chart
router.get('/chart', UserService.ensureAuthenticated, function (req, res, next) {
	res.render('dashboard/chart');
	if (next) {
        next();
    }
});

module.exports = router;
