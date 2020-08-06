var UserGroup = require('../models/user_group')

module.exports.ensureManagerPrivilege = (req, res, next) => {
    var user = res.locals.user
    if (user && module.exports.accessToManagePanel(user.group)) {
        return next()
    } else {
        res.redirect('/')
    }
}

module.exports.accessToGallery = (req, res, next) => {
    var root_uri = '/gallery/'
    var album = req.originalUrl.replace(root_uri, '')
    if (album.indexOf('gallery.css') != -1 || req.originalUrl.endsWith('.jpg')) {
        return next()
    }
    
    var user = res.locals.user
    if (user.group >= UserGroup.MANAGER)
        return next()
    if (album.indexOf('/') != -1)
        album = album.substring(0, album.indexOf('/'))
    album = album.replace(user.username + "_", "")
    if (user.albums.indexOf(album) != -1)
        return next()
    req.flash('error_msg', '您没有访问该相册的权限')
    res.redirect('/image/album')
}

module.exports.accessToManagePanel = (group) => {
    if (group >= UserGroup.MANAGER)
        return true
    return false
} 

module.exports.accessToImagePanel = (group) => {
    if (group >= UserGroup.EDITOR)
        return true
    return false
} 

module.exports.getUserGroupName = function (user_group) {
    return UserGroup[user_group]
}
