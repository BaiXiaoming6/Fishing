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
export default class CoinUp extends cc.Component {

    @property(cc.Animation)
    anim:cc.Animation=null;
    @property(cc.SpriteAtlas)
    atlas:cc.SpriteAtlas =null;
    @property(cc.Sprite)
    num1:cc.Sprite =null;
    @property(cc.Sprite)
    num2:cc.Sprite = null;

    game:GameSc
    init(pos:cc.Vec2,num:number,game:GameSc){
        this.game = game;
        let str = num.toString();
        if (str.length == 1) {
            this.num1.spriteFrame = this.atlas.getSpriteFrame("goldnum_0")
            this.num2.spriteFrame = this.atlas.getSpriteFrame("goldnum_"+str[0])
        } else {
            this.num1.spriteFrame = this.atlas.getSpriteFrame("goldnum_"+ str[0])
            this.num2.spriteFrame = this.atlas.getSpriteFrame("goldnum_"+ str[1])
        }
        this.node.position = pos;
        this.node.parent = cc.director.getScene();
        this.anim.play('coinUp')
        this.anim.on('finished',this.despawn,this)
    }
    despawn(){
        this.game.despawCoinUp(this.node)
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
