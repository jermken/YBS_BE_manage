let { query } = require('../sql/mysql')
let { querySql, errorRes, updateSql, addSql } = require('../utils/index')
module.exports = {
    // 获取客户列表
    queryBill(req, res) {
        let sql = querySql('bills', req.query, ['start_time', 'end_time', 'name', 'status', 'user_type', 'server_id'])
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
    queryBillDetail(req, res) {
        query(`SELECT * FROM bills WHERE id=${req.query.id}`).then(result => {
            res.json({
                code: 0,
                data: result[0]
            })
        }).catch(err => {
            errorRes(res, err)
        })
    },
    addBill(req, res) {
        req.body.create_time = +new Date()
        req.body.update_time = +new Date()
        let sql = addSql('bills', req.body, ['create_time', 'update_time', 'name',
        'user_type', 'user_id', 'server_id', 'project', 'total', 'card_minu',
        'pay_amount', 'no_pay', 'pay_type_detail', 'status', 'remark'])
        query(sql).then((rt) => {
            res.json({
                code: 0,
                msg: '账单创建成功'
            })
        }).catch(err => {
            errorRes(res, err)
        })
    },
    updateBill(req, res) {
        let id = req.body.id
        query(`SELECT * FROM bills WHERE id=${id}`).then(result => {
            if(result.length) {
                req.body.update_time = +new Date()
                let sql = updateSql('bills', req.body, ['update_time', 'name',
                'user_type', 'user_id', 'server_id', 'project', 'total', 'card_minu',
                'pay_amount', 'no_pay', 'pay_type_detail', 'status', 'remark'])
                query(sql).then(() => {
                    res.json({
                        code: 0,
                        msg: '账单信息更改成功'
                    })
                }).catch(err => {
                    errorRes(res, err)
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    auditorBill(req, res) {
        let id = req.body.id
        query(`SELECT * FROM bills WHERE id=${id}`).then(result => {
            if(result.length) {
                req.body.update_time = +new Date()
                let sql = updateSql('bills', req.body, ['status', 'remark', 'auditor_time'])
                query(sql).then(() => {
                    res.json({
                        code: 0,
                        msg: '审核成功'
                    })
                    let project = JSON.parse(req.body.project)
                    project.forEach(item => {
                        if (item.type == 'goods' && item.info) {
                            // 产品减库存
                            query(`SELECT * FROM goods WHERE id=${item.info.id}`).then(rt => {
                                if (rt.length) {
                                    let goodsInfo = rt[0]
                                    goodsInfo.num = goodsInfo.num - item.info.num
                                    let sql = updateSql('goods', goodsInfo, ['num'])
                                    query(sql).then(() => {})
                                }
                            })
                        } else if (item.type == 'setmeal' && item.info) {
                            // 套餐次数修改
                            query(`SELECT * FROM setmealsalelist WHERE setmeal_id=${item.info.id} AND status=1`).then(rt => {
                                if (rt.length) {
                                    let setmeal = rt[0]
                                    let project = JSON.parse(setmeal.project)
                                    project.forEach(item => {
                                        if (item.name === item.info.name) {
                                            item.use_times = Number(item.use_times) + Number(item.info.num)
                                        }
                                    })
                                    let unUse = project.every(item => {
                                        return item.times === item.use_times
                                    })
                                    // 套餐是否用完
                                    if (unUse) {
                                        setmeal.status = 0
                                    }
                                    setmeal.project = JSON.stringify(project)
                                    let sql = updateSql('setmealsalelist', setmeal, ['project', 'status'])
                                    query(sql).then(() => {})
                                }
                            })
                        }
                    })
                }).catch(err => {
                    errorRes(res, err)
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    // 删除客户，此接口暂时不用，删除只是更改客户status
    deleteBill(req, res) {
        query(`DELETE FROM bills WHERE id=${req.body.id}`).then(() => {
            res.json({
                code: 0,
                msg: '删除成功'
            })
        }).catch(err => {
            errorRes(res, err)
        })
    }
}