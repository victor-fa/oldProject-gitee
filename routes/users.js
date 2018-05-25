var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var plugin = require("centaurs-test-plugin");
//var nodemailer = require('nodemailer');
var mailSender=require('../services/mail_sender');
var config = require('config');
var User = require('../models/user');
var UserService = require('../services/user');
var UserGroup = require('../models/user_group');
var RouterIndex = require('./index');
var svgCaptcha = require('svg-captcha');

// Login
router.get('/login', function (req, res, next) {
	res.render('users/login', {
		s_url: req.query.s_url,
		js: ['/js/qw/vcode.js']
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
		//var s_url="http://www.baidu.com/";
		if (s_url) {
			res.redirect(s_url);
			//res.redirect(s_url+"?sid="+req.session.id);
			return
		}
		res.redirect('/');
	}
);

//get verification code
router.get('/vcode',function(req,res,next){
	var codeConfig = {
        size: 4,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
		noise: 2, // 干扰线条的数量
		fontSize:26,
		//color:true,
		height: 40,
		//background:"#333"
    }
    var captcha = svgCaptcha.create(codeConfig);
    req.session.captcha = captcha.text.toLowerCase(); //存session用于验证接口获取文字码
    var codeData = {
        img:captcha.data
    }
	res.send(codeData);
});

//check verification code
router.post('/check_vcode',function(req,res,next){
	var vcode=req.body.vcode;
	var msg={};
	if(vcode==req.session.captcha){
		msg.status="success";
	}else{
		msg.status="failure";
	}
	res.send(msg);
});

// Register
router.get('/register', function (req, res, next) {
	res.render('users/register',{
		js: ['/js/qw/vcode.js']
	});
});

// Register
router.post('/register', function (req, res, next) {
	var user_info = {};
	var phoneNumberReg=/(^1(34[0-8]|(3[5-9]|5[017-9]|8[278])\d)\d{7}$)|(^((13[0-2])|(15[256])|(18[56]))\d{8}$)|(^1((33|53|8[09])\d|349)\d{7})/;
	user_info.name = req.body.name;
	user_info.email = req.body.email;
	user_info.username = req.body.username;
	user_info.phone = req.body.phone;
	user_info.company = req.body.company;
	password = req.body.password;
	password2 = req.body.password2;
	group = UserGroup.GUEST;


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
	//req.checkBody('phone', '不是有效的手机号').len(11, 11).isInt();
	req.checkBody('company', '公司名不能为空').notEmpty();
	req.checkBody('phone','不是有效的手机号').matches(phoneNumberReg);
	

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			res.render('users/register', {
				errors: result.array(),
				user_info,
				js: ['/js/qw/vcode.js']
			});
		} else {
			UserService.getUserByUsername(user_info.username, function (err, user) {
				if (err) {
					res.render('users/register', {
						errors: [{ msg: '注册错误：' + err }],
						user_info,
						js: ['/js/qw/vcode.js']
					});
				} else if (user) {
					res.render('users/register', {
						errors: [{ msg: '用户已存在' }],
						user_info,
						js: ['/js/qw/vcode.js']
					});
				} else {
					console.log('PASSED');
					//生成激活邮件中的hash
					bcrypt.genSalt(10, function(err, salt) {
						bcrypt.hash("abcAAA", salt, function(err, hash) {
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
								wechat_openid: '',
								mailActivationHash:hash
							});
							UserService.createUser(newUser, function (err, user) {
								if (err) throw err;
								console.log(user);
							});
							mailSender.sendEmail({
								user_info:Object.assign({hash:hash},user_info),
							});
						});
					});
					req.flash('success_msg', '注册成功，请进入您输入的邮箱进行激活');
					res.redirect('/users/login');
				}
			});
		}
	});
});

//Activate by Email
router.get('/activate_by_email',function(req,res,next){
	var mailActivationHash=req.query.h_id;
	var username=req.query.user;
	if(username&&mailActivationHash){
		UserService.activateUserByEmail(username,mailActivationHash,function(error){
			if(error){
				console.log("/activate_by_email:"+error);
				res.send("参数错误，激活失败！");
			}
		})
	}
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
		css: ['/css/qw/account.css'],
		js: ['/js/qw/vcode.js']
	});
});

// Account change info
router.post('/account', UserService.ensureAuthenticated, function (req, res, next) {
	var name = req.body.name;
	var compnay = req.body.company;
	var phone = req.body.phone;
	var email = req.body.email;
	var oldPwd=req.body.oldPwd;
	var newPwd=req.body.newPwd;
	var newPwd2=req.body.newPwd2;

	// Validation
	req.checkBody('oldPwd', '原始密码不能为空').notEmpty();
	req.checkBody('newPwd', '新密码不能为空').notEmpty();
	req.checkBody('newPwd', '新密码长度为8到32位').len(8, 32);
	req.checkBody('newPwd2', '新密码两次输入不一致').equals(newPwd);

	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			res.render('users/account', {
				errors: result.array(),
				css: ['/css/qw/account.css'],
				js: ['/js/qw/vcode.js']
			});
		} else {
			console.log('Begin check original password!');
			//校验原始密码 从session中取用户id
			UserService.getUserById(req.session.passport.user,function(err,user){
				if(err){
					throw err;
					console.log(err);
					return;
				}
				UserService.comparePassword(oldPwd, user.password, function (err, isMatch) {
					if(isMatch){
						//原始密码正确
						UserService.updateUserPwd(req.session.passport.user,newPwd,function(error){
							if(error){
								throw error;
								console.log(error);
								return;
							} 
							req.logout();
							req.flash('success_msg', '密码修改成功，请重新登录');
							res.redirect('/users/login');
						})
					}else{
						//原始密码错误
						res.render('users/account', {
							error_msg:'原始密码错误，请重新输入',
							css: ['/css/qw/account.css'],
							js: ['/js/qw/vcode.js']
						});
					}
				})
			});
		}
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
					if(!UserService.isUserCheckByEmail(user.group)){
						return done(null, false, { message: '请进入您输入的邮箱进行帐号激活' })
					} else{
						if (UserService.isUserActivated(user.activation)) {
							return done(null, user);
						} else{
							return done(null, false, { message: '用户未激活，请联系对接人员' })
						}
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
