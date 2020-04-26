import global from "../global";
const {ccclass, property} = cc._decorator;

@ccclass
export default class HallScene extends cc.Component {

    @property(cc.Node)
    roomListLayer: cc.Node = null;
  
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onClickGame(){
        this.roomListLayer.active = true;
    }

    onClickBack(){
        this.roomListLayer.active = false;
    }

    onClickRoom(event:string, customData:number){
        let roomType = customData;
        global.sceneController.enterGameLayer();
    }
}
