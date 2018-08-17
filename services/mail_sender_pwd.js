var nodemailer = require('nodemailer');
var config = require('config');
//发送激活邮件

module.exports.sendEmailPwd =function(userEmail,pwd){
    var email_config = config.get('activation_email');
    var smtp = `smtps://${email_config.username}:${email_config.password}@${email_config.domain}`;
    var transporter = nodemailer.createTransport(smtp);

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"Monitor Plugin" '+`${email_config.username}`, // sender address        
        to: userEmail, // list of receivers
        subject: "齐悟后台系统密码重置", // Subject line
        html: "您的新密码为："+pwd // html body
    };

    var callback=function(error, info){
        if(error){
            console.log(error)
            console.log("邮件发送失败");
            return;
        }
        console.log('Message sent: ' + info.response);
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, callback);
}