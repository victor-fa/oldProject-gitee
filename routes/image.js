var express = require('express')
var router = express.Router()
var UserService = require('../services/user')
var fs = require('fs');
var album_dir = './resources/albums/';

router.get('/album', function(req, res) {
    res.render('image/album')
})

router.get('/upload', function(req, res) {
    res.render('image/upload')
})

router.post('/album/create', function(req, res) {
    var id = req.user._id;
    var album_name = req.body.album_name
    UserService.addAlbum(id, album_name, function (err) {
        if (err) {
            req.flash('error_msg', '添加相册失败：' + err);
        } else {
            var dir = album_dir + req.user.username + '_' + album_name
            fs.mkdir(dir)
            req.flash('success_msg', '添加相册成功。')
        }
        res.redirect('/image/album')
    })
})

module.exports = router