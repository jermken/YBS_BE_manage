const mysql = require('mysql')
const { dbConfig } = require('../configs/index.js')

const pool = mysql.createPool({ ...dbConfig })

let query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}

let fUsers = 
    `create table if not exists fusers(
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL COMMENT '用户名',
        password VARCHAR(100) NOT NULL COMMENT '密码',
        create_time VARCHAR(100) NOT NULL COMMENT '注册时间',
        update_time VARCHAR(100) NOT NULL COMMENT '修改时间',
        PRIMARY KEY(id)
    );`

let createTable = (sql) => {
    return query(sql, [])
}
// 建表
createTable(fUsers)

exports.query = query
