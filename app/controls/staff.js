let { query } = require('../sql/mysql')
let { querySql, errorRes, updateSql, addSql } = require('../utils/index')
module.exports = {
    queryStaff(req, res) {
        let sql = querySql('staffs', req.query, ['name', 'id', 'status'])
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
    queryStaffDetail(req, res) {
        query(`SELECT * FROM staffs WHERE id=${req.query.id}`).then(result => {
            res.json({
                code: 0,
                data: result[0]
            })
        }).catch(err => {
            errorRes(res, err)
        })
    },
    updateStaff(req, res) {
        let id = req.body.id
        req.body.update_time = +new Date()
        let sql = updateSql('staffs', req.body, ['sexual', 'birthday', 'role', 'status', 'tell', 'update_time'])
        query(`SELECT * FROM staffs WHERE id=${id}`).then(result => {
            if(result.length) {
                query(sql).then(() => {
                    res.json({
                        code: 0,
                        msg: '员工信息更改成功'
                    })
                }).catch(err => {
                    errorRes(res, err)
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    addStaff(req, res) {
        query(`SELECT * FROM staffs WHERE name='${req.body.name}'`).then(result => {
            if(result.length) {
                res.json({
                    code: 100,
                    msg: '该员工已存在'
                })
            } else {
                let time = +new Date()
                req.body.create_time = time
                req.body.update_time = time
                let sql = addSql('staffs', req.body, ['name', 'sexual', 'birthday', 'role', 'status', 'tell', 'create_time', 'update_time'])
                query(sql).then(() => {
                    res.json({
                        code: 0,
                        msg: '员工创建成功'
                    })
                }).catch(err => {
                    errorRes(res, err)
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    deleteStaff(req, res) {
        query(`DELETE FROM staffs WHERE id=${req.body.id}`).then(() => {
            res.json({
                code: 0,
                msg: '删除成功'
            })
        }).catch(err => {
            errorRes(res, err)
        })
    }
}