var express = require('express')
var router = express.Router()
var User = require('../models/user')

// Manual Test
router.get('/manual', User.ensureAuthenticated, function (req, res) {
	res.render('test/manual_test', {
		css: [
			'/css/demo_style.css'
		]
	})
})

// Auto Test Configuration
router.get('/config', User.ensureAuthenticated, function (req, res) {
	res.render('test/auto_test_config')
});

// Auto Test
router.post('/auto', User.ensureAuthenticated, function (req, res) {
	var testcase_str = req.body.testcase

	User.updateTestcases(req.user.username, testcase_str, function() {
		var testcases = testcase_str.split("\r\n")

		res.render('test/auto_test', {
			css: [
				'/css/demo_style.css'
			],
			testcases: testcases
		})
	})
	
})

module.exports = router
