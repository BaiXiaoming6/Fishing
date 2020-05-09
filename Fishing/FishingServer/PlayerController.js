const Player = require('./Player');
class PlayerController {
    constructor(db, roomController) {
        this._playerList = [];
        this._db = db;
        this._roomController = roomController;
    }
    playerLogin(account, password, client) {
        return new Promise((resole, reject) => {
            for (let i = 0; i < this._playerList.length; i++) {
                let player = this._playerList[i];
                // if (player.getId() === id) {
                //座位号不等于0说明在房间中
                // console.log(player, "----------player")
                if (player._seat !== 0 & player._nickName == account) {
                    player.reConnect(client);
                    resole(player.getPlayerInfo());
                    console.log(player.getPlayerInfo(), "----------断线重连玩家信息")
                    return;
                }
                // }
            }
            this._db.getUserInfo(account, password).then((result) => {
                console.log(result, "鸡毛")
                if (result.err) {
                    //账号密码不匹配
                    resole(result);
                    return
                }
                if (result.length > 0) {
                    //已有账号 进入游戏
                    let id = result[0].id
                    let player = new Player(id, result[0], client, this);
                    this._playerList.push(player);
                    resole(result[0]);
                } else {
                    // reject('无此用户');
                    //存入玩家信息
                    this._db.setUserInfo(account, password).then((result) => {
                        resole(result);
                    });
                }
            });
        })
    }
    getRoomController() {
        return this._roomController;
    }
    getDB() {
        return this._db;
    }
}
module.exports = PlayerController;