var UserGroup = {
    GUEST: -1,
    USER: 0,
    EDITOR: 2,
    MANAGER: 4,
    ADMIN: 6,
}

var GroupName = {}

for (var group in UserGroup) {
    GroupName[UserGroup[group]] = group
}

Object.assign(UserGroup, GroupName)

module.exports = UserGroup
