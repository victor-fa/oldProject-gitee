var express = require('express')
var router = express.Router()
var UserService = require('../services/user')
const fs = require('fs');
var album_dir = './resources/albums/';
var uuid = require('uuid')
const path = require("path")
var config = require('config');

router.get('/album', function (req, res, next) {
    res.render('image/album')
    if (next) {
        next();
    }
})

router.get('/upload', function (req, res, next) {
    res.render('image/upload')
    if (next) {
        next();
    }
})
router.get('/delete', function (req, res, next) {
    res.render('image/delete',{
        js: [
            '/js/gallery/delete-image.js'
        ],
        username: req.user.username
    })
    if (next) {
        next();
    }
})
function save_image(path, name, album, up_wechat, callback) {
    var request = require("request");
    
    var options = { method: 'POST',
      url: config.deploy_domain_name + '/api/chat/image',
    //   url: 'http://localhost:8001/api/chat/image',
      headers: 
       { 'content-type': 'application/json' },
      body: 
       { path: path,
         name: name,
         album: album,
         up_wechat: up_wechat },
      json: true };
    
    request(options, function (error, response, body) {
        console.log(body)
      if (error) {
        callback(error)
        return
      }
      
      callback()
    })
}

function delete_image(absolute_path,file_name,album_name,up_wechat,callback){
    var request = require("request");
    console.log("going to send the request to the server to delete the image with the name of "+absolute_path)
    var options = { method: 'DELETE',
      url: config.deploy_domain_name + '/api/chat/image',  // here change to delete 
    //   url: 'http://localhost:8001/api/chat/image',              // here is for localhost testing 
      headers: 
       { 'content-type': 'application/json' },
      body: 
       { path: absolute_path,
         name: file_name,
         album: album_name,
         up_wechat: up_wechat },
      json: true };
    
    request(options, function (error, response, body) {
      if (error) {
        callback(error)
        return
      }
      else if(body.retcode == 0){
        callback()
      }
      else callback("failed")
    })

}
router.post('/upload', function (req, res, next) {
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
                    fs.unlink(absolute_path)
                } else {
                    req.flash('success_msg', '文件上传成功！文件ID为：' + filename + ' 请在引擎回复末尾添加： 啚' + filename)
                }

                return res.redirect('/image/upload')
            })
        }
    })
    if (next) {
        next();
    }
})

const regex = /^[a-zA-Z0-9]*$/g;

router.post('/album', function (req, res, next) {
    var id = req.user._id;
    var album_name = req.body.album_name

    if (!album_name.match(regex)) {
        req.flash('error_msg', '相册名只能包含英文字符和数字！');
        return res.redirect('/image/album')
    }

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
    if (next) {
        next();
    }
})

router.post('/delete', function (req, res, next) {
    console.log(req.body)
    var user = req.user
    var album_name = req.body.album_name
    var file_name = req.body.file_name
    var file_path = req.body.file_path
    var up_wechat = 0
    var filetype = ".jpg" //imageFile.name
    filetype = filetype.substring(filetype.lastIndexOf('.'))

    var path_to_image = album_dir + file_path

    let absolute_path = path.resolve(path_to_image)
    delete_image(absolute_path,file_name,album_name,up_wechat,function(err){
        if(err){
            console.log("err "+err)
            req.flash('error_msg','删除图片失败')

        }
        else{
            console.log('delete the image with no err')
            
            req.flash('success_msg','图片删除成功')
            fs.unlink(absolute_path)
        }
        return res.redirect('/image/delete')
    })
    //first delete the database and then delete the file on the server. 
    // send post request to robot server/ get success return value and 
    // fs.unlink (absolute file path)
    if (next) {
        next();
    }
})

module.exports = router