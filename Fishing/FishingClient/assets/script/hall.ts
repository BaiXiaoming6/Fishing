import userMgr from "./userMgr";

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
export default class Hall extends cc.Component {

    @property(cc.Label)
    lb_name: cc.Label = null;

    @property(cc.Label)
    lb_lv: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Label)
    lb_money:cc.Label = null
      onLoad () {
        cc.director.preloadScene("roomlist")
      }

    bankNode:cc.Node =null
    rankNode:cc.Node = null
    start () {
        this.init()
    }
    init(){
        // let useInfo= JSON.parse(localStorage.getItem("useInfo" ))
        this.lb_name.string = userMgr.Instance.userName
        this.lb_lv.string ="lv"+ userMgr.Instance.lv
        this.lb_money.string = userMgr.Instance.coins
    }

    bank(){
        if(this.bankNode == null){
            let self = this
            cc.loader.loadRes('prefab/bank', function (err, prefab) {
                if (err) {
                    console.log(err)
                } else {
                    self.bankNode = cc.instantiate(prefab)
                    self.node.addChild(self.bankNode)
                    self.bankNode.active = true
                }
               
            });
        }else{
            this.bankNode.active = true
        }
        
    }
    rank(){
        if(this.rankNode == null){
            let self = this
            cc.loader.loadRes('prefab/rank', function (err, prefab) {
                if (err) {
                    console.log(err)
                } else {
                    self.rankNode = cc.instantiate(prefab)
                    self.node.addChild(self.rankNode)
                    self.rankNode.active = true
                }
               
            });
        }else{
            this.rankNode.active = true
        }
    }

    roomlist(){
        cc.director.loadScene("roomlist")
    }
    // update (dt) {}
}
