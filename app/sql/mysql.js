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

/** 
 * 用户表
 * id  唯一标志
*/
let fUsers = 
    `create table if not exists fusers(
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL COMMENT '用户名',
        password VARCHAR(100) NOT NULL COMMENT '密码',
        create_time VARCHAR(100) NOT NULL COMMENT '注册时间',
        update_time VARCHAR(100) NOT NULL COMMENT '修改时间',
        PRIMARY KEY(id)
    );`
    
/** 
 * 客户表
 * id  唯一标志
*/
let Users = 
    `create table if not exists users(
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL COMMENT '客户名',
        sexual VARCHAR(100) NOT NULL COMMENT '性别',
        PRIMARY KEY(id)
    );`

/** 
 * 流水表
 * id  唯一标志
*/
let Bills = 
    `create table if not exists bills(
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL COMMENT '客户名',
        date VARCHAR(100) NOT NULL COMMENT '消费日期',
        project VARCHAR(100) NOT NULL COMMENT '消费项目',
        total VARCHAR(100) NOT NULL COMMENT '消费总额',
        card_minu VARCHAR(100) NOT NULL COMMENT '扣卡金额',
        pay_amount VARCHAR(100) NOT NULL COMMENT '收纳金额',
        no_pay VARCHAR(100) NOT NULL COMMENT '未付金额',
        pay_type VARCHAR(100) NOT NULL COMMENT '付款方式',
        remark VARCHAR(100) NOT NULL COMMENT '备注',
        PRIMARY KEY(id)
    );`
let createTable = (sql) => {
    return query(sql, [])
}
// 建表
createTable(fUsers)
createTable(Users)
createTable(Bills)

exports.query = query
