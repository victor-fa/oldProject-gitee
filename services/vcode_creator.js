var svgCaptcha = require('svg-captcha');

module.exports.createVcode=function(){
    var codeConfig = {
        size: 4,// 验证码长度
        ignoreChars: '0o1itIla', // 验证码字符中排除 0o1i
		noise: 2, // 干扰线条的数量
		fontSize:30,
		//color:true,
		height: 34,
		width:120
		//background:"#333"
    }
    var captcha = svgCaptcha.create(codeConfig);
    var codeText=captcha.text.toLowerCase();
    //req.session.captcha 
    var codeData =captcha.data;
    return {
        codeText:codeText,
        codeData:codeData
    };
	//res.send(codeData);
}