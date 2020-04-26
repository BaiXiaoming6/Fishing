class PlayerData {
    _userData: any;
    constructor(){

    }

    setUserData(value){
        this._userData = value;
    }
    gerUserData(){
        return this._userData;
    }
}
export default PlayerData;