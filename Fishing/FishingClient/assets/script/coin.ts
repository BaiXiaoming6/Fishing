import GameSc from "./gameSc";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Coin extends cc.Component {

    @property(cc.Animation)
    anim:cc.Animation = null;
    game : GameSc
    init(pos:cc.Vec2,topos:cc.Vec2,game:GameSc){
        this.game = game;
        this.node.position = pos;
        this.node.parent = cc.director.getScene();
        let spawn = cc.spawn(cc.moveTo(0.8,topos),cc.scaleTo(0.8,0.5))
        let cb =  cc.callFunc(this.despawnCoin,this)
        let acf =cc.sequence(spawn,cb)
        this.node.runAction(acf)
        this.anim.play('coin')
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    despawnCoin(){
        this.game.despawnCoin(this.node);
    }
    start () {

    }

    // update (dt) {}
}
