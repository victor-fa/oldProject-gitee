var User = require('../models/user');
var GroupPolicy = require('../services/group_policy')
var UserGroup = require('../models/user_group');
var bcrypt = require('bcryptjs');
var url = require('url');
var VcodeCreator=require('./vcode_creator');

var sendPwd = require("../services/mail_sender")
// Check user is loged in
module.exports.ensureAuthenticated = function(req, res, next) {
    // var url_parts = url.parse(req.originalUrl);
    // console.log(req.originalUrl)
    // console.log(url_parts)
    if (req.isAuthenticated() || req.originalUrl.endsWith('.jpg')) {
        return next();
    } else {
        req.flash('error_msg', '由于会话过期，请重新登陆后继续操作');
        var s_url = encodeURIComponent(req.protocol + '://' + req.headers.host + req.originalUrl)
        res.redirect('/users/login?s_url=' + s_url)
    }
}

//check verification code
module.exports.checkVcode=function(req,res,params,callback){
	var vcode=req.body.vcode;
	var error_msg="";
	if(!vcode||!vcode.trim()){
		error_msg="验证码不能为空";
	}else if(vcode.toLowerCase()!=req.session.captcha){
		error_msg="验证码错误";
    }
    if(error_msg){
		var vcode=VcodeCreator.createVcode();
        req.session.captcha=vcode.codeText;
        Object.assign(params,{img:vcode.codeData,errors:[{msg:error_msg}]})
		res.render(params.url, params);
		return;
	}else{
        callback();
    }
}




// Create the user
module.exports.createUser = function(newUser, callback) {
    //生成用戶密碼
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.activateUserByEmail=function(username,hash,callback){
    var query={username:username,mailActivationHash:hash};
    User.findOneAndUpdate(query,{
        group:UserGroup.USER
    },callback);
}

// Check user email check status 
module.exports.isUserCheckByEmail = function(group) {
    if (group == UserGroup.GUEST)
        return false;
    return true;
}


// Get user by username
module.exports.getUserByUsername = function(username, callback) {
    var query = { username: username };
    User.findOne(query, callback);
}

// Get user By user id
module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

// Check the password
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) {
            callback(err, false);
        } else {
            callback(null, isMatch);
        }
    });
}

module.exports.updateUserInfo = function(username, name, callback) {
    var query = { username: username }
    User.findOneAndUpdate(query, {
        name: name
    }, callback)
}

module.exports.updateUserPwd = function(id, password, callback) {
    var query = { _id: id };
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            User.findOneAndUpdate(query,{
                password:hash
            },callback);
        });
    });
}

module.exports.updateTestcases = function(username, testcases, callback) {
    var query = { username: username }
    User.findOneAndUpdate(query, {
        testcases: testcases
    }, callback)
}

// Check user activation status
module.exports.isUserActivated = function(user_activation) {
    if (user_activation > 0)
        return true;
    return false;
}

// List all inactive users
module.exports.listInactiveUsers = function(callback) {
    var query = { activation: 0 };
    var users = User.find(query, callback);
}

// List all users
module.exports.listAllUsers = function(callback) {
    var query = {};
    var users = User.find(query, callback);
}

// Update user active
module.exports.updateUserActive = function(id, activate, callback) {
    var query = { _id: id };
    // console.log(`mongoDB: id = ${id} \tactivate = ${activate}`);
    // console.log(`mongoDB: id: ${typeof (id)} \tactivate: ${typeof (activate)}`);
    if (activate == 0) {
        User.findOneAndUpdate(query, { activation: 1 }, callback);
    } else {
        User.findOneAndUpdate(query, { activation: 0 }, callback);
    }
}

// Change current 'appkey' and 'appsecret'
module.exports.setCurrApp = function(id, appkey, appsecret, callback) {
    var query = { _id: id };
    User.findOneAndUpdate(query, {
        appkey: appkey,
        appsecret: appsecret
    }, callback);
}

module.exports.addAlbum = function(id, album, callback) {
    var query = { _id: id }
    User.findOne(query, function(err, user) {
        if (err) {
            callback(err);
        }
        user = user.toObject()
        if ('albums' in user && user.albums.indexOf(album) != -1) {
            callback("相册已存在");
        } else {
            User.findOneAndUpdate(query, {
                $addToSet: {
                    albums: album
                }
            }, callback);
        }
    })
}

// Add or update a 'appkey' and 'appsecret' in a user's 'applist'
module.exports.addApp = function(id, appkey, appsecret, callback) {
    var query = { _id: id };
    User.findOne(query, function(err, user) {
        if (err) {
            callback(err);
        }
        var exists = false;
        for (var i = 0; i < user.applist.length; ++i) {
            if (user.applist[i].appkey == appkey) {
                exists = true;
                break;
            }
        }
        if (exists) {
            callback("相关APPKEY已存在。");
        } else {
            if (user.appkey) {
                User.findOneAndUpdate(query, {
                    $addToSet: {
                        applist: {
                            appkey: appkey,
                            appsecret: appsecret
                        }
                    }
                }, callback);
            } else {
                // current app is empty
                User.findOneAndUpdate(query, {
                    appkey: appkey,
                    appsecret: appsecret,
                    $addToSet: {
                        applist: {
                            appkey: appkey,
                            appsecret: appsecret
                        }
                    }
                }, callback);
            }
        }
    });
}


// Remove 'appkey' and 'appsecret' from 'applist' or current 'appkey & appsecret'
module.exports.removeApp = function(id, appkey, callback) {
    var query = { _id: id };
    User.findOne(query, function(err, user) {
        if (err) {
            callback(err);
        }
        if (user.appkey == appkey) {
            user.appkey = '';
            user.appsecret = '';
        }
        for (var i = 0; i < user.applist.length; ++i) {
            if (user.applist[i].appkey == appkey) {
                user.applist.splice(i, 1);
            }
        }
        User.findOneAndUpdate(query, {
            appkey: user.appkey,
            appsecret: user.appsecret,
            applist: user.applist
        }, callback);
    })
}

module.exports.resertPwd = function(username){
	var pwdStr = ['1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q',
		'r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S',
		'T','U','V','W','X','Y','Z'];
	var newPwd="";
	for(var i = 0;i < 12; i++){
		var str = pwdStr[Math.floor(Math.random()*pwdStr.length)];
		newPwd = newPwd+str;
	}
    console.log("新密码为："+newPwd);
    var query = { username: username };
    User.findOne(query,function (err,user){
        if (err) {
            // throw err;
            return newPwd = "1";
        };   
        var params={
            title:"齐悟后台系统密码重置",
            content:"您的新密码为："+newPwd,
            user_info:{
            email:user.email,
            username:user.username
            }
        };
		sendPwd.sendEmail(params);
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(newPwd, salt, function(err, hash) {
				// Store hash in your password DB
				user.password = hash;
				user.save(callback);
			});
		});
	});
    return newPwd;
	var callback=function(error, info){
        if(error){
            console.log(error)
            console.log("数据库密码修改失败");
            return;
        }
        console.log('Message sent: ' + info.response);
    };
}