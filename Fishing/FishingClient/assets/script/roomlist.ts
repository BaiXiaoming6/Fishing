import CHttp from "./CHttp";
import userMgr from "./userMgr";
import gameNetMgr from "./gameNetMgr";
const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    onLoad() {
        cc.director.preloadScene("game")
        cc.director.preloadScene("hall")
    }

    start() {
        cc.director.preloadScene("game")
    }
    back() {
        cc.director.loadScene("hall")
    }
    fish() {

        let data = { "roomType": 0, "account": userMgr.Instance.account, sign: userMgr.Instance.sign, }
        var onCreate = function (ret) {
            if (ret.errcode !== 0) {

                console.log("创建房间失败,错误码:" + ret.errcode);

            }
            else {
                gameNetMgr.Instance.connectGameServer(ret)

            }

        }
        CHttp.httpGet("/enter_room", data, onCreate)
        // cc.director.loadScene("game")
    }
    // update (dt) {}
}
