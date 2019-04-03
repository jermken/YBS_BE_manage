let { query } = require('../sql/mysql')
let { querySql, errorRes, updateSql, addSql } = require('../utils/index')
module.exports = {
    queryGoodsStore(req, res) {
        let sql = querySql('goods', req.query, ['name', 'code', 'safeStatus'])
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
    queryStore(req, res) {
        let queryKeys = req.query.status == 0 ? ['name'] : ['name', 'status']
        let sql = querySql('store', req.query, ['name', 'status'])
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
    queryStoreDetail(req, res) {
        query(`SELECT * FROM store WHERE id=${req.query.id}`).then(result => {
            res.json({
                code: 0,
                data: result[0]
            })
        }).catch(err => {
            errorRes(res, err)
        })
    },
    createStore(req, res) {
        let time = +new Date()
        req.body.create_time = time
        req.body.update_time = time
        req.body.status = 1
        let sql = addSql('store', req.body, ['create_time', 'update_time', 'list', 'status', 'remark', 'actioner'])
        query(sql).then(() => {
            res.json({
                code: 0,
                msg: '入库单创建成功'
            })
        }).catch(err => {
            errorRes(res, err)
        })
    },
    updateStore(req, res) {
        let id = req.body.id
        req.body.update_time = +new Date()
        let { status, list } = req.body
        let queryKeys = req.body.status == 1 ? ['update_time', 'list', 'remark', 'actioner'] : ['status']
        let sql = updateSql('store', req.body, ['update_time', 'list', 'status', 'remark', 'actioner'])
        query(`SELECT * FROM goods WHERE id=${id}`).then(result => {
            if(result.length) {
                query(sql).then(() => {
                    if (status == 3) {
                        let goodsList = JSON.parse(JSON.stringify(list || []))
                        if (!goodsList.length) {
                            return res.json({
                                code: 0,
                                msg: '入库成功'
                            })
                        }
                        goodsList.forEach((item) => {
                            query(`SELECT * FROM goods WHERE id=${item.id}`).then(result => {
                                if(result.length) {
                                    let obj = {
                                        id: item.id,
                                        num: item.num + result[0].num
                                    }
                                    let sql = updateSql('goods', obj,  ['num'])
                                    query(sql).then(() => {
                                    }).catch(err => {
                                        errorRes(res, err)
                                        return
                                    })
                                }
                            }).catch(err => {
                                errorRes(res, err)
                            })
                        })
                    } else {
                        res.json({
                            code: 0,
                            msg: status == 1 ? '入库单更改成功' : '审核不通过'
                        })
                    }
                }).catch(err => {
                    errorRes(res, err)
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    deleteStore(req, res) {
        query(`SELECT * FROM store WHERE id=${req.query.id}`).then(result => {
            if (result[0].status != 1) {
                res.json({
                    code: 100,
                    data: '',
                    message: '已审核状态无法删除'
                })
            } else {
                query(`DELETE FROM goods WHERE id=${req.body.id}`).then(() => {
                    res.json({
                        code: 0,
                        msg: '删除成功'
                    })
                }).catch(err => {
                    errorRes(res, err)
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    }
}