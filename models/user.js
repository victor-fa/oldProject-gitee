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
        type: String
    },
    appkey: {
        type: String
    },
    appsecret: {
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
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

// Create the user
module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function(username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

module.exports.updateUserInfo = function(username, name, callback) {
    var query = {username: username};
    var user = User.findOne(query);
    user.name = name;
    User.findOneAndUpdate(query, user, callback);
}
