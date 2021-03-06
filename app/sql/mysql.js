const mysql = require('mysql')
const { dbConfig } = require('../configs/index.js')

const pool = mysql.createPool({ ...dbConfig })

let query = (sql) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, (err, rows) => {
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
let SysUsers =
    `create table if not exists sys_users(
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL COMMENT '用户名',
        password VARCHAR(100) NOT NULL COMMENT '密码',
        create_time BIGINT NOT NULL COMMENT '注册时间',
        update_time BIGINT NOT NULL COMMENT '修改时间',
        PRIMARY KEY(id)
    );`

/**
 * 员工表
 * id  唯一标志
*/
let Staffs =
`create table if not exists staffs(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '员工名',
    tell VARCHAR(100) NOT NULL COMMENT '联系方式',
    sexual VARCHAR(100) NOT NULL COMMENT '性别',
    birthday VARCHAR(100) NOT NULL COMMENT '生日',
    role VARCHAR(100) NOT NULL COMMENT '角色',
    status INT NOT NULL COMMENT '状态',
    create_time BIGINT NOT NULL COMMENT '注册时间',
    update_time BIGINT NOT NULL COMMENT '修改时间',
    PRIMARY KEY(id)
);`

/**
 * 客户表
 * id  唯一标志
*/
let Users =
    `create table if not exists users(
        id INT NOT NULL AUTO_INCREMENT,
        create_time BIGINT NOT NULL COMMENT '注册时间',
        update_time BIGINT NOT NULL COMMENT '修改时间',
        name VARCHAR(100) NOT NULL COMMENT '客户名',
        sexual VARCHAR(100) NOT NULL COMMENT '性别' DEFAULT '1',
        is_vip INT NOT NULL COMMENT '是否会员' DEFAULT 0,
        status INT NOT NULL COMMENT '状态' DEFAULT 1,
        birthday BIGINT NOT NULL COMMENT '生日' DEFAULT 0,
        tell VARCHAR(100) NOT NULL COMMENT '联系方式' DEFAULT '',
        card_amount INT NOT NULL DEFAULT 0 COMMENT '卡内余额',
        present_amount INT NOT NULL DEFAULT 0 COMMENT '赠送金额',
        points INT NOT NULL DEFAULT 0 COMMENT '积分',
        remark VARCHAR(100) NOT NULL DEFAULT '' COMMENT '备注',
        PRIMARY KEY(id)
    );`

/**
 * 产品表
 * id  唯一标志
*/
let Goods =
`create table if not exists goods(
    id INT NOT NULL AUTO_INCREMENT,
    create_time BIGINT NOT NULL COMMENT '创建时间',
    update_time BIGINT NOT NULL COMMENT '修改时间',
    name VARCHAR(100) NOT NULL COMMENT '产品名',
    price VARCHAR(100) NOT NULL COMMENT '价格',
    size VARCHAR(100) NOT NULL COMMENT '规格',
    minNum INT NOT NULL COMMENT '库存警线' DEFAULT 0,
    num INT NOT NULL COMMENT '库存' DEFAULT 0,
    status INT NOT NULL COMMENT '状态',
    remark VARCHAR(100) NOT NULL COMMENT '备注',
    imgUrl VARCHAR(100) NOT NULL COMMENT '图片地址' DEFAULT '',
    PRIMARY KEY(id)
);`

/**
 * 入库记录表
 * id  唯一标志
*/
let Store =
`create table if not exists store(
    id INT NOT NULL AUTO_INCREMENT,
    create_time BIGINT NOT NULL COMMENT '创建时间',
    update_time BIGINT NOT NULL COMMENT '修改时间',
    auditor_time BIGINT NOT NULL COMMENT '审核时间' DEFAULT 0,
    list LONGTEXT NOT NULL COMMENT '入库详情',
    status INT NOT NULL COMMENT '状态',
    remark VARCHAR(100) NOT NULL COMMENT '备注' DEFAULT '',
    actioner VARCHAR(100) NOT NULL COMMENT '操作人',
    auditor_name VARCHAR(100) NOT NULL COMMENT '审核人' DEFAULT '',
    PRIMARY KEY(id)
);`

/**
 * 卡类表
 * id  唯一标志
*/
let Cards =
`create table if not exists cards(
    id INT NOT NULL AUTO_INCREMENT,
    create_time BIGINT NOT NULL COMMENT '创建时间',
    update_time BIGINT NOT NULL COMMENT '修改时间',
    name VARCHAR(100) NOT NULL COMMENT '卡类名',
    price INT NOT NULL COMMENT '价格' DEFAULT 0,
    status INT NOT NULL COMMENT '状态' DEFAULT 0,
    present_price INT NOT NULL COMMENT '赠送金额' DEFAULT 0,
    ratio INT NOT NULL COMMENT '提成比例' DEFAULT 0,
    list LONGTEXT NOT NULL COMMENT '客户列表',
    remark VARCHAR(100) NOT NULL COMMENT '备注',
    PRIMARY KEY(id)
);`

/**
 * 卡类销售表
 * id  唯一标志
*/
let CardSaleList =
`create table if not exists cardsalelist(
    id INT NOT NULL AUTO_INCREMENT,
    create_time BIGINT NOT NULL COMMENT '创建时间',
    card_name VARCHAR(100) NOT NULL COMMENT '卡类名',
    user_name VARCHAR(100) NOT NULL COMMENT '客户名',
    price INT NOT NULL COMMENT '价格' DEFAULT 0,
    present_price INT NOT NULL COMMENT '赠送金额' DEFAULT 0,
    status INT NOT NULL COMMENT '状态' DEFAULT 0,
    PRIMARY KEY(id)
);`

/**
 * 套餐表
 * id  唯一标志
*/
let Setmeal =
`create table if not exists setmeal(
    id INT NOT NULL AUTO_INCREMENT,
    create_time BIGINT NOT NULL COMMENT '创建时间',
    update_time BIGINT NOT NULL COMMENT '修改时间',
    start_time BIGINT NOT NULL COMMENT '开始时间' DEFAULT 0,
    end_time BIGINT NOT NULL COMMENT '结束时间' DEFAULT 0,
    name VARCHAR(100) NOT NULL COMMENT '套餐名',
    price INT NOT NULL COMMENT '价格' DEFAULT 0,
    status INT NOT NULL COMMENT '状态' DEFAULT 0,
    project LONGTEXT NOT NULL COMMENT '套餐项目',
    list LONGTEXT NOT NULL COMMENT '客户列表',
    remark VARCHAR(100) NOT NULL COMMENT '备注',
    PRIMARY KEY(id)
);`

/**
 * 套餐消费表
 * id  唯一标志
*/
let SetmealSaleList =
`create table if not exists setmealsalelist(
    id INT NOT NULL AUTO_INCREMENT,
    create_time BIGINT NOT NULL COMMENT '创建时间',
    setmeal_id INT NOT NULL COMMENT '套餐id',
    setmeal_name VARCHAR(100) NOT NULL COMMENT '套餐名',
    user_id INT NOT NULL COMMENT '客户id',
    user_name VARCHAR(100) NOT NULL COMMENT '客户名',
    price INT NOT NULL COMMENT '价格' DEFAULT 0,
    status INT NOT NULL COMMENT '状态' DEFAULT 0,
    project LONGTEXT NOT NULL COMMENT '套餐项目',
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
        user_type INT NOT NULL COMMENT '客户类型',
        user_id INT NOT NULL COMMENT '客户id' DEFAULT 0,
        server_id INT NOT NULL COMMENT '美容师id',
        create_time BIGINT NOT NULL COMMENT '消费日期',
        update_time BIGINT NOT NULL COMMENT '修改时间',
        auditor_time BIGINT NOT NULL COMMENT '审核时间' DEFAULT 0,
        project LONGTEXT NOT NULL COMMENT '消费项目',
        total VARCHAR(100) NOT NULL COMMENT '消费总额',
        card_minu VARCHAR(100) NOT NULL COMMENT '扣卡金额',
        pay_amount VARCHAR(100) NOT NULL COMMENT '收纳金额',
        no_pay VARCHAR(100) NOT NULL COMMENT '未付金额',
        pay_type_detail LONGTEXT NOT NULL COMMENT '付款方式及金额',
        status INT NOT NULL COMMENT '审核状态',
        remark VARCHAR(100) NOT NULL COMMENT '备注',
        PRIMARY KEY(id)
    );`
let createTable = (sql) => {
    return query(sql, [])
}
// 建表
createTable(SysUsers)
createTable(Staffs)
createTable(Users)
createTable(Goods)
createTable(Store)
createTable(Bills)
createTable(Cards)
createTable(CardSaleList)
createTable(Setmeal)
createTable(SetmealSaleList)

exports.query = query
