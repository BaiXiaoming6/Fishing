const Config = require('./GameConfig')
const CardController = require('./CardController')
class Room {
    constructor(type, controller) {
        console.log("创建了新房间 type= ", type);
        let roomConfig = Config.RoomConfig;
        this._type = roomConfig[type];
        this._playerList = [];
        this._controller = controller;
    }

    //添加一个玩家
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
            player.setSeat(this._playerList.length);
        }
    }

    //房间是否满员
    isCanJoin() {
        if (this._playerList.length === 4) {
            return '房间已经满员';
        }
        return true;
    }

    //有玩家退出房间
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
        return exitResult;
    }

    //同步房间所有玩家信息
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
}
module.exports = Room;