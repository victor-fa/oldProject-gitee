var UserGroup = require('../models/user_group')

module.exports.ensureManagerPrivilege = (req, res, next) => {
    var user = res.locals.user
    if (user && GroupPolicy.accessToManagePanel(user.group)) {
        return next()
    } else {
        res.redirect('/')
    }
}

module.exports.accessToManagePanel = (group) => {
    if (group >= UserGroup.MANAGER)
        return true
    return false
} 

module.exports.getUserGroupName = function (user_group) {
    return UserGroup[user_group]
}
