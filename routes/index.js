var express = require('express');
var router = express.Router();
var User = require('../models/user');

// Get Dashboard
router.get('/', User.ensureAuthenticated, function (req, res) {
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
router.get('/chart', User.ensureAuthenticated, function (req, res) {
	res.render('dashboard/chart');
});

module.exports = router;
