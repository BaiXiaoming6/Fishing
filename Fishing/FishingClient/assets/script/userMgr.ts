import CHttp from './CHttp';

var names = [
    "上官",
    "欧阳",
    "东方",
    "端木",
    "独孤",
    "司马",
    "南宫",
    "夏侯",
    "诸葛",
    "皇甫",
    "长孙",
    "宇文",
    "轩辕",
    "东郭",
    "子车",
    "东阳",
    "子言",
];

var names2 = [
    "雀圣",
    "赌侠",
    "赌圣",
    "稳赢",
    "不输",
    "好运",
    "自摸",
    "有钱",
    "土豪",
];

export default class userMgr {
    public static readonly Instance: userMgr = new userMgr();
    account = null
    sign = null
    coins = null
    exp = null
    gems = null
    ip = null
    lv = null
    userName = null
    sex = null
    userId = null
    socketData = null
    lat = null
    lng = null
    address = null;
    guestAuth(account) {
        CHttp.httpGet("/guest", { "account": account }, (ret) => {
            console.log(ret)
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            } else {
                this.account = ret.account;
                this.sign = ret.sign;
                CHttp.Url = "http://" + ret.halladdr
                this.login();

            }


        })
    }

    login() {
        var self = this;
        var onLogin = function (ret) {
            if (ret.errcode > 0) {
                console.log(ret.errmsg);
            }
            else {
                if (ret.errcode == -1) {
                    //jump to register user info.
                    console.log("userid is null");
                    var idx = Math.floor(Math.random() * (names.length - 1));
                    var idx2 = Math.floor(Math.random() * (names2.length - 1));
                    self.create(names[idx] + names2[idx2])
                }
                else {
                    console.log(ret);
                    self.account = ret.account;
                    self.userId = ret.userid;
                    self.userName = ret.name;
                    self.lv = ret.lv;
                    self.exp = ret.exp;
                    self.coins = ret.coins;
                    self.gems = ret.gems;
                    self.sex = ret.sex;
                    self.ip = ret.ip;
                    cc.director.loadScene("hall");
                }
            }
        };
        console.log("正在登录游戏");
        let data = { account: this.account, sign: this.sign }
        CHttp.httpGet("/login", data, onLogin);
    }

    create(name) {
        var self = this;
        var onCreate = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }
            else {
                self.login();
            }
        };

        var data = {
            account: this.account,
            sign: this.sign,
            name: name
        };
        CHttp.httpGet("/create_user", data, onCreate);
    }
}