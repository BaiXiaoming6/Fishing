import ShaderHelper from './ShaderHelper';

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShaderTime extends cc.Component {
    //_material: any;
    _shaderHelper: ShaderHelper = null;

    @property
    _max: number = 65535;

    @property
    step: number = 0.01;

    isUpdate: boolean;
    
    private _start = 0;

    start() {
        this._shaderHelper = this.node.getComponent(ShaderHelper);
    }

    protected update(dt) {
       
        if (!this.node.active) {
            return;
        }
        
        this._shaderHelper = this.node.getComponent(ShaderHelper);
        let material = this._shaderHelper.material;
        if (material && material.effect.passes[0]._properties.time) {
            this._setShaderTime();
        }
    }
    private _setShaderTime() {
        let start = this._start;
        start += this.step;
        this._shaderHelper.material.effect.setProperty('time', start);
        this._start = start;
    }
}
