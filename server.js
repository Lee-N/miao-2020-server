let express = require("express");
let app = new express();
let path =require("path");
let session=require("express-session");
let cookieparser=require("cookie-parser")
let nodemailer=require("nodemailer")
app.use(express.static("public"))
// 配置
let transporter = nodemailer.createTransport({
    // 使用qq发送邮件
    // 更多请查看支持列表：https://nodemailer.com/smtp/well-known/
    service: 'QQ',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用了 SSL
    auth: {
        user: '',
        pass: '',
    }
});
app.use(session({
    secret:"lee",		//设置签名秘钥  内容可以任意填写
    cookie:{maxAge:60*1000},		//设置cookie的过期时间，例：80s后session和相应的cookie失效过期
    resave:true,			//强制保存，如果session没有被修改也要重新保存
    saveUninitialized:false		//如果原先没有session那么久设置，否则不设置
}))
app.get('/sendMail',function (req,res) {
    console.log("收到发邮件请求")
    let code=""
    for(let i=0;i<4;i++){
        code+=parseInt(Math.random()*10)
    }
    console.log(code)
    req.session.code=code
    req.session.time=new Date().getTime()

    // 发送邮件

    let mailOptions = {
        from: '707678047@qq.com', // login user must equal to this user
        // 接收邮件的地址
        to: "2417247878@qq.com", // xrj0830@gmail.com
        // 邮件主题
        subject: "李哒哒给你发验证码啦",
        // 以HTML的格式显示，这样可以显示图片、链接、字体颜色等信息
        text:"验证码:"+code
    };

    transporter.sendMail(mailOptions, (error, info = {}) => {
        if (error) {
            return console.log(error);
        }
        console.log('邮件已发送');

    });

    let json={"flag":0}
    res.write(req.query.callback + '(' + JSON.stringify(json) + ')')
    res.end()
})
app.get('/check',function (req,res) {
    console.log("收到检查请求")
    let flag=0
    let json={}
    //检查是否超时1min
    if(!req.session.time){
        flag=2
    }else{
        let code=req.query.code
        if(code==req.session.code){
            flag=0
        }
        else{
            flag=1
        }
    }
    json={"flag":flag}
    res.write(req.query.callback + '(' + JSON.stringify(json) + ')')
    res.end()
})
let server = app.listen(8888, function () {
    console.log(server.address().address, +server.address().port);
})