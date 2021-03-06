/* 
    负责跟服务端通讯的所有操作
*/
import global from '../global';
class MessageController {
    _ws: WebSocket;
    _callBackId: number = 1;
    _callBackMap: number[] = [];
    constructor(){

    }

    //链接服务器
    connectServer(){
        console.log("请求链接服务器");
        return new Promise((resole, reject) =>{
            let ws = new WebSocket("ws://47.114.181.224:3005");
            ws.onopen = function(result) {
                console.log("on open ", result);
                resole();
            }
            ws.onmessage = function(result) {
                console.log("on message", result.data);
                let message = JSON.parse(result.data);
                let type = message.type;
                let data = message.data;
                let callBackId = message.callBackId;
                this.processMessage(type, data, callBackId);
            }.bind(this);
            ws.onerror = function(result){
                console.log("on error ", result);
                reject();
            }
            this._ws = ws;
        })
    }

    //向服务器发送消息
    sendMessage(type:string, data: any, cb?){
        console.log("type ", type);
        let message = {
            type: type,
            data: data,
            callBackId: this._callBackId
        }
        if (cb) {
            this._callBackMap[this._callBackId] = cb;
            this._callBackId++;
        }
        
        this._ws.send(JSON.stringify(message));
    }

    //处理服务器返回的消息
    processMessage(type:string, data:object, callBackId:number){
        console.log("服务器返回的数据 ", data);
        switch (type) {
            case 'login':
                this.onLogin(data);
                break;
            case 'join-room':
                this.onJoinRoom();
                break;
            case 'sync-all-player-info':
                this.onSyncAllPlayerInfo(data);
                break;
            default:
                break;
        }
    }

    onLogin(data: object){
        console.log("在LoginScene中重写此函数");
    }

    onJoinRoom(){
        console.log("在HallScene中重写此函数");
    }

    onSyncAllPlayerInfo(data: object){
        console.log("在GameScene中重写此函数");
    }
}

export default MessageController;