var express = require('express');
var router = express.Router();

// Get Dashboard
// router.get('/', ensureAuthenticated, function(req, res) {
// 	res.render('index');
// });

// Get Dashboard
router.get('/', function(req, res) {
	res.render('dashboard');
});

// Get Chart
router.get('/chart', function(req, res) {
	res.render('chart');
});

// Get Log
router.get('/log', function(req, res) {
	res.render('log');
});

// Get Alert
router.get('/alert', function(req, res) {
	res.render('alert');
});

// Get Account
router.get('/', function(req, res) {
	res.render('account');
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		// req.flash('error_msg', 'You are not logged in');
		res.redirect('/users/login')
	}
}

module.exports = router;