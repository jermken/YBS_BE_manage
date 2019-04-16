let { query } = require('../sql/mysql')
let { querySql, errorRes, updateSql, addSql } = require('../utils/index')
module.exports = {
    queryUser(req, res) {
        let sql = querySql('users', req.query, ['start_time', 'end_time', 'name', 'status', 'is_vip'])
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
    queryUserDetail(req, res) {
        query(`SELECT * FROM users WHERE id=${req.query.id}`).then(result => {
            res.json({
                code: 0,
                data: result[0]
            })
        }).catch(err => {
            errorRes(res, err)
        })
    },
    addUser(req, res) {
        query(`SELECT * FROM users WHERE name='${req.body.name}'`).then(result => {
            if(result.length) {
                res.json({
                    code: 100,
                    msg: '该客户已存在'
                })
            } else {
                req.body.create_time = +new Date()
                req.body.update_time = +new Date()
                req.body.card_amount = 0
                req.body.present_amount = 0
                req.body.consume_total = 0
                req.body.consume_times = 0
                let sql = addSql('users', req.body, ['create_time', 'update_time', 'name', 'sexual', 'is_vip',
                'status', 'birthday', 'tell', 'card_amount', 'present_amount', 'points', 'remark',
                'consume_total', 'consume_times', 'cards', 'setmeal'])
                query(sql).then(() => {
                    res.json({
                        code: 0,
                        msg: '客户创建成功'
                    })
                }).catch(err => {
                    errorRes(res, err)
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    updateUser(req, res) {
        let id = req.body.id
        query(`SELECT * FROM users WHERE id=${id}`).then(result => {
            if(result.length) {
                req.body.update_time = +new Date()
                let sql = updateSql('users', req.body, ['create_time', 'update_time', 'name', 'sexual', 'is_vip', 'status', 'birthday', 'tell', 'card_amount', 'present_amount', 'points', 'remark'])
                query(sql).then(() => {
                    res.json({
                        code: 0,
                        msg: '客户信息更改成功'
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
    deleteUser(req, res) {
        query(`DELETE FROM users WHERE id=${req.body.id}`).then(() => {
            res.json({
                code: 0,
                msg: '删除成功'
            })
        }).catch(err => {
            errorRes(res, err)
        })
    }
}