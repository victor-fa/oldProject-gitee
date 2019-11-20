var express = require('express');
var router = express.Router();
var UserService = require('../services/user');

// Login
router.post('/check',function(req,res,next){
	var user_info={
		username:req.body.username,
		password:req.body.password
	};
	var final_result={
		status:200,
		retcode:0,
		msg:"SUCCESS",
		data:{}
	};
	if(!user_info.username||!user_info.password){
		final_result.retcode=-1;
		final_result.msg="必要参数缺失！";
		res.json(final_result);
	}else{
		UserService.getUserByUsername(user_info.username, function (err, user) {
			if (err) {
				final_result.retcode=-2;
				final_result.msg="服务端错误！"
				res.json(final_result);
			}else if (!user) {
				final_result.retcode=-3;
				final_result.msg='用户不存在！';
				res.json(final_result);
			}else{
				UserService.comparePassword(user_info.password, user.password, function (err, isMatch) {
					if (err) {
						final_result.retcode=-4;
						final_result.msg='登陆错误！';
					}else if (isMatch) {
						if(!UserService.isUserCheckByEmail(user.group)){
							final_result.msg='请进入您输入的邮箱进行验证';
							final_result.retcode=-5;
						} else{
							if (!UserService.isUserActivated(user.activation)) {
								final_result.msg='邮箱已验证，但用户未激活，请联系对接人员';
								final_result.retcode=-6;
							}else{
								final_result.data=user;
							}
						}
					} else {
						final_result.msg="密码错误！";
						final_result.retcode=-7;
					}
					res.json(final_result);
				});
			}
		});
	}
});

module.exports = router;
