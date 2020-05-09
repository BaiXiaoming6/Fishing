const Room = require("./Room")
const Config = require('./GameConfig')
class RoomController {
    constructor() {
        this._roomList = [];
    }
    createRoom() {
        console.log("服务器自动创建房间");
        //四种类型的房间  默认先每种创建一个
        for (let i = 0; i < 4; i++) {
            let type = i;
            let room = new Room(type, this);
            this._roomList.push(room);
        }
    }

    requestJoinRoom(type, player) {
        let room = this._roomList[type];
        return new Promise((resoles, reject) => {
            if (room) {
                //找到了房间
                let isCanJoin = room.isCanJoin();
                if (isCanJoin === true) {
                    room.addPlayer(player);
                    resoles("加入房间成功");
                } else {
                    reject(isCanJoin);
                }
            } else {
                reject('未找到此房间' + type);
            }
        })

    }
    removeRoom(roomId) {
        for (let i = 0; i < this._roomList.length; i++) {
            let room = this._roomList[i];
            if (room.getId() === roomId) {
                this._roomList.splice(i, 1);
            }
        }
    }
}
module.exports = RoomController;