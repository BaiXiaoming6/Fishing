class Card {
    constructor(number, color) {
        this._number = number;
        this._color = color;
        this._isShow = true;
        this._handIndex = 0;
    }
    setHandIndex(value){
        this._handIndex = value;
    }
    getHandIndex(){
        return this._handIndex;
    }
    setShow(value) {
        this._isShow = value;
    }
    getShow() {
        return this._isShow;
    }
    getInfo() {
        return {
            number: this._isShow ? this._number : 0,
            color: this._isShow ? this._color : ""
        }
    }
    getNumber(){
        return parseInt(this._number);
    }
    getColor(){
        return this._color;
    }
}
module.exports = Card;