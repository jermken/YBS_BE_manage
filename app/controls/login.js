let { query } = require('../sql/mysql')
let { filterQueryStr, getLimit } = require('../utils/index')

module.exports = {
    register(req, res) {
        console.log(req.body)
        console.log(res)
    },
    passwordChange(req, res) {
        console.log(req.body)
        console.log(res)
    },
    login(req, res) {
        let sql = filterQueryStr(req.body, ['name'])
        let limit = getLimit(req.body.page, req.body.pageSize)
        query(`select * from sys_users ${sql} limit ${limit.start},${limit.length}`).then((result) => {
            if (result.length) {
                if (result[0].password === req.body.password) {
                    res.json({
                        code: 0,
                        msg: '登录成功'
                    })
                } else {
                    res.json({
                        code: 100,
                        msg: '密码有误'
                    })
                }
            } else {
                res.json({
                    code: 100,
                    msg: '该用户名不存在'
                })
            }
        }).catch((err) => {
            res.status(500).json({
                code: 100,
                msg: err
            })
        })
    }
}