import GameSc from "./gameSc";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Net extends cc.Component {

    @property(cc.Animation)
    anim: cc.Animation = null;

    game:GameSc
   init(pos:cc.Vec2,game:GameSc){
    this.game = game;
    this.node.position = game.node.convertToNodeSpaceAR(pos)
    this.node.parent = game.node;
    this.anim.play('net')
    this.anim.on('finished',this.despawnNet,this)
   }
   despawnNet(){
    this.game.despawnNet(this.node)
   }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
