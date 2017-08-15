var express = require('express');
var router = express.Router();
var User = require('../models/user');

// List All Users
router.get('/manage', User.ensureAuthenticated, function (req, res) {
	User.listAllUsers(function (err, users) {
		if (err) {
			throw err;
		}
		res.render('admin/manage', { 
			users,
			css: ['/css/qw/manage.css'],
			js: ['/js/qw/manage.js']
		});
	});
});

// Active or inactive user
router.post('/manage', User.ensureAuthenticated, function (req, res) {
	var id = req.body.id;
	var active = req.body.active;
	console.log(`_id = ${id} \n act = ${active}`);

	res.json({
		retcode: 0
	})
});

module.exports = router;
