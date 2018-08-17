var express = require('express');
var router = express.Router();
var UserService = require('../services/user')
var UserGroupPolicy = require('../services/group_policy')

var APIPath = '/api/admin/apps?';
var iconv = require("iconv-lite");

var md5 = require('../public/js/util/md5.min')
var http = require('http')
var https = require('https')
var bcrypt = require('bcryptjs');

var sendPwd = require("../services/mail_sender_pwd")
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
			render_para.js = ['/js/qw/manage-detail.js',
			'/js/qw/resetPassword.js'
		];
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

//API: 重置用户密码
router.get('/manage/api/reset', function (req, res, next) {
	var username = req.param("username");
	var pwdStr = ['1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q',
		'r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S',
		'T','U','V','W','X','Y','Z'];
	var newPwd="";
	for(var i = 0;i < 12; i++){
		var str = pwdStr[Math.floor(Math.random()*pwdStr.length)];
		newPwd = newPwd+str;
	}
	console.log("新密码为："+newPwd);
	UserService.getUserByUsername(username,function (err,user){
		if (err) {
			// throw err;
			req.flash('error_msg', '该用户不存在：' + err);
		}
		sendPwd.sendEmailPwd(user.email,newPwd);
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(newPwd, salt, function(err, hash) {
				// Store hash in your password DB
				user.password = hash;
				user.save(callback);
			});
		});
		res.json({"pwd":newPwd});
	});
	
	var callback=function(error, info){
        if(error){
            console.log(error)
            console.log("数据库密码修改失败");
            return;
        }
        console.log('Message sent: ' + info.response);
    };
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
// app manage  page
router.get('/manage/api/appmanage', function (req, res, next) {
	res.render('admin/app-manage', {
		
		css: ['/css/qw/app.css'],
		js: ['/js/qw/app.js'],
		js: ['/js/qw/applist.js']
	});
	if(next){
		next();
	}
});
//delete app
router.get('/manage/api/deleteapp', function (req, res, next) {
	var secret = req.query.appsecret;
	var attr = 'secret='+ secret;
	delAppBySrt(attr);
	res.render('admin/app-manage', {
		css: ['/css/qw/app.css'],
		js: ['/js/qw/app.js'],
		js: ['/js/qw/applist.js']
	});
	if(next){
		next();
	}
});
//update app
router.get('/manage/api/alterapp', function (req, res) {
	var secret = req.query.appsecret;
	var attr = 'secret='+ secret
	getAppBySecret(attr,function (msg){
		var transferedJsonData =  eval('(' + msg+ ')');
        var appinfo = transferedJsonData['data'];
		res.render('admin/app-update', {
		css: ['/css/qw/app.css'],
		js: ['/js/qw/app.js'],
		js: ['http://code.jquery.com/jquery-latest.js'],
		js: ['/js/qw/get_robot_list.js'],
		appinfo: appinfo
		});
		
	});
	
	
});
//update app
router.post('/manage/api/alterapp', function (req, res, next) {
	var app_info = {};
	app_info.appname = req.body.appname;
	app_info.appkey = req.body.appkey;
	app_info.robot = req.body.robot;
	app_info.appsecret = req.body.appsecret;
	
	console.log('req.body.robot:'+req.body.robot);
	
	req.checkBody('appname', 'appName不能为空').notEmpty();
	req.checkBody('appkey', 'appkey不能为空').notEmpty();
	req.checkBody('robot', 'robot不能为空').notEmpty();
	
	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			res.render('admin/app-update', {
				errors: result.array(),
				app_info,
				css: ['/css/qw/app.css'],
				js: ['/js/qw/app.js'],
				js: ['http://code.jquery.com/jquery-latest.js'],
				js: ['/js/qw/get_robot_list.js']
			});
		} else {
			var attr='name='+app_info.appname+'&appkey='+app_info.appkey+'&robot='+app_info.robot+'&secret='+app_info.appsecret;
			msg = updateApp(attr);
			req.flash('success_msg', '修改app成功');
			res.redirect('/admin/manage/api/appmanage');
			 
		}
	});
	if(next){
		next();
	}
});
// add Appication to DB page
router.get('/manage/api/app-add', function (req, res) {
	res.render('admin/app-add', {
		
		css: ['/css/qw/app.css'],
		js: ['/js/qw/app.js'],
		js: ['http://code.jquery.com/jquery-latest.js'],
		js: ['/js/qw/get_robot_list.js']
	});
	
});

// add Appication to DB
router.post('/manage/api/app-add', function (req, res, next) {
	var app_info = {};
	app_info.appname = req.body.appname;
	app_info.appkey = req.body.appkey;
	app_info.robot = req.body.robot;
	
	console.log('req.body.robot:'+req.body.robot);
	
	req.checkBody('appname', 'appName不能为空').notEmpty();
	req.checkBody('appkey', 'appkey不能为空').notEmpty();
	req.checkBody('robot', 'robot不能为空').notEmpty();
	
	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			res.render('admin/app-add', {
				errors: result.array(),
				app_info,
				css: ['/css/qw/app.css'],
				js: ['/js/qw/app.js'],
				js: ['http://code.jquery.com/jquery-latest.js'],
				js: ['/js/qw/get_robot_list.js']
			});
		} else {
			//UserService.getAppByname(app_info.name, function (err, app) {
				// if (err) {
					// res.render('/manage/api/app-add', {
						// errors: [{ msg: '添加APP错误：' + err }],
						// app_info
					// });
				// } else if (app) {
					// res.render('/manage/api/app-add', {
						// errors: [{ msg: 'app已存在' }],
						// app_info
					// });
				// });

					// req.flash('success_msg', '添加app成功');
				// }
			//});
			var attr='name='+app_info.appname+'&appkey='+app_info.appkey+'&robot='+app_info.robot;
			addAppToDB(attr,function (msg){
				req.flash('success_msg', '添加app成功');
				res.redirect('/admin/manage/api/app-add');
				//res.render('admin/app-add');
			});
			 
		}
	});
	if(next){
		next();
	}
});

function addAppToDB(attr,callbackfunciton){
    //http.get("http://localhost" + '/api/admin/add-app?'+ attr, function(res) {
	https.get("https://robot-service.centaurstech.com" + '/api/admin/add-app?'+ attr, function(res) {
		callbackfunciton('success');
        
    }).on('error', function(e) {

        callbackfunciton(e.message + " error");
    });

}

function delAppBySrt(attr){
	//http.get("http://localhost" + '/api/admin/del-app?'+ attr
	https.get("https://robot-service.centaurstech.com" + '/api/admin/del-app?'+ attr
	).on('error', function(e) {

        return e.message
    });
}

function updateApp(attr,callbackfunciton){
	//http.get("http://localhost" + '/api/admin/alt-app?'+ attr
	https.get("https://robot-service.centaurstech.com" + '/api/admin/alt-app?'+ attr
	).on('error', function(e) {

        return (e.message + " error");
    });
}

function getAppBySecret(attr,callbackfunciton){
	//http.get("http://localhost" + '/api/admin/get-app?'+ attr, function(res) {
	https.get("https://robot-service.centaurstech.com" + '/api/admin/get-app?'+ attr, function(res) {
		var datas = [];
        var size = 0;
		console.log('get2');
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

function getAppsKeysAndScrets(urlpath,callbackfunciton){
	//http.get("http://localhost" + urlpath, function(res) {
    https.get("https://robot-service.centaurstech.com" + urlpath, function(res) {
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
