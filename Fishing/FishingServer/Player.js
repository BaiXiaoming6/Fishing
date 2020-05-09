class Player {
    constructor(id, spec, client, controller) {
        this._id = id;
        this._nickName = spec.nickname;
        this._housecardCount = spec.housecard_count;
        this._client = client;
        this._headImageUrl = spec.head_image_url;
        this._controller = controller;
        this._room = undefined;
        this._seat = 0;
        this._isOnline = undefined;
        this.resgisterMessage(client);
    }
    getNickName() {
        return this._nickName;
    }
    setSeat(value) {
        this._seat = value;
    }
    getSeat() {
        return this._seat;
    }
    resgisterMessage(client) {
        console.log("注册消息");
        this._isOnline = true;
        client.on("close", () => {
            console.log("客户端断开了链接");
            this._isOnline = false;
            // this.autoProcess();
            // if (this._room) {
            //     this._room.syncAllPlayerInfo();
            // }
        });
        client.on("text", (result) => {
            console.log("玩家发来了消息", JSON.stringify(result));
            let messgae = JSON.parse(result);
            let type = messgae.type;
            let data = messgae.data;
            let callBackId = messgae.callBackId;
            switch (type) {
                case 'join-room':
                    console.log("客户端发来了 ，加入房间的消息 ", JSON.stringify(data));
                    this._controller.getRoomController().requestJoinRoom(data.type, this).then((result) => {
                        console.log("加入房间成功", JSON.stringify(result));
                        this.sendMessage(type, "加入房间成功", callBackId);
                    }).catch((err) => {
                        console.log("加入房间失败", err);
                        this.sendMessage(type, { err: err }, callBackId);
                    });
                    break;
                case 'request-room-info':
                    this._room.syncAllPlayerInfo();
                    break;
                case 'exit-room':
                    if (this._room !== undefined) {
                        this._room.playerExitRoom(this);
                        this.sendMessage(type, true, callBackId);
                        this._room.syncAllPlayerInfo();
                        this._room = undefined;
                    } else {
                        this.sendMessage(type, { err: "玩家未在房间里面" }, callBackId);
                    }
                    break;
                case "add-one-house-card":
                    this.addOneHouseCard().then(() => {
                        this.sendMessage(type, { houseCardCount: this._housecardCount }, callBackId);
                    })
                    break;
                default:
                    break;
            }
        });
    }
    autoProcess() {
        //自动处理
        if (!this._room) {
            return;
        }
        if (this._isOnline) {
            return;
        }
    }
    addOneHouseCard() {
        this._housecardCount++;
        let db = this._controller.getDB();
        return db.updateHouseCardCount(this._id, this._housecardCount);
    }

    setCurrentRoom(room) {
        this._room = room;
    }
    getId() {
        return this._id;
    }
    reConnect(client) {
        console.log("断线重连", this._id);
        this._client = client;
        this.resgisterMessage(client);
    }
    getPlayerInfo() {
        return {
            id: this._id,
            nickname: this._nickName,
            housecard_count: this._housecardCount,
            headImageUrl: this._headImageUrl,
            seat: this._seat,
            isOnline: this._isOnline
        }
    }

    sendMessage(type, data, callBackId) {
        if (!this._isOnline) {
            return;
        }
        this._client.send(JSON.stringify({
            type: type,
            data: data,
            callBackId: callBackId
        }))
    }

    subHouseCardCount(count) {
        if (count > 0) {
            this._housecardCount -= count;
            let db = this._controller.getDB();
            db.updateHouseCardCount(this._id, this._housecardCount).then(() => {
                console.log("更新房卡数成功");
            }).catch((err) => {
                console.log("更新房卡数失败", err);
            });
        }
    }
    getHouseCardCount() {
        return this._housecardCount;
    }

    saveGameInfoToDB(data) {
        console.log("保存游戏数据到 数据库", JSON.stringify(data));
        let db = this._controller.getDB();
        db.savePlayerGameInfo(this._id, data).then(() => {
            console.log("储存数据成功");
        }).catch((err) => {
            console.log("储存数据失败", err);
        });
    }

}
module.exports = Player