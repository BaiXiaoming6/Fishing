import global from "../global";
const {ccclass, property} = cc._decorator;

@ccclass
export default class HallScene extends cc.Component {

    @property(cc.Node)
    roomListLayer: cc.Node = null;

    // onLoad () {}

    start () {
        global.messageController.onJoinRoom = this.onJoinRoom.bind(this);
    }

    onClickGame(){
        this.roomListLayer.active = true;
    }

    onClickBack(){
        this.roomListLayer.active = false;
    }

    onClickRoom(event:string, customData:number){
        let roomType = customData;
        let data = {
            type: roomType
        }
        global.messageController.sendMessage('join-room', data);
    }

    onJoinRoom(){
        global.sceneController.enterGameLayer();
    }
}
