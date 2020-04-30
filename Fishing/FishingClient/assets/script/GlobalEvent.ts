export default class GlobalEvent{
    public static readonly Instance:GlobalEvent = new GlobalEvent()
    _handles ={}
    emit(event,data){
        let rArray = []
        data.event = event;
        for (let name in this._handles) {
             if (name === event) {
                 for (let i = 0; i < this._handles[name]; i++) {
                    if (typeof this._handles[name][i] === 'function') {
                        let rValue = this._handles[name][i](data);
                        rArray.push(rValue)
                    }
                 }
             }
        }
    }

    // 监听事件
    on (event, callback, target) {
        this._handles[event] = this._handles[event] || [];
        this._handles[event].push(callback.bind(target));
        return this;
    }

    // 取消监听
    off (event) {
        this._handles[event] = [];
        return this;
    }
}