import { Component, OnInit } from '@angular/core';
import {md5} from './md5';

@Component({
    selector: 'app-duihua',
    templateUrl: './duihua.component.html',
    styleUrls: ['duihua.component.scss']
})
export class DuihuaComponent implements OnInit {

    bot_endpoint:string;

    appkey:string;
    appsecret:string;

    nickname:string;

    uid:string;

    constructor() {
        this.bot_endpoint = 'https://robot-service.centaurstech.com/api/chat';
        this.appkey = 'sample-duihua';
        this.appsecret = '546588913f3c83600757b12a2a690c0d';
        this.nickname = '小朋友';
    }

    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    
    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    
    on_receive_error(statusCode) {
        alert("信息输入错误！服务器返回代码:" + statusCode)
    }

    ask_question(msg) {
        this.on_send_question(msg)
    
        var fd = new FormData()
        fd.append('appkey', this.appkey)
        var now = Date.now()
        fd.append('timestamp', now.toString())
        fd.append('uid', this.uid)
        let hash = md5(this.appsecret + this.uid + now)
        fd.append('verify', hash)
        fd.append('msg', msg)
        fd.append('nickname', this.nickname)

        var that = this
    
        $.ajax({
            url: this.bot_endpoint,
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            success: function(data, status) {
                if (data.msg != "") {
                    that.on_receive_answer(data.msg)
    
                if (typeof data.data != "undefined")
                    that.on_recieve_data(data.data)
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log("Status: " + xhr.status)
                console.log(thrownError)
                that.on_receive_error(xhr.status)
    
            },
        })
    }

    on_send_question(ask) {
        $('<li class="me-message">\
            <span class="me-message-content">' + ask + '</span>\
        </li>').appendTo(".chat-list");

        $(".chat-list").scrollTop($(".chat-list")[0].scrollHeight);
    }

    replace_all(target:string, search:string, replacement: string): string {
        return target.replace(new RegExp(search, 'g'), replacement)
    }

    on_receive_answer(reply) {
        reply = this.replace_all(reply, '\n', '<br />')
        $('<li class="qw-message">\
            <div class="qw-avator"></div>\
            <div class="qw-message-content">' + reply + '</div>\
        </li>').appendTo(".chat-list");
        $(".chat-list").scrollTop($(".chat-list")[0].scrollHeight);
    }

    on_recieve_data(data) {
        $(".chat-data").text(JSON.stringify(data, null, 4))
    }

    send_hello() {
        this.ask_question('你好')
    }

    ngOnInit(): void {
        this.uid = this.getCookie('uid')
        if (this.uid == '') {
            this.uid = Math.random() + ''
            this.setCookie('uid', this.uid, 100)
        }

        var that = this
        
        $(".chat-input").keydown(function(e) {
            if (e.keyCode == 13) {
                var question = $(".chat-input").val();
                $(".chat-input").val("");
    
                that.ask_question(question)
            }
        })

        this.send_hello()
    } 
    
}
