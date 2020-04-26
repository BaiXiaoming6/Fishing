class Player {
    constructor(id, spec, client, controller) {
        this._id = id;
        this._nickName = spec.nickname;
        this._housecardCount = spec.housecard_count;
        this._client = client;
        this._headImageUrl = spec.head_image_url;
        this._controller = controller;
        this._room = undefined;
        this._isHouseMaster = false;
        this._isBanker = false;
        this._currentScore = 0;
        this._totalScore = 0;
        this._handCardList = [];
        this._niuResult = undefined;
        this._gameResult = undefined;
        this._isOnline = undefined;
        this._currentWinScore = 0;
        this._isRequestNotice = false;
        this.resgisterMessage(client);
    }
    getNickName() {
        return this._nickName;
    }
    setBanker(value) {
        this._isBanker = value;
    }
    getIsBanker() {
        return this._isBanker;
    }
    resgisterMessage(client) {
        console.log("注册消息");
        this._isOnline = true;
        client.on("close", () => {
            console.log("客户端断开了链接");
            this._isOnline = false;
            this.autoProcess();
            if (this._room) {
                this._room.syncAllPlayerInfo();
            }
        });
        client.on("text", (result) => {
            console.log("玩家发来了消息", JSON.stringify(result));
            let messgae = JSON.parse(result);
            let type = messgae.type;
            let data = messgae.data;
            let callBackId = messgae.callBackId;
            switch (type) {
                case 'create-room':
                    this._controller.getRoomController().createRoom(data, this).then((roomId) => {
                        console.log("create room success");
                        this.sendMessage(type, { roomId: roomId }, callBackId);
                    }).catch((err) => {
                        this.sendMessage(type, { err: err }, callBackId);
                    });
                    break;
                case 'join-room':
                    console.log("客户端发来了 ，加入房间的消息 ", JSON.stringify(data));
                    this._controller.getRoomController().requestJoinRoom(data.roomId, this).then((result) => {
                        console.log("加入房间成功", JSON.stringify(result));
                        this.sendMessage(type, '加入房间成功', callBackId);
                    }).catch((err) => {
                        console.log("加入房间失败", err);
                        this.sendMessage(type, { err: err }, callBackId);
                    });
                    break;
                case 'request-room-info':
                    //
                    let roomInfo = this._room.getRoomInfo();
                    this.sendMessage(type, roomInfo, callBackId);
                    this._room.syncAllPlayerInfo();
                    console.log("this hand card info", JSON.stringify(this._handCardInfo));
                    if (this._handCardInfo !== undefined) {
                        // this.sendMessage
                        this.sendMessage('push-card', this._handCardInfo, 0);
                    }
                    if (this._niuResult !== undefined) {
                        this.sendMessage("sync-niu-info", this._niuResult, 0);
                    }
                    break;
                case 'exit-room':
                    if (this._room !== undefined) {
                        this._room.playerExitRoom(this);
                        this.sendMessage(type, true, callBackId);
                        this._room.syncAllPlayerInfo();
                        this._room = undefined;
                        this._handCardInfo = undefined;
                        this._isBanker = false;
                        this._currentScore = 0;
                        this._totalScore = 0;
                        this._niuResult = undefined;
                    } else {
                        this.sendMessage(type, { err: "玩家未在房间里面" }, callBackId);
                    }
                    // let exitResult = this._room.playerExitRoom(this);
                    // console.log("退出房间", exitResult);
                    // if (exitResult === true) {
                    //     this.sendMessage(type, exitResult, callBackId);
                    //     this._room.syncAllPlayerInfo();
                    //     this._room = undefined;
                    //     this._handCardInfo = undefined;
                    //     this._isBanker = false;
                    //     this._currentScore = 0;
                    //     this._totalScore = 0;
                    //     this._niuResult = undefined;
                    // } else {
                    //     this.sendMessage(type, { err: exitResult }, callBackId);
                    // }
                    break;
                case 'requet-start-game':
                    let startResult = this._room.playerRequestStartGame(this);
                    if (startResult === true) {
                        this.sendMessage(type, startResult, callBackId);
                        this._room.syncRoomState();
                    } else {
                        this.sendMessage(type, { err: startResult }, callBackId);
                    }
                    break;
                case 'choose-score':
                    let score = data.score;
                    this._currentScore = score;
                    if (this._room) {
                        this._room.syncAllPlayerInfo();
                        this.sendMessage(type, "发送成功", callBackId);
                        this.sendShowAllCardsMessage();
                    } else {
                        this.sendMessage(type, { err: "房间不存在" }, callBackId);
                    }
                    break;
                case "request-notice":
                    //
                    if (this._handCardList.length === 0) {
                        this.sendMessage(type, { err: "手里无牌" }, callBackId)
                    } else {
                        let result = this.processNiuNiu();
                        this._niuResult = result;
                        this.sendMessage(type, result, callBackId);
                        this._isRequestNotice = true;
                        if (this._room) {
                            this._room.playerRequestNotice();
                        }
                    }
                    break;
                case "add-one-house-card":
                    this.addOneHouseCard().then(() => {
                        this.sendMessage(type, { houseCardCount: this._housecardCount }, callBackId);
                    })
                    break;
                case 'request-game-record':
                    let db = this._controller.getDB();
                    db.getPlayerGameRecord(this._id).then((result) => {
                        this.sendMessage(type, result, callBackId);
                    }).catch((err) => {
                        this.sendMessage(type, { err: err }, callBackId);
                    });
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
        if (this._handCardList.length === 0) {
            return;
        }
        if (this._currentScore === 0 && !this._isBanker) {
            this._currentScore = 1;
            this._room.syncAllPlayerInfo();
            this.sendShowAllCardsMessage();
        }
        let result = this.processNiuNiu();
        this._niuResult = result;
        if (!this._isRequestNotice) {
            this._room.playerRequestNotice();
        }
    }
    addOneHouseCard() {

        this._housecardCount++;
        let db = this._controller.getDB();
        return db.updateHouseCardCount(this._id, this._housecardCount);

    }
    processNiuNiu() {
        console.log("计算牛几");
        let list = this._handCardList;
        // 1,2,3
        // 1,2,4
        // 1,2,5
        // 1,3,4
        // 1,3,5,
        // 1,4,5
        // 2,3,4
        // 2,3,5
        // 2,4,5
        // 3,4,5
        let i = 0;
        let allList = [];
        while (i < 3) {
            let k = i + 1;
            while (k < list.length - 1) {
                let n = k + 1;
                while (n < list.length) {
                    let endList = [list[i], list[k], list[n]];
                    allList.push(endList);
                    n++;
                }

                k++
            }
            i++;
        }
        // console.log("all list = ", JSON.stringify(allList));
        let niuList = [];
        for (let i = 0; i < allList.length; i++) {
            let sum = 0;
            let preList = allList[i];
            for (let j = 0; j < preList.length; j++) {
                let number = preList[j].getNumber();
                // console.log("number =", number);
                sum += number > 10 ? 10 : number;
            }
            // console.log("sum = ", sum);
            if (sum % 10 === 0) {
                console.log("找到牛了", JSON.stringify(preList));
                niuList = preList;
            }
        }

        let sum = 0;
        let indexList = [];
        if (niuList.length > 0) {
            for (let i = 0; i < niuList.length; i++) {
                indexList.push(niuList[i].getHandIndex());
            }
            console.log("index list = ", JSON.stringify(indexList));
            // this._handCardList.splice(index, 1);
            indexList = indexList.sort((a, b) => {
                return b - a;
            });

            console.log("index list = ", JSON.stringify(indexList));
            let cardList = [];
            for (let i = 0; i < this._handCardList.length; i++) {
                cardList.push(this._handCardList[i]);
            }
            for (let i = 0; i < indexList.length; i++) {
                cardList.splice(indexList[i], 1);
            }
            console.log("card list = ", JSON.stringify(cardList));
            for (let i = 0; i < cardList.length; i++) {
                let number = cardList[i].getNumber();
                sum += number > 10 ? 10 : number;
            }
            console.log("sum = ", sum);
            sum = sum % 10;
        }

        let result = {
            value: sum,
            indexList: indexList

        }
        return result;
    }
    setHouseMaster(value) {
        this._isHouseMaster = value;
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
        let currentRoomId = "";
        if (this._room) {
            currentRoomId = this._room.getId();
        }
        return {
            id: this._id,
            nickname: this._nickName,
            housecard_count: this._housecardCount,
            headImageUrl: this._headImageUrl,
            isHouseMaster: this._isHouseMaster,
            roomId: currentRoomId,
            isBanker: this._isBanker,
            currentScore: this._currentScore,
            totalScore: this._totalScore,
            isOnline: this._isOnline
        }
    }
    sendPushCardMessage(handCardList, kouCount) {
        if (!this._isBanker) {
            for (let i = 0; i < kouCount; i++) {
                handCardList[handCardList.length - 1 - i].setShow(false);
            }
        }
        let cardInfoList = [];
        for (let i = 0; i < handCardList.length; i++) {
            handCardList[i].setHandIndex(i);
            cardInfoList.push(handCardList[i].getInfo());
        }
        this._handCardList = handCardList;
        this._handCardInfo = cardInfoList;
        this.sendMessage('push-card', cardInfoList, 0);
        this.autoProcess();
    }
    sendShowAllCardsMessage() {
        for (let i = 0; i < this._handCardList.length; i++) {
            this._handCardList[i].setShow(true);
        }
        let cardInfoList = [];
        for (let i = 0; i < this._handCardList.length; i++) {
            cardInfoList.push(this._handCardList[i].getInfo());
        }
        this._handCardInfo = cardInfoList;
        this.sendMessage('push-card', cardInfoList, 0);
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
    getNiuResult() {
        return this._niuResult;
    }
    getHandCardInfo() {
        let list = [];
        for (let i = 0; i < this._handCardList.length; i++) {
            let card = this._handCardList[i];
            list.push(card.getInfo())
        }
        return list;
    }
    getNiuName() {
        let niuResult = this._niuResult;
        let value = niuResult.value;
        let indexList = niuResult.indexList;
        if (indexList.length === 0) {
            return 'wuniu';
        }
        if (value === 0) {
            return 'niuniu';
        }
        return 'niu' + value;
    }
    getMaxCard() {
        let handCard = this._handCardList;
        let target = undefined;
        let maxNumber = 0;
        for (let i = 0; i < handCard.length; i++) {
            let card = handCard[i];
            let number = card.getNumber();
            if (number > maxNumber) {
                maxNumber = number;
                target = card;
            }
        }
        return target;
    }
    setGameResult(result) {
        console.log("玩家的游戏结果", result);
        this._gameResult = result;
    }
    getGameResult() {
        return this._gameResult;
    }
    getChooseScore() {
        return this._currentScore;
    }
    addScore(score) {
        this._currentWinScore = score;
        this._totalScore += score;
    }
    reStartGame() {
        this._currentScore = 0;
        this._handCardList = [];
        this._niuResult = undefined;
        this._gameResult = undefined;
        this._handCardInfo = undefined;
        this.sendMessage("re-start-game", "", 0);
    }
    getTotalScore() {
        return this._totalScore;
    }
    sendGameOverResult(data) {
        this.sendMessage('sync-game-over-result', data, 0);
        this._room = undefined;
        this._handCardList = [];
        this._handCardInfo = undefined;
        this._niuResult = undefined;
        this._gameResult = undefined;
        this._currentScore = 0;
        this._totalScore = 0;
        this._currentWinScore = 0;
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
    getCurrentWinScore() {
        return this._currentWinScore;
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