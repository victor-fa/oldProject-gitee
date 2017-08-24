var express = require('express');
var router = express.Router();
var User = require('../models/user');

// Manage
router.get('/manage', User.ensureAuthenticated, function (req, res) {
	var id = req.query.id; // $_GET["id"]
	if (id) {
		User.getUserById(id, function(err, aUser) {
			if (err) {
				req.flash('error_msg', '用户信息加载失败：' + err);
				res.redirect('/admin/manage');
			}
			var render_para = {}			
			render_para.css = ['/css/qw/manage.css'];
			render_para.js = ['/js/qw/manage-detail.js'];
			if (aUser.activate === 0) {
				aUser.active = '未激活';
				aUser.buttonTypeActivate = 'danger';
			} else {
				aUser.active = '已激活';
				aUser.buttonTypeActivate = 'success';
			}
			if (aUser.applist.length > 0) {
				aUser.buttonTypeAppnum = 'info';
			} else {
				aUser.buttonTypeAppnum = 'danger';
			}
			render_para.aUser = aUser;
			res.render('admin/manage-detail', render_para);
		});
	} else {
		User.listAllUsers(function (err, users) {
			if (err) {
				req.flash('error_msg', '用户列表加载失败：' + err);
			}
			res.render('admin/manage', {
				users,
				css: ['/css/qw/manage.css'],
				js: [
					'/js/qw/manage.js'
				]
			});

		});
	}
});

// API: list all users
router.get('/manage/api/load', User.ensureAuthenticated, function (req, res) {	
	User.listAllUsers(function (err, users) {
		if (err) {
			// throw err;
			req.flash('error_msg', '用户列表加载失败：' + err);
		}
		res.json(users);
	});
});

// API: active or inactive user
router.post('/manage/api/activate', User.ensureAuthenticated, function (req, res) {
	var id = req.body.id;
	var activate = req.body.activate;
	// console.log(`server: id = ${id} \tactivate = ${activate}`);
	User.updateUserActive(id, activate, function (err) {
		if (err) {
			// throw err;
			req.flash('error_msg', '用户激活状态修改失败：' + err);

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

// API: add new APP or update APP
router.post('/manage/api/addapp', User.ensureAuthenticated, function (req, res) {
	var id = req.body.id;
	var appkey = req.body.appkey;
	var appsecret = req.body.appsecret;
	console.log(`id: ${id} \tappkey: ${appkey} \tappsecret: ${appsecret}`);
	User.addApp(id, appkey, appsecret, function(err) {
		if (err) {
			req.flash('error_msg', '添加／修改APP失败：' + err);
		} else {
			req.flash('success_msg', '添加／修改APP成功。');
		}
		res.redirect('/admin/manage?id='+id);
	});

});

module.exports = router;
