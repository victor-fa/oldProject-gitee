var express = require('express')
var router = express.Router()
var UserService = require('../services/user')

// Manual Test
router.get('/manual', function (req, res, next) {
	res.render('test/manual_test', {
		css: [
			'/css/qw/demo_style.css'
		]
	})
})

// Auto Test Configuration
router.get('/config', function (req, res, next) {
	res.render('test/auto_test_config')
});

// Auto Test
router.post('/auto', function (req, res, next) {
	var testcase_str = req.body.testcase.trim()

	UserService.updateTestcases(req.user.username, testcase_str, function() {
		var testcases = testcase_str.split("\r\n")

		res.render('test/auto_test', {
			css: [
				'/css/qw/demo_style.css'
			],
			testcases: testcases
		})
	})
})

module.exports = router
