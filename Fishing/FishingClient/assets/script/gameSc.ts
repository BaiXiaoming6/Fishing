import Fish from "./fish";
import { FishType } from './fishType'
import Weapon from "./weapon";
import Bullet from "./bullet";
import Net from "./net";
import Coin from "./coin";
import CoinUp from "./coinUP";
import userMgr from "./userMgr";
import gameNetMgr from "./gameNetMgr";
import Utils from "./Utils";
import Seat from "./seat";
import FileList from './FishList'
import NetUtil from "./NetUtil";
import BulletList from "./BulletList";
import FishList from "./FishList";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameSc extends cc.Component {
    //在属性列表显示
    @property(cc.Node)
    node_gameOver: cc.Node = null;

    @property(cc.Prefab)
    fishPre: cc.Prefab = null
    @property(cc.Prefab)
    bulletPre: cc.Prefab = null;
    @property(cc.SpriteAtlas)
    fishAlats: cc.SpriteAtlas = null

    @property(cc.SpriteAtlas)
    bulletAtlas: cc.SpriteAtlas = null


    @property(cc.Prefab)
    netPre: cc.Prefab = null;
    @property(cc.Prefab)
    coinPre: cc.Prefab = null;
    @property(cc.Prefab)
    coinUpPre: cc.Prefab = null;
    @property(Number)
    money: number = 100




    @property([cc.Node])
    seats: cc.Node[] = []
    _seat: Seat[] = []
    netPool: cc.NodePool;
    coinPool: cc.NodePool;
    coinUpPool: cc.NodePool;
    fishTypes: FishType[];

    fishRoot: cc.Node

    onLoad() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        this.netPool = new cc.NodePool();
        this.coinPool = new cc.NodePool();
        this.coinUpPool = new cc.NodePool();

        FileList.Instance.init(this)
        BulletList.Instance.init(this)
        this.node.on(cc.Node.EventType.TOUCH_START, this.node_TOUCH_START, this)
        cc.find('Canvas/seats').zIndex = 2
        cc.find('Canvas/right').zIndex = 2
        this.fishRoot = cc.find('Canvas/game_bg_0')
        let self = this
        cc.loader.loadRes("fishConfig", function (err, jsonAsset) {
            if (err) {
                console.log(err.message)
                return
            }
            self.fishTypes = <FishType[]>jsonAsset.json;
            // self.schedule(self.creatFish, 2)

        })
        gameNetMgr.Instance.dataEventHandler = this.node
        this.node.on("new_user", (data) => {
            this.initSingleSeat(data)
            console.log(data)
        })
        this.node.on('login_result', function () {

            console.log('login_result');
        });
        this.node.on('SUB_S_USER_FIRE', (data) => {
            this.userFire(data)
        })
        this.node.on('build_fish_reply', (data) => {
            FileList.Instance.build_fish_reply(data)
        })
        this.node.on("exit_notify_push", (data) => {
            for (let i = 0; i < this._seat.length; i++) {
                if (this._seat[i].userid == data) {
                    this._seat[i].resetInfo()
                }

            }
        })
        this.node.on('catch_S_fish',(data)=>{
            FishList.Instance.catchFish(data)
        })
        this.initEvent()
    }

    exitGame() {
        gameNetMgr.Instance.exitGame()
    }
    initEvent() {
        for (let i = 0; i < this.seats.length; i++) {
            this._seat.push(this.seats[i].getComponent(Seat))
        }
    }
    userFire(data) {
        let index = data.chairId;

        
        this._seat[index].shot(data.bulletKind, data.fireAngle,data.bulletId ,data.score)
    }
    start() {
        this.money = userMgr.Instance.coins
        this.setValue(this.money)
        this.initSeats();

    }
    initSingleSeat(seat) {
        let index = seat.seatindex;
        let node = this.seats[index];
        node.getComponent(Seat).init(seat);
    }
    initSeats() {
        let seats = gameNetMgr.Instance.seats
        for (let i = 0; i < seats.length; i++) {
            if (seats[i].userid != 0) {
                this.initSingleSeat(seats[i]);
            }

        }
    }
    creatFish() {
        let fishCount = 3
        for (let i = 0; i < fishCount; i++) {
            let fish = cc.instantiate(this.fishPre)
            let x = - Math.random() * 100 - this.node.width / 2
            let y = (Math.random() * -0.5) * 300
            fish.position = cc.v2(x, y)
            fish.parent = this.node
            // let name = this.fishTypes[Math.floor(Math.random()*this.fishTypes.length)].name
            let type = this.fishTypes[Math.floor(Math.random() * this.fishTypes.length)]
            fish.getComponent(Fish).init(this, type)


        }
    }


    node_TOUCH_START(event: cc.Event.EventTouch) {
        console.log("node_TOUCH_START")
        let index = gameNetMgr.Instance.seatIndex
        let weaponPos = this._seat[index].getWeaponPos()

        let touchPos = this._seat[index].paotai.convertToNodeSpaceAR(event.getLocation())

        let degress = Utils.Instance.getVectorRadians(touchPos.x, touchPos.y, weaponPos.x, weaponPos.y)

        let level = this._seat[index].weaponSc.curLevel;

        gameNetMgr.Instance.user_fire(level, degress )

    }
    createNet(pos: cc.Vec2) {
        let net: cc.Node;
        if (this.netPool.size() > 0) {
            net = this.netPool.get();
        }
        else {
            net = cc.instantiate(this.netPre)
        }
        net.getComponent(Net).init(pos, this)
    }
    despawnNet(net: cc.Node) {
        this.netPool.put(net)
    }

    creatCoin(pos: cc.Vec2, seatid?) {
        let coin: cc.Node;
        if (this.coinPool.size() > 0) {
            coin = this.coinPool.get()
        } else {
            coin = cc.instantiate(this.coinPre)
        }

        let topos
        let node: cc.Node
        if (seatid == null) {
             node = this.seats[0].getChildByName("money_bg")
           
        }else{
            node = this.seats[seatid].getChildByName("money_bg")
        }
        topos = node.parent.convertToWorldSpaceAR(node.position)
        coin.getComponent(Coin).init(pos, topos, this)
    }
    despawnCoin(coin: cc.Node) {
        this.coinPool.put(coin)
    }

    createCoinUp(pos: cc.Vec2, value: number) {
        let coinUp: cc.Node;
        if (this.coinUpPool.size() > 0) {
            coinUp = this.coinUpPool.get();
        } else {
            coinUp = cc.instantiate(this.coinUpPre)
        }
        coinUp.getComponent(CoinUp).init(pos, value, this)
    }
    despawCoinUp(coinUp: cc.Node) {
        this.coinUpPool.put(coinUp)
    }

    // readyGame(){
    //     gameNetMgr.Instance.readyGame()
    // }
    setValue(value: number, seatid?) {

        let lable
        if (seatid == null) {
            let node: cc.Node = cc.find('money_bg/Label', this.seats[0])
            node.getComponent(cc.Label).string = value.toString()
        }
    }
    addCoin(value: number) {
        this.money += value
        this.setValue(this.money)
    }
    reduceCoin(value: number): boolean {
        if (this.money >= value) {
            this.money -= value;
            this.setValue(this.money)
            return true
        } else {
            this.money = 0
            this.setValue(this.money)
            return false
        }
    }
    gameOverHide() {
        this.node_gameOver.active = false
    }
    update(dt) {

    }
}
