var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user')
var UserService = require('../services/user')
var UserGroup = require('../models/user_group')
var RouterIndex = require('./index');

// Login
router.get('/login', function (req, res, next) {
	res.render('users/login', {
		s_url: req.query.s_url
	});
});

// Login
router.post('/login',
	passport.authenticate('local', {
		failureRedirect: '/users/login',
		failureFlash: true,
	}),
	function (req, res) {
		var s_url = req.body.s_url
		if (s_url) {
			res.redirect(s_url);
			return
		}
		res.redirect('/');
	}
);

// Register
router.get('/register', function (req, res, next) {
	res.render('users/register');
});

// Register
router.post('/register', function (req, res, next) {
	var user_info = {};
	user_info.name = req.body.name;
	user_info.email = req.body.email;
	user_info.username = req.body.username;
	user_info.phone = req.body.phone;
	user_info.company = req.body.company;
	password = req.body.password;
	password2 = req.body.password2;
	group = UserGroup.USER;

	// Validation
	req.checkBody('name', '真实姓名不能为空').notEmpty();
	req.checkBody('email', '电子邮件不能为空').notEmpty();
	req.checkBody('email', '不是有效的电子邮件地址').isEmail();
	req.checkBody('username', '用户名不能为空').notEmpty();
	req.checkBody('username', '用户名为6到32位').len(6, 32);
	req.checkBody('password', '密码不能为空').notEmpty();
	req.checkBody('password', '密码长度为8到32位').len(8, 32);
	req.checkBody('password2', '密码两次输入不一致').equals(req.body.password);
	req.checkBody('phone', '手机号不能为空').notEmpty();
	req.checkBody('phone', '不是有效的手机号').len(11, 11).isInt();
	req.checkBody('company', '公司名不能为空').notEmpty();

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			res.render('users/register', {
				errors: result.array(),
				user_info
			});
		} else {
			UserService.getUserByUsername(user_info.username, function (err, user) {
				if (err) {
					res.render('users/register', {
						errors: [{ msg: '注册错误：' + err }],
						user_info
					});
				} else if (user) {
					res.render('users/register', {
						errors: [{ msg: '用户已存在' }],
						user_info
					});
				} else {
					console.log('PASSED');
					var newUser = new User({
						username: user_info.username,
						name: user_info.name,
						email: user_info.email,
						password: password,
						phone: user_info.phone,
						company: user_info.company,
						group: group,
						appkey: '',
						appsecret: '',
						applist: [],
						alertSms: 100,
						alertEmail: 100,
						wechat_openid: ''
					});

					UserService.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});

					req.flash('success_msg', '注册成功，请登录');
					res.redirect('/users/login');
				}
			});
		}
	});
});

// Logout
router.get('/logout', function (req, res, next) {
	req.logout();
	req.flash('success_msg', '成功登出');
	res.redirect('/users/login');
});

// Account
router.get('/account', UserService.ensureAuthenticated, function (req, res, next) {
	res.render('users/account', {
		css: ['/css/qw/account.css']
	});
});

// Account change info
router.post('/account', UserService.ensureAuthenticated, function (req, res, next) {
	var name = req.body.name;
	var compnay = req.body.company;
	var phone = req.body.phone;
	var email = req.body.email;

	// Validation
	req.checkBody('name', '真实姓名不能为空').notEmpty();

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			res.render('users/account', {
				errors: result.array()
			});
		} else {
			console.log('UPDATE');

			UserService.updateUserInfo(user.username, name, function (err, user) {
				if (err) throw err;
				console.log(user.name);
			});

			req.flash('success_msg', '注册成功，请登录');

			res.redirect('/users/login');
		}
	});

	res.render('users/account', {
		css: ['/css/qw/account.css']
	});
});

// Appication management
router.get('/app', UserService.ensureAuthenticated, function (req, res, next) {
	res.render('users/app', {
		css: ['/css/qw/app.css'],
		js: ['/js/qw/app.js']
	});
});

// API: link appkey and appsecret
router.post('/app/api/link', UserService.ensureAuthenticated, function (req, res, next) {
	var id = req.body.id
	var appkey = req.body.appkey;
	var appsecret = req.body.appsecret;
	console.log(`server: id = ${id} \nserver: appkey = ${appkey} \nserver: appsecret = ${appsecret}`);
	UserService.setCurrApp(id, appkey, appsecret, function (err) {
		if (err) {
			// throw err
			req.flash('error_msg', 'APP关联失败。');

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

// Alert SMS or Email
router.get('/alert', UserService.ensureAuthenticated, function (req, res, next) {
	res.render('users/alert', {
		css: ['/css/qw/alert.css']
	});
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		UserService.getUserByUsername(username, function (err, user) {
			if (err) {
				return done(null, false, { message: err });
			}
			if (!user) {
				return done(null, false, { message: '用户不存在' });
			}

			UserService.comparePassword(password, user.password, function (err, isMatch) {
				if (err) {
					return done(null, false, { message: '登陆错误：' + err })
				}
				if (isMatch) {
					if (UserService.isUserActivated(user.activation)) {
						return done(null, user);
					} else {
						return done(null, false, { message: '用户未激活，请联系对接人员' })
					}
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
	UserService.getUserById(id, function (err, user) {
		done(err, user);
	});
});

module.exports = router;
