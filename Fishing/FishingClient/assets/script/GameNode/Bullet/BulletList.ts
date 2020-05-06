import GameScene from "../GameScene";
import Bullet from "./Bullet";

export default class BulletList {
    public static readonly Instance: BulletList = new BulletList();
    bulletList = [];
    bulletPool: cc.NodePool = null;
    game: GameScene = null;

    init(game: GameScene){
        this.game = game;
        this.bulletPool = new cc.NodePool();
        console.log("子弹对象池初始化1")
    }

    addBullet(level: number){
        let bullet: cc.Node;
        if (this.bulletPool.size() > 0) {
            bullet = this.bulletPool.get();
        } else {
            bullet = cc.instantiate(this.game.bulletPrefab);
        }

        bullet.getComponent(Bullet).shot(this.game, level)
        this.bulletList[1] = bullet;
    }

    changeFishStatus(){

    }

    despatchBullet(bulletId: number){
        let bullet: cc.Node = this.bulletList[bulletId];
        if (bullet == null) {
            return;
        }

        bullet.stopAllActions();
        bullet.getComponent(Bullet).restInfo();
        this.bulletPool.put(bullet);
        delete this.bulletList[bulletId]
    }
}