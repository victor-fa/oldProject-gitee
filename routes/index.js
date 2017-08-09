var express = require('express');
var router = express.Router();

// Get Dashboard
router.get('/', ensureAuthenticated, function(req, res) {
	res.render('dashboard', { css: ['qw-dashboard.css'] });
});

// Get Chart
router.get('/chart', ensureAuthenticated, function(req, res) {
	res.render('chart');
});

// Get Log
router.get('/log', ensureAuthenticated, function(req, res) {
	res.render('log', { css: ['qw-log.css'], js: ['qw-log.js']});
});

// Get Log
router.get('/log-detail', ensureAuthenticated, function(req, res) {
	res.render('log-detail', { css: ['qw-log-detail.css'], js: ['qw-log-detail.js']});
});

// Get Alert
router.get('/alert', ensureAuthenticated, function(req, res) {
	res.render('alert', { css: ['qw-log.css']});
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
