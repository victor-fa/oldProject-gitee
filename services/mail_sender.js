var nodemailer = require('nodemailer');
var config = require('config');
//发送激活邮件

module.exports.sendEmail =function(params){
    // params={
    //     title:"xxx",
    //     content:"xxx",
    //     user_info:{
    //        email:"xxx",
    //        username:"xxx",
    //        hash:"xxx"
    //     }
    //     callback:function(){}
    // }
    var email_config = config.get('activation_email');
    var smtp = `smtps://${email_config.username}:${email_config.password}@${email_config.domain}`;
    var transporter = nodemailer.createTransport(smtp);
    
    var content_prefix="激活链接\n";
    var content_body=config.get('deploy_domain_name')+"/users/activate_by_email?user="+params.user_info.username+"&h_id="+encodeURIComponent(params.user_info.hash);
    var title=params.title||"齐悟后台系统注册帐号激活";
    var content=params.content||(content_prefix+content_body);

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"Monitor Plugin" '+`${email_config.username}`, // sender address        
        to: params.user_info.email, // list of receivers
        subject: title, // Subject line
        //text: content, // plaintext body
        html: content // html body
    };

    var callback=params.callback||function(error, info){
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