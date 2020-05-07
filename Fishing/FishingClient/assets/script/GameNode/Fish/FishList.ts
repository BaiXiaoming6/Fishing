import GameSc from "../GameScene";
import Fish from "./Fish";

export default class FishList{
    public static readonly Instance: FishList = new FishList();
    fishList =[]
    
    fishPool: cc.NodePool = null
    game:GameSc = null;
    init(game){
        this.game = game
        this.fishPool = new cc.NodePool()
    }
    build_fish_reply(data){
        for (let i = 0; i < data.length; i++) {
            if (data[i].fishKind >23) {
                continue
            }
            this.addFish(data[i])
            
        }
    }
    addFish(data){
        if (this.fishList[data.fishId]) {
            return
        }
        let fish
        if (this.fishPool.size()>0) {
            fish = this.fishPool.get()
        } else {
            fish = cc.instantiate(this.game.fishPrefab)
        }
        fish.position = cc.v2(data.trace[0][0], data.trace[0][1])
        fish.parent = this.game.fishRoot
        
        fish.getComponent(Fish).init(this.game, data)
        
        this.fishList[data.fishId] = fish
    }
    
    changeFishStaus(data){
        let fish:cc.Node = this.fishList[data.fishId]
        if (fish ==null) {
            return
        }
        if  (data.y != undefined && data.x != undefined) {
            if (Math.abs(data.x - fish.x) < 30) {
                let action = cc.moveTo(0.1,cc.v2(data.x,data.y));
                fish.runAction(action);
            } else {
                if (undefined !== data.x) {
                    fish.x = data.x
                }
                if (undefined !== data.y) {
                    fish.y = data.y
                }
            }
        }
    }
    catchFish(data){
        if (data.fishesId ==null) {
            console.log('fishId ==null')
        }
        for (let i = 0; i < data.fishesId.length; i++) {
            let fish:cc.Node =  this.fishList[data.fishesId[i]]
            if (fish ==null) {
                return
            }
            fish.getComponent(Fish).despawnFish(data.chairId)
            
        }
        // this.game._seat[data.chairId].changeScore(data.score)
    }
    despawnFish(fishId){
        let fish:cc.Node = this.fishList[fishId]
        if (fish ==null) {
            return
        }
        fish.getComponent(Fish).restInfo()
        fish.stopAllActions()
        this.fishPool.put(fish)
        delete this.fishList[fishId]

    }

}