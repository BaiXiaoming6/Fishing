import gameNetMgr from "./gameNetMgr";

 
const io = (window as any).io||{}

export default class NetUtil{
    public static readonly Instance: NetUtil = new NetUtil();
    ip=null 
    sio = null;
    isPinging=false
    fnDisconnect= null
    handlers= {}
    isBackground= false
    lastSendTime= null//上一次发送ping的时间
    delayMS= null//用于显示游戏内的毫秒数
    lastRecieveTime =null
    
    addHandle(event, fn) {
        if (this.handlers[event]) {
            console.log("event:" + event + "' handler has been registered.");
            return;
        }

        var handler = function (data) {
            if (event != "disconnect" && typeof (data) == "string") {
                data = JSON.parse(data);
            }
            fn(data);
        };

        this.handlers[event] = handler;
        if (this.sio) {
            console.log("register:function " + event);
            this.sio.on(event, handler);
        }
    }


    connect (fnConnect, fnError) {
        var self = this;

        var opts = {
            'reconnection': false,
            'force new connection': true,
            'transports': ['websocket', 'polling']
        }
        this.sio = io.connect(this.ip, opts);
        this.sio.on('reconnect', function () {
            console.log('reconnection');
        });
        this.sio.on('connect', function (data) {
            console.log('connection');
            self.sio.connected = true;
            
            fnConnect(data);
        });

        this.sio.on('disconnect', function (data) {
            console.log("disconnect");
            self.sio.connected = false;
            cc.director.loadScene("hall")
            self.close();
        });

        this.sio.on('connect_failed', function () {
            console.log('connect_failed');
        });

        for (var key in this.handlers) {
            var value = this.handlers[key];
            if (typeof (value) == "function") {
                if (key == 'disconnect') {
                    this.fnDisconnect = value;
                }
                else {
                    console.log("register:function " + key);
                    this.sio.on(key, value);
                }
            }
        }

        this.startHearbeat();

        cc.game.on(cc.game.EVENT_HIDE, function () {
            self.isBackground = true;
            if (self.sio.connected && self.sio.connected == true) {
                self.send('game_disconnect');
            }
        });

        cc.game.on(cc.game.EVENT_SHOW, function () {
            self.isBackground = false;
            self.lastRecieveTime = Date.now();
            self.ping();
            if (self.sio.connected && self.sio.connected == true) {
                self.send('game_connect');
            }
            
        });
    } 

    startHearbeat () {
        var self = this;
        this.sio.on('game_pong', function () {
            self.lastRecieveTime = Date.now();
            self.delayMS = self.lastRecieveTime - self.lastSendTime;
        });

        this.lastRecieveTime = Date.now();

        if (!self.isPinging) {
            self.isPinging = true;
            setInterval(function () {
                if (self.sio) {
                    if (Date.now() - self.lastRecieveTime > 10000) {
                        self.close();
                    } else {
                        self.ping();
                    }
                }
            }, 3000);
        }
    }

    send (event, data?) {
        if (this.sio.connected) {
            if (data != null && (typeof (data) == "object")) {
                data = JSON.stringify(data);
            }

            this.sio.emit(event, data);
        }
        let ccLogStr = '触发时间' + (new Date()).toLocaleTimeString() + '== WebSocket request ==' + event;
        console.log(ccLogStr);
    }

    ping () {
        this.lastSendTime = Date.now();
        this.send('game_ping');
    }

    close (){
        console.log('close');
        this.delayMS = null;
        if (this.sio && this.sio.connected) {
            this.sio.connected = false;
            this.sio.disconnect();
            this.sio = null;
        }
        if (this.fnDisconnect) {
            this.fnDisconnect();
            this.fnDisconnect = null;
        }
    }

}