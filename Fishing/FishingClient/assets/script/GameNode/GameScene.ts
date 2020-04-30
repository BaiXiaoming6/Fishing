
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property([cc.Node])
    seatList: cc.Node[] = [];
    @property(cc.Prefab)
    paoTaiPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.node_TOUCH_START, this)
    }

    start () {
        this.addPlayer()
    }

    update (dt) {}


    //屏幕点击事件
    node_TOUCH_START(event: cc.Event.EventTouch){
        let weaponPos = this.seatList[0].getChildByName("paotai");
        
    }


    //有玩家进入房间
    addPlayer(){
        let paoTai = cc.instantiate(this.paoTaiPrefab)
        paoTai.parent = this.seatList[0]
        console.log(paoTai.x)
    }
}
