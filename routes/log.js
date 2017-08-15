var express = require('express');
var router = express.Router();
var User = require('../models/user');

// Log List
router.get('/log', User.ensureAuthenticated, function (req, res) {
	res.render('log/log', {
		css: ['/css/qw/log.css'],
		js: [
			'/js/util/md5.min.js',
			'/js/util/param_util.js',
			'/js/qw/log.js'
		]
	});
});

// Log Detail
router.get('/log-detail', User.ensureAuthenticated, function (req, res) {
	res.render('log/log-detail', {
		css: ['/css/qw/log-detail.css'],
		js: [
			'/js/util/md5.min.js',
			'/js/util/param_util.js',
			'/js/qw/log-detail.js'
		]
	});
});

module.exports = router;
