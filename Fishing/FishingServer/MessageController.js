class MessageController {
    constructor(db, roomController, playerController) {
        this._db = db;
        this._roomController = roomController;
        this._playerController = playerController;
    }
    receivedMessage(type, data, callBackId, client) {
        switch (type) {
            case 'login':
                this.processLogin(data, callBackId, client);
                break;
            default:
                break;
        }
    }

    processLogin(data, callBackId, client) {
        this._playerController.playerLogin(data.account, data.password, client).then((result) => {
            this.sendMessage("login", client, callBackId, result);
        }).catch((err) => {
            this.sendMessage("login", client, callBackId, { err: err });
        });
    }
    sendMessage(type, client, callBackId, data) {
        let result = {
            type: type,
            data: data,
            callBackId: callBackId
        }
        client.send(JSON.stringify(result));
    }

}
module.exports = MessageController;