import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { log } from 'util';
import { md5 } from '../duihua/md5';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
    @Input()
    items: any[] = [];

    bot_endpoint: string;
    bot_download: string;
    win7Url: string;
    win10Url: string;
    appkey: string;
    appsecret: string;
    nickname: string;
    uid: string;
    win7 = 0;
    win10 = 0;

    @ViewChild('mainScreen') elementView: ElementRef;
    viewHeight: number;
    morethan400 = false;    // 124
    morethan720 = false;    // 50
    morethan1024 = false;   // 25

    constructor(
    ) {
        this.bot_endpoint = 'https://robot-service.centaurstech.com/api/chat';
        this.bot_download = 'https://robot-service.centaurstech.com/download';
        this.win7Url = 'http://app.qiwu.ai/v071918_WordInput_windows7_10.zip';
        this.win10Url = 'http://app.qiwu.ai/v0806_LongSpeechInput_windows10.zip';
        this.appkey = 'zhihuishenghuo-pro-web';
        this.appsecret = '065e75a666034566711ca55b33e3cf37';
        this.nickname = '小朋友';
    }

    ngOnInit(): void {
        this.uid = this.getCookie('uid')
        if (this.uid === '') {
            this.uid = Math.random() + ''
            this.setCookie('uid', this.uid, 100)
        }

        const that = this

        $('.chat-input').keydown(function (e) {
            if (e.keyCode === 13) {
                const question = $('.chat-input').val();
                $('.chat-input').val('');

                that.ask_question(question)
            }
        })

        this.getCount();

        // this.viewHeight = this.elementView.nativeElement.offsetWidth;
        this.viewHeight = window.screen.width;
        this.changeHeight(this.viewHeight);

        this.send_hello()
    }

    submitMsg(): void {
        console.log('123');
        const question = $('.chat-input').val();
        $('.chat-input').val('');
        this.ask_question(question)
    }

    changeHeight(viewHeight): void {
        if (viewHeight < 450) {
            this.heightToFalse();
            this.morethan400 = true;
        } else if (viewHeight < 720) {
            this.heightToFalse();
            this.morethan720 = true;
        } else {
            this.heightToFalse();
            this.morethan1024 = true;
        }
    }

    heightToFalse() {
        this.morethan400 = false;
        this.morethan720 = false;
        this.morethan1024 = false;
    }

    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    downloadWin7(): void {
        // 跳转下载
        window.open(this.win7Url);
        this.addCountForWin7();
        setTimeout(() => {
            this.getCount();
        }, 500);
    }

    downloadWin10(): void {
        // 跳转下载
        window.open(this.win10Url);
        this.addCountForWin10();
        setTimeout(() => {
            this.getCount();
        }, 500);
    }

    addCountForWin7() {
        $.ajax({
            url: this.bot_download + '/addCountForWin7',
            type: 'GET',
            success: function (data, status) {
                console.log(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log('error');
            },
        })
    }

    addCountForWin10() {
        $.ajax({
            url: this.bot_download + '/addCountForWin10',
            type: 'GET',
            success: function (data, status) {
                console.log(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log('error');
            },
        })
    }

    getCount() {
        let tempWin7 = 0;
        let tempWin10 = 0;
        $.ajax({
            url: this.bot_download + '/getCount',
            type: 'GET',
            success: function (data, status) {
                tempWin7 = data[0].countForWin7;
                tempWin10 = data[0].countForWin10;
                console.log(data[0]);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr + '===' + ajaxOptions + '===' + thrownError + '===');
                console.log('error');
            },
        })
        setTimeout(() => {
            this.win7 = tempWin7;
            this.win10 = tempWin10;
        }, 2000);
    }

    public saveExcel(data: Response, name: string) {
        const a = document.createElement('a');
        const blob = new Blob([data], { 'type': 'application/zip;charset=UTF-8' });
        a.href = URL.createObjectURL(blob);
        a.download = name + '.zip';
        a.click();
    }

    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
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
            success: function (data, status) {
                if (data.msg != "") {
                    that.on_receive_answer(data.msg)

                    if (typeof data.data != "undefined")
                        that.on_recieve_data(data.data)
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("Status: " + xhr.status)
                console.log(thrownError)
                that.on_receive_error(xhr.status)

            },
        })
    }

    on_send_question(ask) {
        const fontSize = this.morethan400 ? '250%' : this.morethan720 ? '160%' : this.morethan1024 ? '160%' : '160%';
        $('<li _ngcontent-c1 class="me-message">\
            <span _ngcontent-c1 class="me-message-content"\
            style="font-size: ' + fontSize + '">' + ask + '</span>\
        </li>').appendTo(".chat-list");

        $(".chat-list").scrollTop($(".chat-list")[0].scrollHeight);
    }

    replace_all(target: string, search: string, replacement: string): string {
        return target.replace(new RegExp(search, 'g'), replacement)
    }

    on_receive_answer(reply) {
        reply = this.replace_all(reply, '\n', '<br />')
        const fontSize = this.morethan400 ? '250%' : this.morethan720 ? '160%' : this.morethan1024 ? '160%' : '160%';
        $('<li _ngcontent-c1 class="qw-message">\
            <div _ngcontent-c1 class="qw-avator"></div>\
            <div _ngcontent-c1 class="qw-message-content"\
             style="font-size: ' + fontSize + '">' + reply + '</div>\
        </li>').appendTo(".chat-list");
        $(".chat-list").scrollTop($(".chat-list")[0].scrollHeight);
    }

    on_recieve_data(data) {
        $(".chat-data").text(JSON.stringify(data, null, 4))
    }

    send_hello() {
        this.ask_question('你是谁呀')
    }

}
