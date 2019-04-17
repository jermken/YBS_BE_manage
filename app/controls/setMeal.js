let { query } = require('../sql/mysql')
let { querySql, errorRes, updateSql, addSql } = require('../utils/index')
module.exports = {
    querySetmeal(req, res) {
        let sql = querySql('setmeal', req.query, ['name', 'status'])
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
    querySetmealSaleList(req, res) {
        let sql = querySql('SetmealSaleList', req.query, ['setmeal_name', 'user_name'])
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
    querySetmealDetail(req, res) {
        query(`SELECT * FROM setmeal WHERE id=${req.query.id}`).then(result => {
            res.json({
                code: 0,
                data: result[0]
            })
        }).catch(err => {
            errorRes(res, err)
        })
    },
    addSetmeal(req, res) {
        query(`SELECT * FROM setmeal WHERE name='${req.body.name}'`).then(result => {
            if(result.length) {
                res.json({
                    code: 100,
                    msg: '该套餐名已存在'
                })
            } else {
                req.body.create_time = +new Date()
                req.body.update_time = +new Date()
                req.body.card_amount = 0
                req.body.present_amount = 0
                req.body.consume_total = 0
                req.body.consume_times = 0
                let sql = addSql('setmeal', req.body, ['create_time', 'update_time', 'start_time', 'end_time', 'name',
                'price', 'status', 'project', 'list', 'remark'])
                query(sql).then(() => {
                    res.json({
                        code: 0,
                        msg: '套餐创建成功'
                    })
                }).catch(err => {
                    errorRes(res, err)
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    addSetmealSaleList(req, res) {
        req.body.create_time = +new Date()
        let sql = addSql('SetmealSaleList', req.body, ['create_time', 'setmeal_id', 'setmeal_name', 'user_id',
        'user_name', 'price', 'status', 'project'])
        query(sql).then(() => {
            res.json({
                code: 0,
                msg: '套餐消费列表创建成功'
            })
        }).catch(err => {
            errorRes(res, err)
        })
    },
    updateSetmeal(req, res) {
        let id = req.body.id
        query(`SELECT * FROM setmeal WHERE id=${id}`).then(result => {
            if(result.length) {
                req.body.update_time = +new Date()
                let sql = updateSql('setmeal', req.body, ['create_time', 'update_time', 'start_time', 'end_time', 'name',
                'price', 'status', 'project', 'list', 'remark'])
                query(sql).then(() => {
                    res.json({
                        code: 0,
                        msg: '套餐信息更新成功'
                    })
                }).catch(err => {
                    errorRes(res, err)
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    updateSetmealSaleList(req, res) {
        let id = req.body.id
        query(`SELECT * FROM SetmealSaleList WHERE id=${id}`).then(result => {
            if(result.length) {
                req.body.update_time = +new Date()
                let sql = updateSql('setmeal', req.body, ['status', 'project'])
                query(sql).then(() => {
                    res.json({
                        code: 0,
                        msg: '套餐消费列表信息更新成功'
                    })
                }).catch(err => {
                    errorRes(res, err)
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    deleteSetmeal(req, res) {
        query(`DELETE FROM setmeal WHERE id=${req.body.id}`).then(() => {
            res.json({
                code: 0,
                msg: '删除成功'
            })
        }).catch(err => {
            errorRes(res, err)
        })
    }
}