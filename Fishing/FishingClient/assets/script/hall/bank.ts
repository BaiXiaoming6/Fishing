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
export default class NewClass extends cc.Component {
    @property(cc.Node)
     quNode:cc.Node = null

     @property(cc.Node)
     cunNode:cc.Node =null

     @property(cc.Toggle)
     quTog:cc.Toggle=null;
     @property(cc.Toggle)
     cunTog:cc.Toggle =null;
    start () {

    }
    close()
    {
        this.node.active = false
    }
    changeNode()
    {
        if (this.quTog.isChecked ==true) {
            this.quNode.active =true
            this.cunNode.active = false
        } else {
            this.quNode.active =false
            this.cunNode.active = true
        }
    }
    // update (dt) {}
}
