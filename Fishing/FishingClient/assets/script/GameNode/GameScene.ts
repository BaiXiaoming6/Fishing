import Utils from "./../Utils";
import BulletList from "./Bullet/BulletList"
import Bullet from "./Bullet/Bullet";
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property(cc.Node)
    mainNode: cc.Node = null;
    @property([cc.Node])
    seatList: cc.Node[] = [];
    @property(cc.Prefab)
    paoTaiPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;
    @property(cc.SpriteAtlas)
    bulletAtlas: cc.SpriteAtlas = null;

    onLoad () {
        BulletList.Instance.init(this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.node_TOUCH_START, this)
    }

    start () {
        this.addPlayer()
    }

    update (dt) {}


    //屏幕点击事件
    node_TOUCH_START(event: cc.Event.EventTouch){
        console.log("发射炮弹")
        let gun = this.seatList[0].getChildByName("paotai")
        let weaponPos = gun.position;
        let touchPos = gun.parent.convertToNodeSpaceAR(event.getLocation());
        let radian = Math.atan((touchPos.x - weaponPos.x) / (touchPos.y - weaponPos.y));
        let degress = cc.misc.radiansToDegrees(radian);
        gun.getChildByName('weapon').angle = -degress;
        console.log(degress,"-----------角度")
        let level = 1;
        let weaponSit = touchPos;
        let bpos = cc.v3(weaponSit.x + 50 * Math.sin(radian), weaponSit.y + 50 * Math.cos(radian), 9999)
        // BulletList.Instance.addBullet(level)
        let bullet = cc.instantiate(this.bulletPrefab);
        bullet.getComponent(Bullet).shot(this, 1);
    }

    userFire(data: object){
    }


    //有玩家进入房间
    addPlayer(){
        let paoTai = cc.instantiate(this.paoTaiPrefab)
        paoTai.parent = this.seatList[0]
        console.log(paoTai.x)
    }
}
