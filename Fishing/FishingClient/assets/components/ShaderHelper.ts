const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
export default class ShaderHelper extends cc.Component {
    
    _effectName: string = '';

    //材质对象
    material: cc.Material = null;
    
    //effect的数组
    static effectAssets: any[] = null;

    start () {
        this.applyEffect();
    }

    applyEffect() {
        //获取精灵组件
        let sprite = this.node.getComponent(cc.Sprite);
        if (!sprite) {
            return;    
        }
        
        let nameList = ["Water", "FluxaySuper"];
        let effectName = nameList[0];
            let effectAsset = ShaderHelper.effectAssets.find((item) => {
                return item._name === effectName;
            });

            if (!effectAsset) {
                return;
            }
            //实例化一个材质对象
            let material = new cc.Material();
            
            //为材质设置effect，也是就绑定Shader了
            material.effectAsset = effectAsset
            material.name = effectAsset.name;
            //在材质对象上开启USE_TEXTURE定义
            let defineUserTexture = !!effectAsset.shaders.find(shader => shader.defines.find(def => def.name === 'USE_TEXTURE'));
            if (defineUserTexture) {
                material.define('USE_TEXTURE', true); 
            }

            //将材质绑定到精灵组件上，精灵可以绑定多个材质
            //这里我们替换0号默认材质
            sprite.setMaterial(0, material);

            //从精灵组件上获取材质，这步很重要，不然没效果
            this.material = sprite.getMaterial(0);
            this.node.emit('effect-changed', this, this.material);
    }
}

cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
    cc.loader.loadResDir('effect', cc.EffectAsset ,(error, res) => {
        ShaderHelper.effectAssets = res;
        let obj = {};
        ShaderHelper.effectAssets.map((item, i)  => {
            obj[item._name] = -1;
            return {name:item._name, value: i}; 
        });
    });
})