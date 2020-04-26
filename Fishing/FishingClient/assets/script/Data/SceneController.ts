/* 
    场景控制
*/
class SceneController {
    constructor(){

    }

    //进入游戏登录界面
    enterLoginLayer(){
        cc.director.loadScene("LoginScene")
    }
    //进入大厅界面
    enterHallLayer(){
        cc.director.loadScene("HallScene")
    }
    //进入游戏界面
    enterGameLayer(){
        cc.director.loadScene("GameScene")
    }
}
export default SceneController;