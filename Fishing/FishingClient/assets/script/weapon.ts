
const {ccclass, property} = cc._decorator;

@ccclass
export default class Weapon extends cc.Component {

    @property(cc.SpriteAtlas)
    gunAtlas: cc.SpriteAtlas=null;
    curLevel :number = 1
    total: number=0
    sp: cc.Sprite=null;

    @property([cc.String])
    gunLevel=["gun_1_1","gun_1_2","gun_2_1","gun_2_2","gun_3_1","gun_3_2"]
    
    setLevel(){
        this.sp.spriteFrame = this.gunAtlas.getSpriteFrame(this.gunLevel[this.curLevel-1])
    }
    onLoad () {
        // this.total = this.anim.getClips().length;
        this.total = this.gunLevel.length
        this.curLevel = 1;
        this.sp = this.getComponent(cc.Sprite)
    }

    plus(){
        this.curLevel ++
        if (this.curLevel > this.total) {
            this.curLevel = this.total;
        }
        this.setLevel()
        // this.anim.play("cannon"+this.curLevel)
    }
    reduce(){
        this.curLevel-- 
        if (this.curLevel <2) {
            this.curLevel = 1
        }
        this.setLevel()
        // this.anim.play("cannon"+ this.curLevel)
    }
    start () {

    }

    // update (dt) {}
}
