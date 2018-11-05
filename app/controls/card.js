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
                let sql = addSql('cards', req.body, ['create_time', 'update_time', 'name', 'price', 'list', 'remark'])
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
    updateCard(req, res) {
        let id = req.body.id
        query(`SELECT * FROM cards WHERE id=${id}`).then(result => {
            if(result.length) {
                req.body.update_time = +new Date()
                let sql = updateSql('cards', req.body, ['create_time', 'update_time', 'name', 'price', 'list', 'remark'])
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
                    let sql = updateSql('cards', {list: listStr}, ['list'])
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
                    let sql = updateSql('cards', {list: listStr}, ['list'])
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