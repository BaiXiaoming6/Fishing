import global from "../global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScene extends cc.Component {

    @property(cc.EditBox)
    account: cc.EditBox = null;
    @property(cc.EditBox)
    pwd: cc.EditBox = null;

    start () {
        //预加载大厅场景
        cc.director.preloadScene('HallScene');
        global.messageController.onLogin = this.onLogin.bind(this);
    }

    //登录
    onClickLogin(){
        console.log("开始登录")
        let lbl_account = this.account.getComponent(cc.EditBox).string;
        let lbl_pwd = this.pwd.getComponent(cc.EditBox).string;

        if (lbl_account === "" || lbl_pwd === "") {
            console.log("请输入账号或密码");
        } else {
            global.messageController.connectServer().then(() =>{
                console.log("链接服务器成功");
                let data = {
                    account: lbl_account,
                    password: lbl_pwd
                }
                global.messageController.sendMessage('login', data)
            }).catch((err) =>{
                console.log("登录失败 ", err);
            })
            // }).then((result) =>{
            //     console.log("登录成功 ", result);
            //     //处理是否在游戏中断线重连
            //     let roomId = undefined//result.roomId;
            //     if (roomId && roomId.length === 6) {
                    
            //     } else {
            //         global.playerData.setUserData(result);
            //         global.sceneController.enterHallLayer();
            //     }
            // }).catch((err) =>{
            //     console.log("登录失败 ", err);
            // })
        }
    }

    onLogin(data: object){
        global.playerData.setUserData(data);
        global.sceneController.enterHallLayer();
    }
}
