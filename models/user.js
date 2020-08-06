var mongoose = require('mongoose');

// User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true
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
    albums: [{
        type: String,
        default: []
    }],
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
    },
    mailActivationHash:{
        type:String
    }
}, {
    timestamps: true
});

var User = module.exports = mongoose.model('User', UserSchema);
