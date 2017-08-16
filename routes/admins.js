var express = require('express');
var router = express.Router();
var User = require('../models/user');

// Manage
router.get('/manage', User.ensureAuthenticated, function (req, res) {
	User.listAllUsers(function (err, users) {
		if (err) {
			throw err;
		}
		res.render('admin/manage', {
			users,
			css: ['/css/qw/manage.css'],
			js: [
				'/js/qw/manage.js'
			]
		});
	});
});

// API: list all users
router.post('/manage/api/load', User.ensureAuthenticated, function (req, res) {
	User.listAllUsers(function (err, users) {
		if (err) {
			throw err;
		}
		res.json(users);
	});
});

// API: active or inactive user
router.post('/manage/api/active', User.ensureAuthenticated, function (req, res) {
	var id = req.body.id;
	var active = req.body.active;
	console.log(`_id = ${id} \n act = ${active}`);
	User.updateUserActive(id, active, function (err) {
		if (err) {
			throw err;
			// err alert
			/* ... */

			// send err res
			res.json({
				retcode: 1,
				msg: err
			})
		}
		res.json({
			retcode: 0
		})
	});
});

module.exports = router;
