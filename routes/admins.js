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
var yml_upload_dir = './public/cases/upload/';
var yml_new_dir = './public/cases/new/';
var myDate = new Date();
const fs = require('fs');

var rp = require('request-promise');
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
	var newPwd = UserService.resertPwd(username);
	res.json({"pwd":newPwd});
	if (next) {
        next();
    }
});

// API:转发到上传配置页面
router.get('/manage/api/upload',function(req, res, next){
	res.render('admin/cases-upload', {
		css: ['/css/qw/app.css']
	});
	if (next) {
        next();
    }
});


// API:转发到新建配置页面
router.get('/manage/api/new',function(req, res, next){
	res.render('admin/cases-new', {
		css: ['/css/qw/app.css']
	});
	if (next) {
        next();
    }
});

// API:调用第三方接口获取验证码
router.get('/manage/api/getfakecode',function(req, res, next){
	var phone = req.param("phone");
	var b = new Buffer(phone);
	var s = b.toString('base64');
	var opt = {
		uri:'http://account-center-test.chewrobot.com:6667/api/admin/sms/fake',
		method:'GET',
		headers:{
			"Content-Type": 'application/x-www-form-urlencoded',
			"Authorization":"Basic "+s 
		}
    }
    rp(opt).then(function(result){
		
		var str = {
			code : JSON.parse(result).message
		}
		
        res.send(str);
    });
});

// API:转发到获取验证码页面
router.get('/manage/api/codemanage',function(req, res, next){
	res.render('admin/manage-fakecode', {
		
		css: ['/css/qw/app.css'],
		js: ['/js/qw/app.js'],
		js: ['/js/qw/applist.js'],
		js: ['/js/qw/get_fakecode.js']
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

// API: updateApp byApp
router.get('/manage/api/updateAppByApp', function (req, res, next) {
	var appkey = 'zhihuishenghuo-chat-test';	// 旧的
	var newappkey = 'zhihuishenghuo-chat-test1';	// 新的
	UserService.updateAppByApp(appkey, newappkey, function (err, users) {
		if (err) {
			// req.flash(err)
			res.json({"msg":err});
		} else {
			// req.flash(users)
			res.json({"msg": 'OK'});
		}
	});
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
	app_info.oldAppKey = req.body.oldAppKey;
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
			
			// 修改AppKey自身的同时修改User表对应的所有appkey
			UserService.updateAppByApp(app_info.oldAppKey, app_info.appkey, function (err, users) {
				err ? console.log(err) : console.log('update User appkey Success!');
			});
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

/* 配置文件上传开始 */
/**
 * delete file
 * @param {*} ymlName 
 * @param {*} flag 
 */
function deleteYMLFile(ymlName, flag) {
	const yml_dir = flag === 'upload' ? yml_upload_dir : yml_new_dir ;
	fs.unlink(yml_dir + ymlName, function(error){
		if(error){
			console.log(error);
			return false;
		}
		console.log('删除文件成功');
	})
}

function deleteYMLFile(ymlName, flag) {
	const yml_dir = flag === 'upload' ? yml_upload_dir : yml_new_dir ;
	fs.unlink(yml_dir + ymlName, function(error){
		if(error){
			console.log(error);
			return false;
		}
		console.log('删除文件成功');
	})
}

/**
 * exe python about QiwuGrader
 * @param {*} ymlName 
 * @param {*} flag 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function execYMLFile(ymlName, flag, req, res, next) {
	var exec = require('child_process').exec;
	const yml_dir = flag === 'upload' ? yml_upload_dir : yml_new_dir;
	const redirectURL = flag === 'upload' ? '/admin/manage/api/upload' : '/admin/manage/api/new';
	var arg1 = yml_dir + ymlName;
	var iconv = require('iconv-lite');
	exec('python ../QiwuGrader/app.py ' + '\'' + arg1 + '\'' + ' ' , function(error, stdout, stderr){	// ' ' + arg2 + 
		if (error) {
			deleteYMLFile(ymlName, flag);
			req.flash('error_msg', '分析结果失败：' + error);
			return res.redirect(redirectURL);
		}
		console.log("==========" + stderr);
		if (stderr.indexOf('ERROR') != -1 ) {
			deleteYMLFile(ymlName, flag);
			req.flash('error_msg', '配置测试失败：' + stderr);
			return res.redirect(redirectURL);
		}
		if (stderr.indexOf('grade:') === -1 ) {
			deleteYMLFile(ymlName, flag);
			req.flash('error_msg', '配置测试失败：' + stderr);
			return res.redirect(redirectURL);
		}
		const cruxArr = stderr.substring(stderr.indexOf('grade:')+6, stderr.indexOf('time:')).split('/');
		const molecule = cruxArr[0].replace(/^\s+|\s+$/g,"");	// 分子，去空格
		const denominator = cruxArr[1].replace(/^\s+|\s+$/g,"");	// 分母，去空格
		stderr=stderr.replace(/\n/g, "<br>");
		var result = iconv.decode(stderr, 'UTF-8');
		req.flash('success_msg', result);
		req.flash('success_title', '配置测试成功，请下拉到最下面看结果');
		return res.redirect(redirectURL);
	});
}

/**
 * upload file
 */
router.post('/cases/uploadyml', function (req, res, next) {
	// JSON.stringify()
	let ymlFileName = '';
	let casesFile = req.files.ymlFile;
	if (JSON.stringify(req.files) !== '{}') {
		ymlFileName = req.files.ymlFile.name;
	} else {
        req.flash('error_msg', '您没有选择要上传的文件');
		return res.redirect('/admin/manage/api/upload');
	}
	if (ymlFileName.substr(ymlFileName.length-4, 4) !== '.yml') {
        req.flash('error_msg', '您上传的不是yml文件！');
        return res.redirect('/admin/manage/api/upload');
	}
	var path_to_yml = yml_upload_dir + ymlFileName;

    casesFile.mv(path_to_yml, function(err) {
        if (err){
            req.flash('error_msg', '文件上传失败：' + err);
            return res.redirect('/admin/manage/api/upload');
		} 
		else {
			execYMLFile(ymlFileName, 'upload', req, res, next);
        }
    })
    if (next) {
        next();
    }
})
/* 配置文件上传结束 */

/* 在线测试配置文件开始 */
/**
 * 提交表单
 */
router.post('/cases/newcases', function (req, res, next) {
	console.log('=========' + JSON.stringify(req.body));
	reqString = JSON.stringify(req.body);
	var YAML = require('json2yaml');
	var questionCount = 0;
	var answerCount = 0;
	const serverJson = {};	// 服务参数
	const serverKey = [];	// 服务参数key
	const serverValue = [];	// 服务参数value
	const optionsJson = {};	// 测试参数
	const optionsKey = [];	// 测试参数key
	const optionsValue = [];	// 测试参数value
	const outputJson = {};	// 输出参数
	const outputKey = [];	// 输出参数key
	const outputValue = [];	// 输出参数value
	const usernames = [];	// 测试用户名参数
	const requestJson = {};	// 请求参数
	const requestKey = [];	// 请求参数key
	const requestValue = [];	// 请求参数value
	const replacementJson = {};	// 后处理替换参数
	const replacementKey = [];	// 后处理替换参数key
	const replacementValue = [];	// 后处理替换参数key
	const questionsJson = {};	// 提问参数
	const answersJson = {};	// 回复参数
	
	// 遍历json对象并对号入座
	for(var item in req.body){ 
		if(item.substring(0, item.indexOf('serverKey.')+10) == 'serverKey.'){	// 服务器参数
			serverKey.push(req.body[item]);
		} else if(item.substring(0, item.indexOf('server.')+7) == 'server.'){	// 服务器参数
			serverValue.push(req.body[item]);
		} else if(item.substring(0, item.indexOf('testKey.')+8) == 'testKey.'){	// 测试参数key
			optionsKey.push(req.body[item]);
        } else if(item.substring(0, item.indexOf('test.')+5) == 'test.'){	// 测试参数value
			optionsValue.push(req.body[item]);
        } else if(item.substring(0, item.indexOf('outputKey.')+10) == 'outputKey.'){	// 输出参数key
			outputKey.push(req.body[item]);
        } else if(item.substring(0, item.indexOf('output.')+7) == 'output.'){	// 输出参数value
			outputValue.push(req.body[item]);
		} else if(item.substring(0, item.indexOf('usernames.')+10) == 'usernames.'){	// 测试用户名参数
			usernames.push(req.body[item]);
		} else if(item.substring(0, item.indexOf('requestKey.')+11) == 'requestKey.'){	// 请求参数key
			requestKey.push(req.body[item]);
        } else if(item.substring(0, item.indexOf('request.')+8) == 'request.'){	// 请求参数value
			requestValue.push(req.body[item]);
		} else if(item.substring(0, item.indexOf('replacementKey.')+15) == 'replacementKey.'){	// 后处理替换参数key
			replacementKey.push(req.body[item]);
        } else if(item.substring(0, item.indexOf('replacement.')+12) == 'replacement.'){	// 后处理替换参数value
			replacementValue.push(req.body[item]);
		} else if(item.substring(0, item.indexOf('question.')+9) == 'question.'){	// 提问
			createJson(item.substring(item.indexOf('question.')+9, item.length), "questions", req.body[item]);
			questionCount += 1;
		} else if(item.substring(0, item.indexOf('answerSingle.')+13) == 'answerSingle.'){	// 回答 单选
			createJson(item.substring(item.indexOf('answerSingle.')+13, item.length), "answerSingle", req.body[item]);
			answerCount += 1;
		} else if(item.substring(0, item.indexOf('answerMulti.')+12) == 'answerMulti.'){	// 回答 多选
			createJson(item.substring(item.indexOf('answerMulti.')+12, item.length), "answerMulti", req.body[item]);
			answerCount += 1;
		} else if(item.substring(0, item.indexOf('answerRegex.')+12) == 'answerRegex.'){	// 回答 正则
			createJson(item.substring(item.indexOf('answerRegex.')+12, item.length), "answerRegex", req.body[item]);
			answerCount += 1;
        }
	}

	// 服务器参数
	compareKeyWithValue(serverKey, serverValue, "server", "请检查 服务器参数 的key与value是否有输入为空", req, res);

	// 操作输出参数
	compareKeyWithValue(outputKey, outputValue, "output", "请检查 输出参数 的key与value是否有输入为空", req, res);

	// 操作测试参数
	compareKeyWithValue(optionsKey, optionsValue, "test", "请检查 测试参数 的key与value是否有输入为空", req, res);

	// 请求参数
	compareKeyWithValue(requestKey, requestValue, "request", "请检查 请求参数 的key与value是否有输入为空", req, res);

	// 后处理替换参数
	compareKeyWithValue(replacementKey, replacementValue, "replacement", "请检查 后处理替换参数 的key与value是否有输入为空", req, res);

	// 处理需要测试的用户
	const usernamesResult = usernames.length > 1 ? usernames : usernames[0];

	// 检查提问与回答的数量是否一致
	questionCount !== answerCount ? throwErrorForUndefined('提问与回答的条数没对应上！', req, res) : 1 ;
	
	// 基本骨架
	const jsonObj = {
		'type': req.body.type,
		'name': req.body.name,
		'comment': req.body.comment,
		'id': req.body.fileId,
		'author': req.body.author,
		'engine': req.body.engine,
		'username': req.body.username,
		'welcome': req.body.welcome,
		'ending': req.body.ending,
		'survey': req.body.survey,
		'static_chatkey': req.body.static_chatkey,
		'nickname': req.body.nickname,
		'server' : serverJson,
		'options' : optionsJson,
		'output': outputJson,
		'usernames': usernamesResult,
		'request': requestJson,
		'post-replacement': replacementJson,
		'questions': questionsJson,
		'answers': answersJson
	}

	/* 删除空的key value 开始 */
	req.body.type === "" ? createJson("type", "finalJson") : 1 ;	// 测试类型
	req.body.name === "" ? createJson("name", "finalJson") : 1 ;	// 服务名称
	req.body.comment === "" ? createJson("comment", "finalJson") : 1 ;	// 服务介绍
	req.body.fileId === "" ? createJson("id", "finalJson") : 1 ;	// 文件名
	req.body.author === "" ? createJson("author", "finalJson") : 1 ;	// 服务负责人
	req.body.engine === "" ? createJson("engine", "finalJson") : 1 ;	// 服务器代号
	req.body.username === "" ? createJson("username", "finalJson") : 1 ;	// 机器人用户名
	req.body.welcome === "" ? createJson("welcome", "finalJson") : 1 ;	// 欢迎词
	req.body.ending === "" ? createJson("ending", "finalJson") : 1 ;	// 结束语
	req.body.survey === "" ? createJson("survey", "finalJson") : 1 ;	// 检测满意度的结束语
	req.body.static_chatkey === "" ? createJson("static_chatkey", "finalJson") : 1 ;	// 对于同一个用户的不同会话是否使用固定的chat_key
	req.body.nickname === "" ? createJson("nickname", "finalJson") : 1 ;	// 替换微信昵称/用户昵称

	reqString.indexOf('serverKey.') == -1 ? createJson("server", "finalJson") : 1 ;	// 服务器参数
	reqString.indexOf('testKey.') == -1 ? createJson("options", "finalJson") : 1 ;	// 测试参数
	reqString.indexOf('outputKey.') == -1 ? createJson("output", "finalJson") : 1 ;	// 输出参数
	reqString.indexOf('usernames.') == -1 ? createJson("usernames", "finalJson") : 1 ;	// 测试用户名参数
	reqString.indexOf('request.') == -1 ? createJson("request", "finalJson") : 1 ;	// 请求参数
	reqString.indexOf('replacementKey.') == -1 ? createJson("post-replacement", "finalJson") : 1 ;	// 后处理替换
	reqString.indexOf('question.') == -1 ? createJson("questions", "finalJson") : 1 ;	// 提问参数
	reqString.indexOf('answerSingle.') == -1 || reqString.indexOf('answerMulti.') == -1 
			|| reqString.indexOf('answerRegex.') == -1 ? createJson("answers", "finalJson") : 1 ;	// 提问参数
	/* 删除空的key value 结束 */

	// 抛出未填写任何字段的异常
	if (JSON.stringify(jsonObj) === '{}') {
		throwErrorForUndefined('您未填写任何字段！', req, res);
		return;
	}

	ymlText = YAML.stringify(jsonObj).replace(/\"/g, "");	// 将json转换成yml
	ymlText = ymlText.replace(/\\/g, "\"");	// 针对form串做处理

	console.log("===================" + ymlText);
	
	const ymlName = "ymlFile-" + myDate.getFullYear() + '-' 
		+ (myDate.getMonth() + 1) + '-' + myDate.getDate() + '_' 
		+ myDate.getHours() + '-' + myDate.getMinutes() + '-' 
		+ myDate.getSeconds() + ".yml";
	var path_to_yml = yml_new_dir + ymlName;
	fs.writeFile(path_to_yml, ymlText, function (err) {
        if (err){
            req.flash('error_msg', '文件生成失败：' + err);
		} else {
			execYMLFile(ymlName, 'new', req, res, next);
		}
	});

	/**
	 * 针对动态添加的数据进行处理
	 * @param {*} prop 
	 * @param {*} flag 
	 * @param {*} val 
	 */
	function createJson(prop, flag, val) {
		if (flag === 'server') {
			typeof val === "undefined" ? delete serverJson[prop] : serverJson[prop] = val;
		} else if (flag === 'questions') {
			typeof val === "undefined" ? delete questionsJson[prop] : questionsJson[prop] = val;
		} else if (flag === 'answerSingle') {
			answersJson[prop] = val;
		} else if (flag === 'answerMulti') {
			let multiArr = [];
			let multi = {};
			multiArr = val.split("&");	// 数组
			multi['multi'] = multiArr;	// 默认key为multi
			answersJson[prop] = multi;
		} else if (flag === 'answerRegex') {
			let multi = {};
			multi['regex'] = val;	// 默认key为multi
			answersJson[prop] = multi;
		} else if (flag === 'request') {
			typeof val === "undefined" ? delete requestJson[prop] : requestJson[prop] = val;
		} else if (flag === 'test') {
			typeof val === "undefined" ? delete optionsJson[prop] : optionsJson[prop] = val;
		} else if (flag === 'output') {
			typeof val === "undefined" ? delete outputJson[prop] : outputJson[prop] = val;
		} else if (flag === 'finalJson') {
			typeof val === "undefined" ? delete jsonObj[prop] : jsonObj[prop] = val;
		} else if (flag === 'replacement') {
			let replacementArr = [];
			let replaceKye = {};
			replacementArr = val.split("&");	// 数组
			replacementJson[prop] = replacementArr;
		}
	}
	
	/**
	 * 封装key value比较的方法
	 * @param {*} keyArr 
	 * @param {*} valueArr 
	 * @param {*} flag 
	 * @param {*} notify 
	 * @param {*} req 
	 * @param {*} res 
	 */
	function compareKeyWithValue(keyArr, valueArr, flag, notify, req, res) {
		if (keyArr.length > 0) {
			if (keyArr.length == valueArr.length) {
				for (var i = 0; i < keyArr.length; i ++) {
					createJson(keyArr[i], flag, valueArr[i]);
				}
			} else {
				throwErrorForUndefined(notify, req, res);
			}
		}
	}
	
    if (next) {
        next();
    }
})

/**
 * throwout error
 * @param {*} req 
 * @param {*} res 
 */
function throwErrorForUndefined(content, req, res) {
	req.flash('error_msg', content);
	return res.redirect('/admin/manage/api/new');
}

/* 在线测试配置文件结束 */

module.exports = router;
