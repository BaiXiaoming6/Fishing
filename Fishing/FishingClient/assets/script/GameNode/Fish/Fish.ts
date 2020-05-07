import GameScene from "../GameScene";
import { FishType, FishState } from "./FishType";
import Bullet from "../Bullet/Bullet";
import FishList from "./FishList";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Fish extends cc.Component {
    bezier1: cc.Vec2[] = [cc.v2(50, -100), cc.v2(300, -400), cc.v2(1800, -650)];
    bezier2: cc.Vec2[] = [cc.v2(100, -200), cc.v2(400, -300), cc.v2(1800, -600)];
    bezier3: cc.Vec2[] = [cc.v2(150, -300), cc.v2(600, -400), cc.v2(1800, -500)];
    bezier4: cc.Vec2[] = [cc.v2(50, 50), cc.v2(400, 100), cc.v2(1800, 200)];
    bezier5: cc.Vec2[] = [cc.v2(80, 200), cc.v2(300, 500), cc.v2(1800, 650)];
    bezier6: cc.Vec2[] = [cc.v2(100, 100), cc.v2(350, 400), cc.v2(1800, 500)];
    bezier7: cc.Vec2[] = [cc.v2(100, 2), cc.v2(350, -2), cc.v2(1800, 0)];
    bezierArray = [this.bezier1,this.bezier2,this.bezier3,this.bezier4,this.bezier5,this.bezier6,this.bezier7]

    lastPos:cc.Vec2=null;
    game : GameScene=null;
    name: string =""
    hp:number;
    gold:number;
    fishState :FishState
    data=null
    fishId :number
    traceid =1;
    onLoad () {}

    start () {
        
    }

    // init(game:GameScene,data ){
    //     this.traceid =1
    //     console.log(data,"-----data")
    //     this.data = data
    //     this.fishId = data.fishId
    //     this.game = game;
    //     if(this.game.fishTypes==null)
    //     {
    //         return
    //     }
    //     // let fishType = this.getFishName(data.name)
        
    //     this.name = data.name;
    //     this.hp = data.hp;
    //     this.gold =data.gold;
    //     this.fishState = FishState.alive 
    //     // this.node.position = cc.v2(data.trace[0][0],data.trace[0][1])
    //     this.lastPos = this.node.getPosition()
    //     this.node.getComponent(cc.Sprite).spriteFrame = this.game.fishAtlas.getSpriteFrame("fishMove_"+this.name+"_01")
    //     this.node.getComponent(cc.Animation).play("fishMove"+this.name)

    //     // let index = Math.floor(Math.random()*this.bezierArray.length)
    //     this.fishRun()
    //     // this.changeCollider();
    // }
    init(game:GameScene,fishType:FishType ){
        this.game = game;
        this.name = fishType.name;
        this.hp = fishType.hp;
        this.gold =fishType.gold;
        this.fishState = FishState.alive 
        this.lastPos = this.node.getPosition()
        this.node.getComponent(cc.Sprite).spriteFrame = this.game.fishAtlas.getSpriteFrame("fishMove_"+this.name+"_01")
        this.node.getComponent(cc.Animation).play("fishMove"+this.name)

        let index = Math.floor(Math.random()*this.bezierArray.length)
        let action = cc.bezierBy(Math.random()*10 +10,this.bezierArray[index])
        this.node.runAction(action)
        // this.changeCollider();
    }

    getFishName(id){
        return this.game.fishTypes[id]
    }

    fishRun(){
        let pos = []
        for (let i = 0; i < this.data.trace.length; i++) {
            pos.push(cc.v2(this.data.trace[i][0],this.data.trace[i][1]))
                
        }
        let action = cc.bezierTo(this.data.speed*3,pos)
        let self = this
        let cb =  cc.callFunc(()=>{
            FishList.Instance.despawnFish(self.node)
        })
        let acf =cc.sequence(action,cb)
        this.node.runAction(acf)
        this.traceid++
    }

    update (dt) {
        let curPos = this.node.getPosition()
        if ( this.lastPos == null) {
            this.lastPos =this.node.getPosition()
        }
        if (Math.abs(this.lastPos.sub(curPos).mag())<1) {
            
            return
        }
        let degree = - cc.misc.radiansToDegrees(Math.atan((curPos.y- this.lastPos.y)/(curPos.x - this.lastPos.x))) + 90
        if (curPos.x - this.lastPos.x <0) {
            this.node.angle = 180 -degree;
        }
        else{
            this.node.angle = -degree;
        }
        
        this.lastPos = curPos;
    }
    despawnFish(seatIndex)
    {
        if(this.fishState != FishState.dead){
            this.fishState = FishState.dead
            this.node.stopAllActions();
            let anim = this.node.getComponent(cc.Animation)
            // this.game.addCoin(this.gold)
            anim.play("fishDead"+this.name)
            anim.on("finished",()=>{
                if(this.node.parent != null){
                    console.log("object")
                    let pos = this.node.parent.convertToWorldSpaceAR(this.node.position)
                    // this.game.creatCoin(pos,seatIndex)
                    // this.game.createCoinUp(pos,this.gold)
                    // this.game._seat[seatIndex].changeScore(score)
                }
                // this.node.destroy();
                FishList.Instance.despawnFish(this.fishId)
            },this)
        }
        // if(this.node.x > ( cc.winSize.width/2 +100) || this.node.x < (- cc.winSize.width/2 -500)||this.node.y> (cc.winSize.height/2 +100) || this.node.y < (-cc.winSize.height/2 -200)){
        //     this.node.destroy();
        // }
        this.data = null
    }
    onCollisionEnter (other:cc.Collider, self) {
        // let bullet = <Bullet>other.node.getComponent(Bullet)
        // this.hp -= bullet.getActValue();
        // if( this.hp<=0)
        // {
        //     this.fishState = FishState.dead;
        // }
        console.log("鱼被击中")
    }
    changeCollider(){
        let collider = this.node.getComponent(cc.BoxCollider)
        collider.size = this.node.getContentSize()
    }
    restInfo(){
        this.lastPos=null;
        this.name =""
        this.hp =0
        this.gold=0 
        this.data=null
        this.fishId =0
        this.traceid =1;
    }
}
