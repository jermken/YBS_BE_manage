let { query } = require('../sql/mysql')
let { querySql, errorRes, updateSql, addSql } = require('../utils/index')
module.exports = {
    queryGoods(req, res) {
        let sql = querySql('goods', req.query, ['name', 'code', 'status'])
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
    queryGoodsDetail(req, res) {
        query(`SELECT * FROM goods WHERE id=${req.query.id}`).then(result => {
            res.json({
                code: 0,
                data: result[0]
            })
        }).catch(err => {
            errorRes(res, err)
        })
    },
    updateGoods(req, res) {
        let id = req.body.id
        let sql = updateSql('goods', req.body, ['name', 'price', 'size', 'minNum', 'status', 'remark', 'num', 'imgUrl'])
        query(`SELECT * FROM goods WHERE id=${id}`).then(result => {
            console.log(result)
            if(result.length) {
                console.log(22222)
                console.log(sql)
                query(sql).then(() => {
                    res.json({
                        code: 0,
                        msg: '产品信息更改成功'
                    })
                }).catch(err => {
                    errorRes(res, err)
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    addGoods(req, res) {
        query(`SELECT * FROM goods WHERE name='${req.body.name}'`).then(result => {
            if(result.length) {
                res.json({
                    code: 100,
                    msg: '该产品已存在'
                })
            } else {
                req.body.num = 0
                let sql = addSql('goods', req.body, ['name', 'price', 'size', 'minNum', 'status', 'remark', 'num', 'imgUrl'])
                query(sql).then(() => {
                    res.json({
                        code: 0,
                        msg: '产品创建成功'
                    })
                }).catch(err => {
                    errorRes(res, err)
                })
            }
        }).catch(err => {
            errorRes(res, err)
        })
    },
    deleteGoods(req, res) {
        query(`DELETE FROM goods WHERE id=${req.body.id}`).then(() => {
            res.json({
                code: 0,
                msg: '删除成功'
            })
        }).catch(err => {
            errorRes(res, err)
        })
    }
}