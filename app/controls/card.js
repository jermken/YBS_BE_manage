let { query } = require('../sql/mysql')
let { querySql, errorRes, updateSql, addSql } = require('../utils/index')
module.exports = {
    queryCard(req, res) {
        let sql = querySql('cards', req.query, ['name'])
        query(sql.data).then(result => {
            query(sql.total).then(rs => {
                res.json({
                    code: 0,
                    data: result,
                    total: rs[0]['COUNT(1)']
                })
            }).catch(err => {
                errorRes(res, err)
            })
        }).catch(err => {
            errorRes(res, err)
        })
    },
    queryCardSaleList(req, res) {
        let sql = querySql('cardsalelist', req.query, ['name'])
        query(sql.data).then(result => {
            query(sql.total).then(rs => {
                res.json({
                    code: 0,
                    data: result,
                    total: rs[0]['COUNT(1)']
                })
            }).catch(err => {
                errorRes(res, err)
            })
        }).catch(err => {
            errorRes(res, err)
        })
    },
    queryCardDetail(req, res) {
        query(`SELECT * FROM cards WHERE id=${req.query.id}`).then(result => {
            res.json({
                code: 0,
                data: result[0]
            })
        }).catch(err => {
            errorRes(res, err)
        })
    },
    buyCard(req, res) {
        if (req.body.user_type == 1 && !req.body.user_id) {
            query(`SELECT * FROM users WHERE name=${req.body.user_name}`).then(result => {
                if (result.length) {
                    res.json({
                        code: 100,
                        msg: '该客户名已存在，请使用其他姓名'
                    })
                } else {
                    let params = {}
                    params.create_time = +new Date()
                    params.update_time = +new Date()
                    params.card_amount = req.body.price
                    params.present_amount = req.body.present_price
                    params.consume_total = req.body.price
                    params.consume_times = 1
                    params.name = req.body.user_name
                    params.is_vip = 1
                    params.remark = req.body.remark
                    let sql = addSql('users', params, ['create_time', 'update_time', 'name', 'is_vip',
                    'birthday', 'tell', 'card_amount', 'present_amount', 'remark',
                    'consume_total', 'consume_times'])
                    // 新增vip客户
                    query(sql).then((rt) => {
                        query(`SELECT * FROM cards WHERE id=${req.body.card_id}`).then(result => {
                            if (result.length) {
                                let cardInfo = result[0]
                                let userList = JSON.parse(cardInfo.list)
                                userList.push(rt.insertId)
                                cardInfo.list = JSON.stringify(userList)
                                let sql = updateSql('cards', cardInfo, ['list'])
                                query(sql).then(() => {
                                    let _sql = addSql('cardsalelist', { create_time: +new Date(), ...cardInfo}, ['create_time', 'card_name', 'user_name', 'price', 'present_price'])
                                    query(_sql).then(() => {
                                        res.json({
                                            code: 0,
                                            msg: '开卡成功'
                                        })
                                        let params = {}
                                        let time = +new Date()
                                        params.create_time = time
                                        params.update_time = time
                                        params.name = req.body.user_name
                                        params.user_id = rt.insertId
                                        params.user_type = req.body.is_vip == 1 ? 3 : 2
                                        params.server_id = req.body.server_id
                                        params.project = `[{name: '开卡-${cardInfo.name}', tc: ${req.body.ratio}, price: ${req.body.price}}, ratio: ${req.body.ratio_detail}]`
                                        params.total = req.body.price
                                        params.card_minu = 0
                                        params.pay_amount = req.body.payment
                                        params.no_pay = req.body.no_pay
                                        params.remark = req.body.remark
                                        params.status = 1
                                        params.pay_type_detail = JSON.stringify(req.body.pay_type_detail)
                                        let _sql_ = addSql('bills', params, ['create_time', 'update_time', 'name', 'user_id',
                                        'user_type', 'server_id', 'project', 'total', 'card_minu', 'pay_amount', 'no_pay',
                                        'remark', 'status', 'pay_type_detail'])
                                        query(_sql_).then(() => {
                                        })
                                    }).catch(err => {
                                        errorRes(res, err)
                                    })
                                }).catch(err => {
                                    errorRes(res, err)
                                })
                            }
                        })
                    })
                }
            })
        } else if (req.body.user_id){
            query(`SELECT * FROM cards WHERE id=${req.body.card_id}`).then(result => {
                if (result.length) {
                    let cardInfo = result[0]
                    let userList = JSON.parse(cardInfo.list)
                    if (!userList.includes(req.body.user_id)) {
                        userList.push(req.body.user_id)
                        cardInfo.list = JSON.stringify(userList)
                        let sql = updateSql('cards', cardInfo, ['list'])
                        query(sql).then(() => {
                            let _sql = addSql('cardsalelist', { create_time: +new Date(), ...cardInfo}, ['create_time', 'card_name', 'user_name', 'price', 'present_price'])
                            query(_sql).then(() => {
                                res.json({
                                    code: 0,
                                    msg: '开卡成功'
                                })
                                let params = {}
                                let time = +new Date()
                                params.create_time = time
                                params.update_time = time
                                params.name = req.body.user_name
                                params.user_id = req.body.user_id
                                params.user_type = req.body.is_vip == 1 ? 3 : 2
                                params.server_id = req.body.server_id
                                params.project = `['开卡-${cardInfo.name}']`
                                params.total = req.body.price
                                params.card_minu = 0
                                params.pay_amount = req.body.payment
                                params.no_pay = req.body.no_pay
                                params.remark = req.body.remark
                                params.status = 1
                                params.pay_type_detail = JSON.stringify(req.body.pay_type_detail)
                                let _sql_ = addSql('bills', params, ['create_time', 'update_time', 'name', 'user_id',
                                'user_type', 'server_id', 'project', 'total', 'card_minu', 'pay_amount', 'no_pay',
                                'remark', 'status', 'pay_type_detail'])
                                query(_sql_).then(() => {
                                })
                            }).catch(err => {
                                errorRes(res, err)
                            })
                        }).catch(err => {
                            errorRes(res, err)
                        })
                    }
                }
            })
        }
    },
    addCard(req, res) {
        query(`SELECT * FROM cards WHERE name='${req.body.name}'`).then(result => {
            if(result.length) {
                res.json({
                    code: 100,
                    msg: '该卡类已存在'
                })
            } else {
                req.body.create_time = +new Date()
                req.body.update_time = +new Date()
                req.body.status = '1'
                let sql = addSql('cards', req.body, ['create_time', 'update_time', 'name', 'price', 'present_price', 'ratio', 'status', 'list', 'remark'])
                query(sql).then(() => {
                    res.json({
                        code: 0,
                        msg: '卡类创建成功'
                    })
                }).catch(err => {
                    errorRes(res, err)
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    addCardSaleList(req, res) {
        req.body.create_time = +new Date()
        let sql = addSql('cardsalelist', req.body, ['create_time', 'card_name', 'user_name', 'price', 'present_price'])
        query(sql).then(() => {
            res.json({
                code: 0,
                msg: '添加卡类售卖历史成功'
            })
        }).catch(err => {
            errorRes(res, err)
        })
    },
    updateCard(req, res) {
        let id = req.body.id
        query(`SELECT * FROM cards WHERE id=${id}`).then(result => {
            if(result.length) {
                req.body.update_time = +new Date()
                let sql = updateSql('cards', req.body, ['create_time', 'update_time', 'name', 'price', 'ratio', 'list', 'remark'])
                query(sql).then(() => {
                    res.json({
                        code: 0,
                        msg: '卡类信息更改成功'
                    })
                }).catch(err => {
                    errorRes(res, err)
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    addUserToCard(req, res) {
        let { card_id, user_id } = req.body
        query(`SELECT * FROM cards WHERE id=${card_id}`).then(result => {
            if(result.length) {
                let list = result.list.split(',')
                if (list.includes(user_id)) {
                    res.json({
                        code: 100,
                        msg: '该用户之前已购买次卡，不可再次购买'
                    })
                } else {
                    list.push(user_id)
                    let listStr = list.join(',')
                    let sql = updateSql('cards', {list: listStr, id: card_id}, ['list'])
                    query(sql).then(() => {
                        res.json({
                            code: 0,
                            msg: '卡类信息更改成功'
                        })
                    }).catch(err => {
                        errorRes(res, err)
                    })
                }
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    deleteUserFromCard(req, res) {
        let { card_id, user_id } = req.body
        query(`SELECT * FROM cards WHERE id=${card_id}`).then(result => {
            if(result.length) {
                let list = result.list.split(',')
                let idx = list.indexOf(user_id)
                if (idx > -1) {
                    list = list.splice(idx, 1)
                    let listStr = list.join(',')
                    let sql = updateSql('cards', {list: listStr, id: card_id}, ['list'])
                    query(sql).then(() => {
                        res.json({
                            code: 0,
                            msg: '卡类信息更改成功'
                        })
                    }).catch(err => {
                        errorRes(res, err)
                    })
                } else {
                    res.json({
                        code: 100,
                        msg: '该用户之前没有购买过次卡类哦，请核实'
                    })
                }
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    deleteCard(req, res) {
        query(`DELETE FROM cards WHERE id=${req.body.id}`).then(() => {
            res.json({
                code: 0,
                msg: '删除成功'
            })
        }).catch(err => {
            errorRes(res, err)
        })
    }
}