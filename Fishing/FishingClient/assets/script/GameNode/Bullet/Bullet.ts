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
        this.node.getComponent(cc.Sprite).spriteFrame = this.game.bulletAtlas.getSpriteFrame(this.bulletSp[this.bulletLevel - 1]);
        let weaponSit = game.seatList[0].convertToNodeSpaceAR(game.seatList[0].getPosition());
        let angle = game.seatList[0].angle;
        this.radian = cc.misc.degreesToRadians(angle);
        this.node.angle = angle;
        let pos = cc.v3(weaponSit.x + 50 * Math.sin(this.radian), weaponSit.y +50 * Math.cos(this.radian), 999);
        this.node.position = pos;
        this.node.setParent(game.mainNode);

        // this.time = 2;
        // this.radian = radian;
        // this.node.angle = degress;
        
        // this.bulletLevel = level;
        // this.userId = userId;
        // this.bulletId = bulletId;
        // this.node.getComponent(cc.Sprite).spriteFrame = this.game.bulletAtlas.getSpriteFrame(this.bulletSp[this.bulletLevel - 1]);
        // this.changeCollider();
        // if (bottom) {
        //     this.bounce = 1;
        // } else {
        //     this.bounce = -1;
        //     this.node.angle = -(180 - this.node.angle);
        // }
        // this.node.position = bpos;
        // console.log(radian,"------------radian")
        // console.log(bpos,"------------bpos")
        // console.log(degress,"------------degress")
        // this.node.parent = cc.director.getScene();
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

    // update (dt) {
    //     let bx = this.node.x;
    //     let by = this.node.y;
    //     if (this.time > 0) {
    //         if (bx > cc.winSize.width || bx < 0) {
    //             this.radian = -this.radian;
    //             this.node.angle = -this.node.angle;
    //             this.time--;
    //         } else if(by > cc.winSize.height) {
    //             this.node.angle = 180 - this.node.angle;
    //             this.bounce = -1
    //             this.time--;
    //         } else if(by < 30){
    //             this.node.angle = -this.node.angle;
    //             this.bounce = 1;
    //             this.time--;
    //         }
    //     }
    //     bx += dt * this.speed * Math.sin(this.radian);
    //     by += dt * this.speed * Math.cos(this.radian) * this.bounce;
    //     this.node.position = cc.v3(bx, by);
    //     if (bx > cc.winSize.width + 100 || bx < -100 || by > cc.winSize.height + 100 || by < 0) {
    //         BulletList.Instance.despatchBullet(this.bulletId);
    //     }
    // }
}
