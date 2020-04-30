import GameSc from "./gameSc";
import Bullet from "./bullet";


export default class BulletList{
    public static readonly Instance :BulletList = new BulletList();
    bulletList =[]
    bulletPool:cc.NodePool = null;
    game:GameSc =null;
    init(game){
        this.game = game;
        this.bulletPool = new cc.NodePool()
    }
    addBullet(level, bottom, radian, bpos, degress,bulletId, userid){
        let bullet :cc.Node
        if(this.bulletPool.size()>0){
            bullet = this.bulletPool.get()
        }   
        else{
            bullet = cc.instantiate(this.game.bulletPre)
        }
        
        bullet.getComponent(Bullet).shot(this.game, level, bottom, radian, bpos, degress,bulletId, userid)
        this.bulletList[bulletId] = bullet
    }

    changeFishStaus(data){
        let bullet:cc.Node = this.bulletList[data.bulletId]
        if (bullet ==null) {
            return
        }
        
    }
    despawnBullet(bulletId){
        let bullet:cc.Node = this.bulletList[bulletId]
        if (bullet ==null) {
            return
        }
       
        bullet.stopAllActions();
        bullet.getComponent(Bullet).restInfo()
        this.bulletPool.put(bullet)
        delete this.bulletList[bulletId]
    }
}