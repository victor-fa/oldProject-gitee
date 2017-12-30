var express = require('express');
var router = express.Router();
var UserService = require('../services/user')
var UserGroupPolicy = require('../services/group_policy')

var APIPath = '/api/admin/apps?';
var iconv = require("iconv-lite");

var md5 = require('../public/js/util/md5.min')
var http = require('https')
// Manage
router.get('/manage', function (req, res, next) {
	var id = req.query.id; // $_GET["id"]
	if (id) {
		UserService.getUserById(id, function (err, aUser) {
			if (err) {
				req.flash('error_msg', '用户信息加载失败：' + err);
				res.redirect('/admin/manage');
			}
			var render_para = {}
			render_para.css = ['/css/qw/manage.css'];
			render_para.js = ['/js/qw/manage-detail.js'];
			if (aUser.activation === 0) {
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
			render_para.user_groupname = UserGroupPolicy.getUserGroupName(aUser.group)
			res.render('admin/manage-detail', render_para);
		});
	} else {
		UserService.listAllUsers(function (err, users) {
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
	if (next) {
        next();
    }
});

// API: list all users
router.get('/manage/api/load', function (req, res, next) {
	UserService.listAllUsers(function (err, users) {
		if (err) {
			// throw err;
			req.flash('error_msg', '用户列表加载失败：' + err);
		}
		res.json(users);
	});
	if (next) {
        next();
    }
});

// API: active or inactive user
router.post('/manage/api/activate', function (req, res, next) {
	var id = req.body.id;
	var activate = req.body.activate;
	// console.log(`server: id = ${id} \tactivate = ${activate}`);
	if (!id) {
		res.json({
			retcode: 1,
			msg: '没有用户ID'
		});
	} else if (!activate) {
		res.json({
			retcode: 2,
			msg: '没有激活状态'
		});
	} else {
		UserService.updateUserActive(id, activate, function (err) {
			if (err) {
				// throw err;
				req.flash('error_msg', '用户激活状态修改失败：' + err);
	
				// send err res
				res.json({
					retcode: 3,
					msg: err
				})
			}
			res.json({
				retcode: 0
			})
		});
	}
	if (next) {
        next();
    }
});




// API: add new APP
router.post('/manage/api/addapp', function (req, res, next) {
	var ids = req.body.checkItem;
	var id = req.body.id;
	if (!id) {
		req.flash('error_msg', '添加APP失败：用户不存在。');
		res.redirect('/admin/manage');
	} else if (!ids) {
		req.flash('error_msg', '添加APP失败：没有app选中。');
		res.redirect('/admin/manage?id=' + id);
	} else {

		var idsval = eval('(' + ids + ')');
		UserService.addApp(id, idsval.appkey, idsval.appsecret, function (err) {
			if (err) {
				req.flash('error_msg', '添加APP失败：' + err );
			} else {
				req.flash('success_msg', '添加APP成功。');
			}
                res.redirect('/admin/manage?id=' + id);
		});
	}
	if (next) {
        next();
    }
});

// API: remove APP
router.get('/manage/api/removeapp', function (req, res, next) {
	var id = req.query.id;
	var appkey = req.query.appkey;
	if (!id) {
		req.flash('error_msg', '删除APP失败，用户不存在。');
		res.redirect('/admin/manage');
	} else if (!appkey) {
		req.flash('error_msg', '删除APP失败，APPKEY不存在。');
		res.redirect('/admin/manage?id=' + id);
	} else {
		UserService.removeApp(id, appkey, function (err) {
			if (err) {
				req.flash('error_msg', '删除APP失败：' + err);
			} else {
				req.flash('success_msg', '删除APP成功。');
			}
			res.redirect('/admin/manage?id=' + id);
		});
	}
	if (next) {
        next();
    }
});


// API: List apps infos
router.get('/manage/api/listappinfors',function (req,res) {
    var time = (new Date()).getTime();
    var secretStr = time + ' MANAGEMENT_SALT';
    var secret = md5(secretStr);

    // secret = '6f781e191f1d5c8d410318ffce406ae7';
	console.log(secret);

    var urlPath = APIPath + 'time=' + time + '&secret=' + secret;
    console.log(urlPath);
	getAppsKeysAndScrets(urlPath,function (msg){
		res.end(msg);
	});
});



function getAppsKeysAndScrets(urlpath,callbackfunciton){
    http.get("https://robot-service.centaurstech.com" + urlpath, function(res) {
        var datas = [];
        var size = 0;
        res.on('data', function (data) {
            datas.push(data);
            size += data.length;
        });
        res.on("end", function () {
            var buff = Buffer.concat(datas, size);
            var result = iconv.decode(buff, "utf8");//转码//var result = buff.toString();//不需要转编码,直接tostring
            callbackfunciton(result);
        });

    }).on('error', function(e) {
        callbackfunciton(e.message + " error");
    });

}





module.exports = router;
