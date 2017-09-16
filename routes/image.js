var express = require('express')
var router = express.Router()
var UserService = require('../services/user')
var fs = require('fs');
var album_dir = './resources/albums/';
var uuid = require('uuid')
const path = require("path")

router.get('/album', function(req, res) {
    res.render('image/album')
})

router.get('/upload', function(req, res) {
    res.render('image/upload')
})

function save_image(path, name, album, up_wechat, callback) {
    var request = require("request");
    
    var options = { method: 'POST',
      url: 'http://localhost/api/chat/image',
      headers: 
       { 'content-type': 'application/json' },
      body: 
       { path: path,
         name: name,
         album: album,
         up_wechat: up_wechat },
      json: true };
    
    request(options, function (error, response, body) {
      if (error) callback(error)
      callback()
    })
}

router.post('/upload', function(req, res) {
    var user = req.user
    var album_name = req.body.album_name
    if (!req.files) {
        req.flash('error_msg', '您没有选择要上传的文件')
        res.redirect('/image/upload')
    }

    var up_wechat = req.body.up_wechat

    up_wechat = (typeof up_wechat != 'undefined' && up_wechat) ? true : false

    let imageFile = req.files.picture
    var album = req.user.username + '_' + album_name
    var filename = uuid()
    var filetype = ".jpg" //imageFile.name
    filetype = filetype.substring(filetype.lastIndexOf('.'))

    var path_to_image = album_dir + album + '/' + filename + filetype

    // Use the mv() method to place the file somewhere on your server
    imageFile.mv(path_to_image, function(err) {
        if (err){
            req.flash('error_msg', '文件上传失败：' + err)
            return res.redirect('/image/upload')
        } else {            
            var absolute_path = path.resolve(path_to_image)
            console.log(absolute_path)

            save_image(absolute_path, filename, album, up_wechat, function (err) {
                if (err){
                    req.flash('error_msg', '文件上传失败：' + err)
                } else {
                    req.flash('success_msg', '文件上传成功！文件ID为：' + filename + ' 请在引擎回复末尾添加： 圖' + filename)
                }

                return res.redirect('/image/upload')
            })
        }
    })
})

router.post('/album/create', function(req, res) {
    var id = req.user._id;
    var album_name = req.body.album_name

    if (req.user.albums.length >= 5) {
        req.flash('error_msg', '每个用户最多只能创建5个相册');
        return res.redirect('/image/album')
    }

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