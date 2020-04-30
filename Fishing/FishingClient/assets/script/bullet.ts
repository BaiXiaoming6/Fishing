import GameSc from "./gameSc";
import gameNetMgr from "./gameNetMgr";
import Fish from "./fish";
import BulletList from "./BulletList";
import { FishState } from "./fishType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    @property(Number)
    speed: number =800;
    @property(Number)
    power:number = 4
    @property([cc.String])
    bulletSp=["Bullet1_Normal_1_b","Bullet1_Normal_2_b","Bullet2_Normal_3_b","Bullet2_Normal_4_b","Bullet3_Normal_5_b","Bullet3_Normal_6_b"]
    bulletLevel:number = 1;
    game:GameSc
    radian :number = 0
    time :number=  2
    bounce:number =1
    userid:number =-1
    bulletId:number =-1
    /**
     * 发射炮弹
     * @param game 场景脚本
     * @param level 炮弹等级
     * @param bottom 炮塔位置
     * @param radian 炮弹运行弧度
     * @param bpos 炮弹坐标
     * @param degress 炮弹角度
     */
    shot(game:GameSc,level:number, bottom:boolean, radian:number,bpos:cc.Vec2,degress:number,bulletId:number,userid:number){
    this.time =2 
        this.radian = radian
        this.node.rotation = degress
        this.game = game
        this.bulletLevel = level;
        this.userid = userid;
        this.bulletId = bulletId;
        this.node.getComponent(cc.Sprite).spriteFrame = this.game.bulletAtlas.getSpriteFrame(this.bulletSp[this.bulletLevel-1])
        this.changeCollider();
        if(bottom ){
            this.bounce= 1
        }
        else
        {
            this.bounce= -1
            this.node.rotation =  -(180 - this.node.rotation);
        }
      
        this.node.position = bpos;
        this.node.parent = cc.director.getScene();
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    restInfo(){
        this.bulletLevel = 1;
        this.radian = 0
        this.time =  2
        this.bounce =1
        this.userid =-1
        this.bulletId =-1
    }
    changeCollider(){
        let collider = this.node.getComponent(cc.BoxCollider)
        collider.size = this.node.getContentSize()
    }
     update (dt) {
        let bx = this.node.x;
        let by =this.node.y;
        if (this.time>0) {
            if (bx> cc.winSize.width || bx< 0) {
                this.radian = -this.radian;
                this.node.rotation =  - this.node.rotation
                this.time--
            }
            else if(by >cc.winSize.height){
                this.node.rotation = 180 - this.node.rotation;
                this.bounce=  -1
                this.time--
            }
            else if(by <30){
                this.node.rotation = -this.node.rotation
                this.bounce = 1
                this.time--
            }
        }
        bx += dt *this.speed * Math.sin(this.radian)
        by += dt * this.speed * Math.cos(this.radian) * this.bounce
        this.node.position = cc.v2(bx,by)
        if(bx> cc.winSize.width + 100|| bx< -100|| by>cc.winSize.height+100 || by< 0){
            // this.node.destroy();
            BulletList.Instance.despawnBullet(this.bulletId)
        }
     }
     getActValue(){
         return this.power * this.bulletLevel;
     }
     catchFish(fishId){
        gameNetMgr.Instance.catchFish(this.bulletId ,this.bulletLevel,fishId)
     }
     onCollisionEnter (other:cc.Collider, self) {
         if (this.userid == gameNetMgr.Instance.getSelfData().userid) {
             let fish = <Fish>other.node.getComponent(Fish)
            if (fish.fishState!= FishState.dead) {
                this.catchFish(fish.fishId)
            }
            
         }
         let posb = self.world.points
         let posNet = posb[0].add(posb[3]).mul(0.5)
         this.game.createNet(posNet)
        //  this.node.destroy();
        BulletList.Instance.despawnBullet(this.bulletId)
     }
}
