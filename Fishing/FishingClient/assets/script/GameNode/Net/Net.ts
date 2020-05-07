import GameSc from "../GameScene";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Net extends cc.Component {

    @property(cc.Animation)
    anim: cc.Animation = null;

    game:GameSc
    init(pos:cc.Vec3, game:GameSc){
        this.game = game;
        this.node.position = game.node.convertToNodeSpaceAR(pos)
        this.node.parent = game.node;
        this.anim.play('net')
        this.anim.on('finished',this.depositNet,this)
    }
    depositNet(){
        this.game.depositNet(this.node)
    } 
    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
