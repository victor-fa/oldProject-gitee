var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    company: {
        type: String
    },
    group: {
        type: Number
    },
    appkey: {
        type: String
    },
    appsecret: {
        type: String
    },
    applist: [{
        appkey: {
            type: String,
        },
        appsecret: {
            type: String
        },
        _id: false
    }],
    testcases: {
        type: String
    },
    alertSms: {
        type: Number
    },
    alertEmail: {
        type: Number
    },
    wechat_openid: {
        type: String
    },
    activation: {
        type: Number,
        default: 0
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

// Create the user
module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            // Store hash in your password DB
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

// Get user by username
module.exports.getUserByUsername = function (username, callback) {
    var query = { username: username };
    User.findOne(query, callback);
}

// Get user By user id
module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

// Check the password
module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}

module.exports.updateUserInfo = function (username, name, callback) {
    var query = { username: username }
    User.findOneAndUpdate(query, {
        name: name
    }, callback)
}

module.exports.updateTestcases = function (username, testcases, callback) {
    var query = { username: username }
    User.findOneAndUpdate(query, {
        testcases: testcases
    }, callback)
}

// Check user activation status
module.exports.isUserActivated = function (user_activation) {
    if (user_activation > 0)
        return true;
    return false;
}

// List all inactive users
module.exports.listInactiveUsers = function (callback) {
    var query = { activation: 0 };
    var users = User.find(query, callback);
}

// List all users
module.exports.listAllUsers = function (callback) {
    var query = {};
    var users = User.find(query, callback);
}

// Update user active
module.exports.updateUserActive = function (id, activate, callback) {
    var query = { _id: id };
    // console.log(`mongoDB: id = ${id} \tactivate = ${activate}`);
    // console.log(`mongoDB: id: ${typeof (id)} \tactivate: ${typeof (activate)}`);
    if (activate == 0) {
        User.findOneAndUpdate(query, { activation: 1 }, callback);
    } else {
        User.findOneAndUpdate(query, { activation: 0 }, callback);
    }
}

// Check user is loged in
module.exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // req.flash('error_msg', '您没有登录');
        res.redirect('/users/login')
    }
}

// Change current 'appkey' and 'appsecret'
module.exports.setCurrApp = function (id, appkey, appsecret, callback) {
    var query = { _id: id };
    User.findOneAndUpdate(query, {
        appkey: appkey,
        appsecret: appsecret
    }, callback);
}

// Add or update a 'appkey' and 'appsecret' in a user's 'applist'
module.exports.addApp = function (id, appkey, appsecret, callback) {
    var query = { _id: id };
    User.findOne(query, function (err, user) {
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
            User.findOneAndUpdate(query, {
                $addToSet: {
                    applist: {
                        appkey: appkey,
                        appsecret: appsecret
                    }
                }
            }, callback);
        }
    });
}

// Remove 'appkey' and 'appsecret' from 'applist' or current 'appkey & appsecret'
module.exports.removeApp = function (id, appkey, callback) {
    var query = { _id: id };
    User.findOne(query, function (err, user) {
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