import userMgr from "./userMgr";
import NetUtil from "./NetUtil";
import Utils from "./Utils";


export default class gameNetMgr {
    public static readonly Instance: gameNetMgr = new gameNetMgr()
    dataEventHandler = null
    roomId = null;
    conf = null;
    seats = null;
    seatIndex = 0;
    isOver = null;
    gamePeNum = null;
    token = null;

    connectGameServer(data) {
        if (data != null) {
            userMgr.Instance.socketData = data;
            NetUtil.Instance.ip = data.ip + ":" + data.port;
        }
        this.token = data.token
        var self = this;
        var onConnectOK = function () {
            console.log("onConnectOK");
            var sd = {
                token: data.token,
                roomid: data.roomid,
                userid: userMgr.Instance.userId,
                coins: userMgr.Instance.coins,
                time: data.time,
                sign: data.sign,
            };
            NetUtil.Instance.send("login", sd);
        };

        var onConnectFailed = function () {
            console.log("failed.");

        };
        // cc.vv.wc.show("正在进入房间");
        NetUtil.Instance.connect(onConnectOK, onConnectFailed);
    }
    getSeatIndexByID(userId) {
        for (var i = 0; i < this.seats.length; ++i) {
            var s = this.seats[i];
            if (s.userid == userId) {
                return i;
            }
        }
        return -1;
    }
     
    getSelfData() {
        return this.seats[this.seatIndex];
    }
    getseatData(seatIndex) {
        return this.seats[seatIndex];
    }
    getLocalIndex(index) {
        var ret = 0;

        ret = (index - this.seatIndex + 4) % 4;

        return ret;
    }
    initHandlers() {
        NetUtil.Instance.addHandle("login_finished", function (data) {
            console.log("login_finished")

            cc.director.loadScene("game")
        })
        let self = this
        NetUtil.Instance.addHandle("login_result", (data) => {
            console.log("login_result")
            Utils.Instance.netResponseLog("login_result", data)
            if (data.errcode === 0) {
                var data = data.data;
                self.roomId = data.roomid;
                self.conf = data.conf;
                self.seats = data.seats;
                self.seatIndex = self.getSeatIndexByID(userMgr.Instance.userId);
                self.isOver = false;
                self.gamePeNum = data.conf.renshu;

            }
            else {
                console.log(data.errmsg);
            }

        })
        NetUtil.Instance.addHandle("new_user_comes_push", (data) => {
            Utils.Instance.netResponseLog("new_user_comes_push", data)
            var seatIndex = data.seatindex;
            self.seats[seatIndex].userid = data.userid;
            self.seats[seatIndex].online = data.online;
            self.seats[seatIndex].score = data.score;
            self.seats[seatIndex].seatindex = data.seatindex;
            var needCheckIp = false;
            if (self.seats[seatIndex].userid > 0) {

                self.seats[seatIndex].name = data.name;
                if (self.seats[seatIndex].ip != data.ip) {

                    needCheckIp = true;
                }
            }


            this.dispatchEvent("new_user", self.seats[seatIndex])
        })
        NetUtil.Instance.addHandle("exit_notify_push", (data) => {
            console.log(data)
            this.dispatchEvent("exit_notify_push", data)
        })

        NetUtil.Instance.addHandle("SUB_S_USER_FIRE", (data) => {
            Utils.Instance.netResponseLog("SUB_S_USER_FIRE", data)
            //{userId: 2, chairId: 0, bulletId: 1, fireAngle: -49.99374398582339}
            this.dispatchEvent('SUB_S_USER_FIRE', data)
        })
        NetUtil.Instance.addHandle("build_fish_reply", (data) => {
            // {fishKind: 13, trace: Array(4), speed: 3, fishId: "10459580", activeTime: 1579053459580}
            Utils.Instance.netResponseLog("build_fish_reply", data)
            this.dispatchEvent('build_fish_reply', data)
        })
        NetUtil.Instance.addHandle("build_fishArray_reply", (data) => {
            Utils.Instance.netResponseLog("build_fishArray_reply", data)
        })
        NetUtil.Instance.addHandle("SUB_S_CATCH_FISH", (data) => {
            Utils.Instance.netResponseLog("catch_S_fish", data)
            this.dispatchEvent('catch_S_fish', data)
        })
    }
    // readyGame(){
    //     NetUtil.Instance.send("ready", sd);
    // }
    user_fire(level, degress ) {
        // (new Date().getTime()) % 600000
        var sd = {
            token: this.token,
            bulletId: this.seatIndex + (new Date().getTime()) % 600000,
            fireAngle: degress,
            bulletKind: level,
           

        };
        NetUtil.Instance.send("SUB_C_USER_FIRE", sd);
    }
    catchFish(bulletId:Number,bulletLevel:Number,fishId:Number){
        var sd = {
            token: this.token,
            bulletLevel:bulletLevel,
            bulletId:bulletId,
            fishId:fishId
        }
        NetUtil.Instance.send("SUB_C_CATCH_FISH", sd);
    }
    exitGame() {
        NetUtil.Instance.send("user_exit")
    }
    dispatchEvent(event, data) {
        if (this.dataEventHandler) {
            this.dataEventHandler.emit(event, data);
        }
    }
}