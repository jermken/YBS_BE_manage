let { query } = require('../sql/mysql')
let { queryExactSql, errorRes, updateSql, addSql } = require('../utils/index')
const sha1 = require('sha1')

module.exports = {
    register(req, res) {
        if (req.body.icode !== '123') {
            return res.json({
                code: 100,
                msg: '推荐码有误'
            })
        }
        let sql = queryExactSql('sys_users', req.body, ['name'])
        query(sql.data).then((result) => {
            if (result.length) {
                res.json({
                    code: 100,
                    msg: '该用户名已存在'
                })
            } else {
                req.body.password = sha1(req.body.password)
                let sql = addSql('sys_users', req.body, ['name', 'password', 'create_time', 'update_time'])
                query(sql).then(() => {
                    res.json({
                        code: 0,
                        msg: '注册成功'
                    })
                }).catch((err) => {
                    errorRes(res, err)
                })
            }
        }).catch((err) => {
            errorRes(res, err)
        })
    },
    passwordChange(req, res) {
        let { name, oldpassword, newpassword, update_time } = req.body
        let sql = queryExactSql('sys_users', req.body, ['name'])
        query(sql.data).then(result => {
            if (result.length) {
                if(result[0].password === sha1(oldpassword)) {
                    newpassword = sha1(newpassword)
                    let sql = updateSql('sys_users', {password: newpassword, update_time, name}, ['password', 'update_time'], 'name')
                    query(sql).then(() => {
                        req.session.user = null
                        res.json({
                            code: 0,
                            msg: '密码修改成功'
                        })
                    }).catch(err => {
                        errorRes(res, err)
                    })
                } else {
                    res.json({
                        code: 100,
                        msg: '原密码输入有误'
                    })
                }
            } else {
                res.json({
                    code: 100,
                    msg: '该用户不存在'
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    login(req, res) {
        let sql = queryExactSql('sys_users', req.body, ['name'])
        query(sql.data).then((result) => {
            if (result.length) {
                if (result[0].password === sha1(req.body.password)) {
                    req.session.user = result[0]
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
        }).catch(err => {
            errorRes(res, err)
        })
    },
    loginOut(req, res) {
        let sql = queryExactSql('sys_users', req.body, ['name'])
        query(sql.data).then(result => {
            if (result.length) {
                req.session.user = null
                res.json({
                    code: 0,
                    msg: '退出登录成功'
                })
            } else {
                res.json({
                    code: 100,
                    msg: '该用户名不存在'
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    }
}