import GameScene from "../GameScene";
import BulletList from "./BulletList";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    @property(cc.Float)
    speed:number = 800;
    @property(cc.Float)
    power:number = 4;
    @property([cc.String])
    bulletSp = ["Bullet1_Normal_1_b","Bullet1_Normal_2_b","Bullet2_Normal_3_b","Bullet2_Normal_4_b","Bullet3_Normal_5_b","Bullet3_Normal_6_b"]
    bulletLevel: number = 1;
    radian: number = 0;
    time: number = 2;
    bounce:number = 1;
    bulletId:number = -1;
    userId: number = -1;

    game: GameScene;

    /* 
        game: 场景脚本
        level: 炮弹等级
        bottom: 炮塔位置
        radian: 炮弹运行弧度
        bpos: 炮弹坐标
        degress: 炮弹角度
     */
    shot(game: GameScene, level: number){
        this.game = game;
        this.bulletLevel = level;
        this.bounce = 1;
        let sit = game.seatList[game.mySeat];
        let gun = game.seatList[game.mySeat].getChildByName("paotai");
        
        this.node.getComponent(cc.Sprite).spriteFrame = this.game.bulletAtlas.getSpriteFrame(this.bulletSp[this.bulletLevel - 1]);
        let weaponSit = this.node.convertToNodeSpaceAR(sit.getPosition());
        let angle = gun.getChildByName('weapon').angle;
        this.radian = cc.misc.degreesToRadians(angle);
        

        let offsetX = 50
        let offsetY = 50;
        if ((game.mySeat + 1) % 2 == 0) {
            offsetX = 0;
            offsetY = -65;
            this.bounce = -1;
            this.radian = -this.radian;
            angle = 180 + angle;
        }

        this.node.angle = angle;
        let pos = cc.v3(weaponSit.x + offsetX * Math.sin(-this.radian), weaponSit.y + offsetY * Math.cos(this.radian), 999);
        this.node.position = pos;

        this.time = 2
        
    }

    restInfo(){
        this.bulletLevel = 1;
        this.radian = 0
        this.time =  2
        this.bounce =1
        this.userId =-1
        this.bulletId =-1
    }

    changeCollider(){
        let collder = this.node.getComponent(cc.BoxCollider);
        collder.size = this.node.getContentSize();
    }

    onLoad () {

    }

    start () {

    }

    update (dt) {
        let bx = this.node.x;
        let by = this.node.y;
        if (this.time > 0) {
            if (bx > cc.winSize.width / 2 || bx < -cc.winSize.width / 2) {
                this.radian = -this.radian;
                this.node.angle = -this.node.angle;
                this.time--;
            } else if(by > cc.winSize.height / 2) {
                this.node.angle = 180 - this.node.angle;
                this.bounce = -1
                this.time--;
            } else if(by < -300){
                this.node.angle = 180 - this.node.angle;
                this.bounce = 1;
                this.time--;
            }
        }
        bx += dt * this.speed * Math.sin(-this.radian);
        by += dt * this.speed * Math.cos(this.radian) * this.bounce;
        this.node.position = cc.v3(bx, by);
        if (bx > cc.winSize.width + 100 || bx < -100 || by > cc.winSize.height + 100 || by < 0) {
            BulletList.Instance.despatchBullet(this.bulletId);
        }
    }

    onCollisionEnter(other:cc.Collider, self){
        console.log(self,"self")
        let pos = self.world.points;
        console.log(pos,"撞击子弹位置")
        let posNet = pos[0].add(pos[3]).mul(0.5);
        this.game.createNet(posNet);
        this.node.destroy();
    }
}
