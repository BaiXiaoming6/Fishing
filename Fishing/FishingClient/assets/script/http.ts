function getRequset(path,data,handler){
    let xhr  = cc.loader.getXMLHttpRequest()
    xhr.timeout = 5000
    if(data ==null){
        data = {}
    }
    let str ="?"
    for (let k in data) {
        if(str !="?")
        {
            str +="&"
        }
        str += (k +'='+ data[k])
    }
    let url = path + encodeURI(str)
    xhr.open('GET',url)
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status <=300)){
            let ret = xhr.responseText;
            console.log(ret)
            handler(ret)
        }
    }
    xhr.send()
}

export{getRequset}