

export default class Utils{
    public static readonly Instance: Utils = new Utils()

    addPrefab (callback, parentNode, path, ...arrComponent) {
        cc.loader.loadRes(path, (err, prefab) => {
            if (prefab == null) {
                callback(false);
            }

            prefab.asyncLoadAssets = true;
            let node = cc.instantiate(prefab);
            if (arrComponent.length > 0) {
                arrComponent.reduce((previous, current) => {
                    if (previous && node.getComponent(previous) == null) {
                        node.addComponent(previous);
                    }
                    if (current && node.getComponent(current) == null) {
                        node.addComponent(current);
                    }
                });
            }
            parentNode.addChild(node);
           
            node.x = 0;
            node.y = 0;
            callback(true);
        });
    }
    getVectorRadians( x1,  y1,  x2,  y2)
    {
         
        let len_y =  y1 - y2 ;
        let len_x =  x1 - x2 ;
 
        let tan_yx = Math.abs(len_y)/Math.abs(len_x);
        let angle = 0;
        if(len_y > 0 && len_x < 0) {
        angle = Math.atan(tan_yx)*180/Math.PI - 90 ;
        } else if (len_y > 0 && len_x > 0) {
        angle = 90 - Math.atan(tan_yx)*180/Math.PI ;
        } else if(len_y < 0 && len_x < 0) {
        angle = -Math.atan(tan_yx)*180/Math.PI - 90;
        } else if(len_y < 0 && len_x > 0) {
        angle = Math.atan(tan_yx)*180/Math.PI + 90 ;
        }
        return angle;
    }
    netResponseLog(eventName, connect) {
        console.log('触发时间' + (new Date()).toLocaleTimeString() + '== WebSocket response == 事件名称: ' + eventName + '== 数据: ' + connect);
    }

}