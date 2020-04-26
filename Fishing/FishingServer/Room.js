const Config = require('./GameConfig')
const CardController = require('./CardController')
class Room {
    constructor(id, data, controller) {
        console.log("创建了新房间 id= ", id);
        console.log("参数=", JSON.stringify(data));
        let roomConfig = Config.RoomConfig;
        this._id = id;
        this._bankerType = data.bankerType;
        this._roundCount = roomConfig.RoundCount[data.roundCountType];
        this._houseCardCount = roomConfig.HouseCardCount[data.roundCountType];
        this._currentRoundNumber = 0;
        this._kouCount = roomConfig.kouCount[data.kouType];
        this._rateConfig = roomConfig.rateConfig[data.rateType];
        console.log("round count = ", this._roundCount);
        console.log("kou count = ", this._kouCount);
        console.log("rate config = ", JSON.stringify(this._rateConfig));
        this._state = 'wait';
        this._playerList = [];
        this._controller = controller;
        this._gameRecordList = [];
    }
    getId() {
        return this._id;
    }
    addPlayer(player) {
        let isHave = false;
        for (let i = 0; i < this._playerList.length; i++) {
            if (player.getId() === this._playerList[i].getId()) {
                isHave = true;
            }
        }
        if (!isHave) {
            this._playerList.push(player);
            player.setCurrentRoom(this);
        }

        this.updateHouseMaster();
    }
    updateHouseMaster() {
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            if (i === 0) {
                player.setHouseMaster(true)
            } else {
                player.setHouseMaster(false);
            }
        }
    }
    getRoomInfo() {
        // let playersInfo = [];
        // for (let i = 0 ; i < this._playerList.length ; i ++){
        //     let info = this._playerList[i].getPlayerInfo();  
        // }

        let roomInfo = {
            roomId: this._id,
            roundCount: this._roundCount,
            kouCount: this._kouCount,
            rateConfig: this._rateConfig,
            bankerType: this._bankerType,
            roomState: this._state,
            currentRoundNumber: this._currentRoundNumber
            // ,
            // playersInfo: playersInfo
        }
        return roomInfo
    }
    isCanJoin(player) {
        if (this._state === 'wait') {
            return true
        } else {
            for (let i = 0; i < this._playerList.length; i++) {
                if (this._playerList[i].getId() === player.getId()) {
                    return true;
                }
            }
            return '房间已经开始，不允许在加入';
        }
    }
    syncAllPlayerInfo() {
        let playerInfoList = [];
        for (let i = 0; i < this._playerList.length; i++) {
            let playerInfo = this._playerList[i].getPlayerInfo();
            playerInfoList.push(playerInfo);
        }
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            player.sendMessage("sync-all-player-info", playerInfoList, 0);
        }

    }
    playerExitRoom(player) {
        let exitResult = '玩家未在房间里面';
        for (let i = 0; i < this._playerList.length; i++) {
            let target = this._playerList[i];
            if (player.getId() === target.getId()) {
                this._playerList.splice(i, 1);
                exitResult = true;
                break;
            }
        }
        this.updateHouseMaster();
        return exitResult;
    }
    playerRequestStartGame(player) {
        let result = true;

        if (player.getId() !== this._playerList[0].getId()) {
            result = "你不是房主，无法开始游戏！";
        }
        if (this._state !== 'wait') {
            result = '游戏已经开始，不能再次开始！';
        }
        if (result === true) {
            this._state = 'starting';
            this.startGame();
            let count = this._houseCardCount;
            this._houseCardCount = 0;
            player.subHouseCardCount(count);
        }


        return result;
    }
    startGame() {
        this._currentRoundNumber++;
        this.changeBanker();
        this.syncCurrentRoundNumber();
        this.pushCard();
    }
    syncCurrentRoundNumber() {
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            player.sendMessage("sync-current-round-number", this._currentRoundNumber, 0);
        }
    }
    pushCard() {
        this._cardList = CardController.getNewPackCard();
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            let handCardList = [];
            for (let i = 0; i < 5; i++) {
                handCardList.push(this._cardList.pop());
            }
            player.sendPushCardMessage(handCardList, this._kouCount);
        }
    }
    changeBanker() {
        let currentBankerIndex = -1;
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            if (player.getIsBanker()) {
                currentBankerIndex = i;
            }
        }

        switch (this._bankerType) {
            case 'banker-type-0':
                //连庄
                if (currentBankerIndex < 0) {
                    currentBankerIndex = 0;
                }
                if (this._playerList[currentBankerIndex].getCurrentWinScore()) {
                    currentBankerIndex++;
                }
                if (currentBankerIndex === this._playerList.length) {
                    currentBankerIndex = 0;
                }

                break;
            case 'banker-type-1':
                //轮庄
                currentBankerIndex++;
                if (currentBankerIndex === this._playerList.length) {
                    currentBankerIndex = 0;
                }

                break;
            case 'banker-type-2':
                //霸王庄
                currentBankerIndex = 0;
                break;
        }
        for (let i = 0; i < this._playerList.length; i++) {
            this._playerList[i].setBanker(false);
        }
        this._playerList[currentBankerIndex].setBanker(true);
        let id = this._playerList[currentBankerIndex].getId();
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            player.sendMessage('change-banker', { bankerId: id }, 0);
        }
    }
    syncRoomState() {
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            player.sendMessage("sync-room-state", this._state, 0);
        }
    }
    playerRequestNotice() {
        let allShowNiu = true;
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            if (!player.getNiuResult()) {
                allShowNiu = false;
            }
        }
        if (allShowNiu) {
            //所有的玩家都显示了牛
            let list = [];
            for (let i = 0; i < this._playerList.length; i++) {
                let player = this._playerList[i];
                list.push({
                    cardInfo: player.getHandCardInfo(),
                    niuResult: player.getNiuResult(),
                    id: player.getId()
                })
            }
            for (let i = 0; i < this._playerList.length; i++) {
                let player = this._playerList[i];
                player.sendMessage('show-all-player-card-info', list, 0);
            }

            this.processWinResult();
            this.processScore();
            let gameRecordList = [];
            for (let i = 0; i < this._playerList.length; i++) {
                let player = this._playerList[i]
                gameRecordList.push({
                    id: player.getId(),
                    nickName: player.getNickName(),
                    cardInfo: player.getHandCardInfo(),
                    niuResult: player.getNiuResult(),
                    winScore: player.getCurrentWinScore(),
                    isBanker: player.getIsBanker(),
                    isHouseMaster: i === 0 ? true : false
                })
            }

            this._gameRecordList.push(gameRecordList);
            setTimeout(() => {
                if (this._roundCount === this._currentRoundNumber) {
                    this.syncGameOverResult();
                    this._state = 'close';
                    this.syncRoomState();
                    this.closeRoom();
                } else {
                    this.reStartGame();
                    this.syncRoomState();
                    this.syncAllPlayerInfo();
                }

            }, 6000);
        } else {
            //还有玩家为显示牛
        }
    }
    closeRoom() {
        this._controller.removeRoom(this._id);
        this._playerList = [];
        this._cardList = [];
    }
    syncGameOverResult() {
        let gameResult = [];
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            gameResult.push({
                id: player.getId(),
                score: player.getTotalScore(),
                nickName: player.getNickName()
            })
        }
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            player.sendGameOverResult(gameResult);
            player.saveGameInfoToDB({
                id: player.getId,
                roomId: this._id,
                gameResult: gameResult,
                gameRecordList: this._gameRecordList
            } );
        }
    }
    reStartGame() {
        this._state = 'wait';
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            player.reStartGame();
        }
    }
    processWinResult() {
        let ColorValueConfig = {
            "spade": 4,
            "heart": 3,
            "club": 2,
            "diamond": 1
        }
        let NiuValueConfig = {
            'wuniu': 0,
            'niu1': 1,
            'niu2': 2,
            'niu3': 3,
            'niu4': 4,
            'niu5': 5,
            'niu6': 6,
            'niu7': 7,
            'niu8': 8,
            'niu9': 9,
            'niuniu': 10
        }
        let banker = undefined;
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            if (player.getIsBanker()) {
                banker = player;
            }
        }
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            if (player.getId() === banker.getId()) {
                continue;
            }
            let playerNiuName = player.getNiuName();
            let bankerNiuName = banker.getNiuName();
            let playerVlaue = NiuValueConfig[playerNiuName];
            let bankerValue = NiuValueConfig[bankerNiuName];
            let result = '';
            if (playerVlaue > bankerValue) {
                console.log("玩家的牛大")
                result = 'win';
            } else if (playerVlaue < bankerValue) {
                console.log("庄家的牛大")

                result = 'fail';
            } else {
                console.log("牛一样大")
                let playerMaxCard = player.getMaxCard();
                let bankerMaxCard = banker.getMaxCard();
                if (playerMaxCard.getNumber() > bankerMaxCard.getNumber()) {
                    console.log("玩家的牌大");
                    result = 'win';
                } else if (playerMaxCard.getNumber() < bankerMaxCard.getNumber()) {
                    console.log('庄家的牌大');
                    result = 'fail';
                } else {
                    let playerColor = playerMaxCard.getColor();
                    let banerColor = bankerMaxCard.getColor();
                    result = ColorValueConfig[playerColor] > ColorValueConfig[banerColor] ? "win" : "fail";
                    console.log("牌的值相等");
                }
            }
            player.setGameResult(result);

        }
    }
    processScore() {
        let banker = undefined;
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            if (player.getIsBanker()) {
                banker = player;
            }
        }
        let bankerScore = 0;
        let resultList = [];
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            if (player.getId() === banker.getId()) {
                continue;
            }
            let result = player.getGameResult();
            let score = 0;
            let niuName = '';
            if (result === 'win') {
                score = player.getChooseScore();
                niuName = player.getNiuName();
            } else {
                score = -1 * player.getChooseScore();
                niuName = banker.getNiuName();
            }
            let rate = 1;
            if (this._rateConfig[niuName]) {
                rate = this._rateConfig[niuName];
            };
            let endScore = score * rate;
            player.addScore(endScore);
            bankerScore -= endScore;
            resultList.push({
                id: player.getId(),
                score: endScore,
                nickName: player.getNickName(),
                isBanker: 'false'
            })
        }
        banker.addScore(bankerScore);
        resultList.push({
            id: banker.getId(),
            score: bankerScore,
            nickName: banker.getNickName(),
            isBanker: 'true'
        });
        for (let i = 0; i < this._playerList.length; i++) {
            let player = this._playerList[i];
            player.sendMessage('show-result', resultList, 0);
        }

    }
}
module.exports = Room;