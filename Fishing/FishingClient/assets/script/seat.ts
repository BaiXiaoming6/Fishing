import Utils from "./Utils";
import Weapon from "./weapon";
import gameNetMgr from "./gameNetMgr";
import Bullet from "./bullet";
import BulletList from "./BulletList"; 

const { ccclass, property } = cc._decorator;

@ccclass
export default class Seat extends cc.Component {

    userid = null
    score = null
    name = null
    online = null
    seatindex = null

    joinNode: cc.Node = null;
    moneyNode: cc.Node = null;
    lb_money: cc.Label = null;
    weaponNode: cc.Node = null;
    cannonplus: cc.Node = null;
    cannomminus: cc.Node = null;
    weaponSc: Weapon = null
    paotai: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.joinNode = this.node.getChildByName("join")
        this.moneyNode = this.node.getChildByName("money_bg")
        this.lb_money = this.moneyNode.getChildByName("Label").getComponent(cc.Label)
        this.paotai = this.node.getChildByName("paotai")

    }

    start() {

    }
    init(seat) {
        if (this.paotai == null) {
            Utils.Instance.addPrefab((ret) => {
                if (ret) {


                    this.setInfo(seat)
                }
                else {
                    console.log("炮塔加载失败")
                }


            }, this.node, "prefab/game/paotai")
        }
        else {
            this.setInfo(seat)
        }
    }
    resetInfo() {
        this.joinNode.active = true
        this.moneyNode.active = false
        this.userid = null
        this.score = null
        this.name = null
        this.online = null
        this.seatindex = null
        this.lb_money.string = ''
        if (this.cannomminus) {
            this.cannomminus.active = false
        }
        if (this.cannonplus) {
            this.cannonplus.active = false
        }
        if (this.paotai) {
            this.paotai.active = false
        }
    }
    setInfo(seat) {
        this.userid = seat.userid;
        this.score = seat.score;
        this.name = seat.name;
        this.online = seat.online;
        this.seatindex = seat.seatindex;
        this.joinNode.active = false;
        this.moneyNode.active = true;
        this.paotai = this.node.getChildByName("paotai");
        this.paotai.active = true;
        this.weaponNode = this.paotai.getChildByName("weapon");
        this.weaponSc = this.weaponNode.getComponent(Weapon);
        this.cannonplus = this.paotai.getChildByName("cannonplus");
        this.cannomminus = this.paotai.getChildByName("cannomminus");
        if (this.seatindex == gameNetMgr.Instance.seatIndex) {
            this.cannomminus.active = true;
            this.cannonplus.active = true;
        }
        this.lb_money.string = seat.score;
    }
    changeScore(val){
        this.score =  Number(this.score)+  val
        this.lb_money.string = this.score;
    }
    getWeaponPos() {
        return this.weaponNode.position;
    }
    shot(level, degress,bulletId,score ) {


        let bottom = false

        this.weaponNode.angle = -degress

        if (this.seatindex == 0 || this.seatindex == 2) {
            bottom = true
        }
        if (this.weaponSc.curLevel != level) {
            this.weaponSc.curLevel = level
            this.weaponSc.setLevel()
        }
        this.changeScore(score)
        let weaponSit = this.weaponNode.parent.convertToWorldSpaceAR(this.weaponNode.getPosition());
        let radian = cc.misc.degreesToRadians(degress)

        let bpos = cc.v2(weaponSit.x + 50 * Math.sin(radian), weaponSit.y + 50 * Math.cos(radian))
        if (bottom == false) {

            radian = -radian;
            bpos = cc.v2(weaponSit.x + 50 * Math.sin(radian), weaponSit.y - 50 * Math.cos(radian))
        }
        BulletList.Instance.addBullet(level, bottom, radian, bpos, degress,bulletId,this.userid)
        // bullet.getComponent(Bullet).shot(game, level, bottom, radian, bpos, degress,bulletId,this.userid)
    }
    // update (dt) {}
}
