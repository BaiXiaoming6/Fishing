const MySql = require('mysql');
class DB {
    constructor() {
        let mysql = MySql.createConnection({
            host: 'rm-bp13i31ygni4ekdef125010.mysql.rds.aliyuncs.com',
            user: 'xiaoming',
            password: 'Bai147258',
            database: 'fishing'
        });
        mysql.connect();
        console.log("链接数据库");
        this._mysql = mysql;
    }

    getUserInfo(account, password) {
        return new Promise((resole, reject) => {
            this._mysql.query('select * from user_info where account = ?', [account], (err, result) => {
                if (err) {
                    reject(err);
                    console.log("err", err);
                } else {
                    console.log("get user info = ", JSON.stringify(result));
                    if (result.length > 0) {
                        let passwordByDB = result[0].password
                        console.log("password", password);
                        console.log("passwordByDB", passwordByDB);
                        if (password !== passwordByDB) {
                            let err = {
                                err: "账号或密码错误，请重新输入"
                            }
                            resole(err);
                        } else {
                            resole(result)
                        }
                    } else {
                        resole(result);
                    }
                }
            });
        });
    }
    setUserInfo(account, password) {
        return new Promise((resole, reject) => {
            let id = 0;
            let housecard_count = 20;
            let head_image_url = "http://47.114.181.224:3000/images/avatar_3.png";
            this._mysql.query('select count(*) as count from user_info', (err, result) => {
                let count = result[0].count;
                console.log("count = ", count);
                id = 100000 + count + 1

                // let sql = "insert into user_info(id,nickname,housecard_count,head_image_url,account,password) value(" + id + "," + account + "," + housecard_count + "," + head_image_url + "," + account + "," + password + ")";
                let sql = "insert into user_info set ?";
                let post = { id: id, nickname: account, housecard_count: housecard_count, head_image_url: head_image_url, account: account, password: password }
                console.log("sql ", sql);
                this._mysql.query(sql, post, (err, result) => {
                    console.log("result = ", result)
                    if (err) {
                        reject(err);
                    } else {
                        console.log("post ", post);
                        resole(post);
                    }
                });
            });
        })
    }

    updateHouseCardCount(id, count) {
        return new Promise((resole, reject) => {
            this._mysql.query('update user_info set housecard_count = ' + count + ' where id = ' + id, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resole(result);
                }
            });
        })
    }
    savePlayerGameInfo(id, data) {
        return new Promise((resole, reject) => {
            let sql = "insert into game_info(id, data) value( " + id + "," + "'" + JSON.stringify(data) + "'" + ")";
            console.log("sql ", sql);
            this._mysql.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resole();
                }

            });
        })
    }
    getPlayerGameRecord(playerId) {
        return new Promise((resole, reject) => {
            let sql = "select * from game_info where id = " + playerId;
            this._mysql.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resole(result);
                }

            });
        });
    }
}
module.exports = DB;