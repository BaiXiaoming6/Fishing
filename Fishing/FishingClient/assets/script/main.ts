// import {getRequset} from './http'

import { httpConfig } from './config';
import CHttp from './CHttp';
import userMgr from './userMgr';
import gameNetMgr from './gameNetMgr';
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.EditBox)
    account:cc.EditBox =null;
    @property(cc.EditBox)
    pwd:cc.EditBox =null;
    
    // LIFE-CYCLE CALLBACKS:
    //组件加载的时候调用
    onLoad () {}
    //第一帧调用
    start () {
        //预加载游戏
          cc.director.preloadScene("hall")
          gameNetMgr.Instance.initHandlers()
    }
//每帧判断
    update (dt) {
    }
    onclick(){
        let account = this.account.string
        console.log("object")
        if(account.length<1  ){
            return
        }
        userMgr.Instance.guestAuth(account)
    }
}
