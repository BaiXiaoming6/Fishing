let url = 'http://127.0.0.1:9000'

function httpConfig(){
    return {
        login:url+"/guest" 
    }
}

export{httpConfig}