const Room = require("./Room")
const Config = require('./GameConfig')
class RoomController {
    constructor() {
        this._roomList = [];
    }
    createRoom(data, player) {
        console.log("room controller create room", JSON.stringify(data));
        // return new Promise(()=>{

        //     new room = new Room(id,data);
        // })
        return new Promise((resolse, reject) => {
            let houseCardCost = Config.RoomConfig.HouseCardCount[data.roundCountType];
            console.log("house card cost", houseCardCost);
            let houseCardCount = player.getHouseCardCount();
            if (houseCardCost > houseCardCount) {
                reject('房卡不够，创建房间失败');
            } else {
                this.getNewRoomId().then((id) => {
                    console.log("new room id = ", id);
                    let room = new Room(id, data, this);
                    this._roomList.push(room);
                    resolse(id);
                })
            }
        })
    }
    getNewRoomId() {
        const getStr = (cb) => {
            let str = '';
            //112233 ,123456
            for (let i = 0; i < 6; i++) {
                str += Math.round(Math.random() * 9);
            }
            for (let i = 0; i < this._roomList.length; i++) {
                let room = this._roomList[i];
                if (room.getId() === str) {
                    //已经存在此id
                    getStr(cb);
                    return;
                }
            }
            if (cb) {
                cb(str);
            }
        }
        return new Promise((resolse) => {
            getStr(resolse);
        });
    }
    requestJoinRoom(roomId, player) {
        let target = undefined;
        for (let i = 0; i < this._roomList.length; i++) {
            let room = this._roomList[i];
            if (room.getId() === roomId) {
                //存在这个房间
                target = room;
                break;
            }
        }
        return new Promise((resolse, reject) => {
            if (target) {
                //找到了房间
                let isCanJoin = target.isCanJoin(player);
                if (isCanJoin === true) {
                    target.addPlayer(player);
                    resolse('加入房间成功');
                } else {
                    reject(isCanJoin);
                }

            } else {
                reject('未找到此房间' + roomId);
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