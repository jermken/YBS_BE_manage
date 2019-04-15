let { query } = require('../sql/mysql')
let { querySql, errorRes, updateSql, addSql } = require('../utils/index')
module.exports = {
    queryGoodsStore(req, res) {
        let specialQuery = ''
        let code = req.query.code
        if (req.query.status == 0) {
            specialQuery = `num-minNum<=0`
            if (code != '') {
                specialQuery = `${specialQuery} AND id like '%${code}%'`
            }
        } else {
            specialQuery = `id like '%${code}%'`
        }
        let sql = querySql('goods', req.query, ['name'], specialQuery)
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
        let queryKeys = req.query.status == 0 ? [] : ['status']
        let sql = querySql('store', req.query, queryKeys)
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
        let { status, list } = req.body
        let queryKeys = []
        if (req.body.status !== 1) {
            req.body.auditor_time = +new Date()
            queryKeys = ['status', 'auditor_name', 'auditor_time']
        } else {
            req.body.update_time = +new Date()
            queryKeys = ['update_time', 'list', 'remark', 'actioner']
        }
        let sql = updateSql('store', req.body, queryKeys)
        query(`SELECT * FROM store WHERE id=${id}`).then(result => {
            if(result.length) {
                query(sql).then(() => {
                    if (status == 2) {
                        let goodsList = JSON.parse(list || '[]')
                        if (!goodsList.length) {
                            return res.json({
                                code: 0,
                                msg: '入库成功'
                            })
                        }
                        let sql = 'UPDATE goods SET num = num + CASE id '
                        let idArr = []
                        goodsList.forEach(item => {
                            sql = sql + `WHEN ${item.id} THEN ${item.num} `
                            idArr.push(item.id)
                        })
                        sql = sql + `END WHERE id IN (${idArr.join(',')})`
                        query(sql).then(() => {
                            return res.json({
                                code: 0,
                                msg: '入库成功'
                            })
                        }).catch(err => {
                            errorRes(res, err)
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