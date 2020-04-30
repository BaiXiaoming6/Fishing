



/**
 * 网络接口封装
 * 
 * 负责公司服务器接口调用
 */
export default class CHttp {
    // public static Url = 'http://192.168.11.190:9000';
    public static Url = 'http://127.0.0.1:9000';
    public static httpGet(cmd, reqData, callback) {
        reqData = this.buildQueryString(reqData)
        let url = this.Url + cmd + reqData;
        console.log("get request url : " + url)
        let xhr = cc.loader.getXMLHttpRequest()
        xhr.open("GET", url, true);
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.setRequestHeader('Token', CUserData.Token);
        // console.log('user token : ' + CUserData.Token);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    let response = xhr.responseText;
                    // console.log(response)
                    if (response) {
                        console.log('http get response : ' + response);
                        let responseJson = JSON.parse(response);
                        callback(responseJson);
                    } else {
                        console.log("返回数据不存在")
                        // callback(false);
                    }
                } else {
                    console.log("请求失败")
                    // callback(false);
                }
            }
        };

        xhr.send();
    }

    public static httpRequest(cmd, reqData, callback) {
        let url = this.Url + cmd;
        // let param = this.buildQueryString(reqData);
        let param = JSON.stringify(reqData);

        // console.log(url)
        let xhr = cc.loader.getXMLHttpRequest()
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.setRequestHeader('Token', CUserData.Token);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    let response = xhr.responseText;
                    // console.log(response)
                    if (response) {
                        let responseJson = JSON.parse(response);
                        callback(true, responseJson);
                    } else {
                        console.log("返回数据不存在")
                        callback(false);
                    }
                } else {
                    console.log("请求失败")
                    callback(false);
                }
            }
        };

        xhr.send(param);
    }

    /**
     * 转化成json串
     * @param params 
     */
    public static buildQueryString(params) {
        let queryString = "?"
        for (let k in params) {
            if (queryString != "?") {
                queryString += "&"
            }
            queryString += (k + '=' + params[k])
        }

        return encodeURI(queryString);
    }
}