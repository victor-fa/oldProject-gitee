var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var RouterIndex = require('./index');

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// Register
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var phone = req.body.phone;
	var company = req.body.company;
	var group = 'user';

	// Validation
	req.checkBody('name', '真实姓名不能为空').notEmpty();
	req.checkBody('email', '电子邮件不能为空').notEmpty();
	req.checkBody('email', '不是有效的电子邮件地址').isEmail();
	req.checkBody('username', '用户名不能为空').notEmpty();
	req.checkBody('password', '密码不能为空').notEmpty();
	req.checkBody('password2', '密码两次输入不一致').equals(req.body.password);
	req.checkBody('phone', '手机号不能为空').notEmpty();
	req.checkBody('phone', '不是有效的手机号').len(11, 11).isInt();
	req.checkBody('company', '公司名不能为空').notEmpty();

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			res.render('register', {
				errors: result.array()
			});
		} else {
			console.log('PASSED');
			var newUser = new User({
				username: username,
				name: name,
				email: email,
				password: password,
				phone: phone,
				company: company,
				group: group,
				appkey: 'qiwurobot',
				appsecret: 'og9pHwRvVAGT2iltk9K934RUgTNE',
				alertSms: 100,
				alertEmail: 100,
				wechat_openid: ''
			});

			User.createUser(newUser, function (err, user) {
				if (err) throw err;
				console.log(user);
			});

			req.flash('success_msg', '注册成功，请登录');

			res.redirect('/users/login');
		}
	});
});

// Account
router.get('/account', ensureAuthenticated, function (req, res) {
	res.render('account');
});

// Account change info
router.post('/account', ensureAuthenticated, function (req, res) {
	var name = req.body.name;
	var compnay = req.body.company;
	var phone = req.body.phone;
	var email = req.body.email;

	// Validation
	req.checkBody('name', '真实姓名不能为空').notEmpty();

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			res.render('/account', {
				errors: result.array()
			});
		} else {
			console.log('UPDATE');

			User.updateUserInfo(user.username, name, function (err, user) {
				if (err) throw err;
				console.log(user.name);
			});

			req.flash('success_msg', '注册成功，请登录');

			res.redirect('/users/login');
		}
	});

	res.render('account');
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: '用户不存在' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: '密码错误' });
				}
			});
		});
	}
));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true
	}),
	function (req, res) {
		res.redirect('/');
	}
);

router.get('/logout', function (req, res, next) {
	req.logout();
	req.flash('success_msg', '成功登出');
	res.redirect('/users/login');
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
