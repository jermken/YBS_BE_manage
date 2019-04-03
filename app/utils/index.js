const utilFunc = {
    querySql(tableName, obj, queryArr) {
        let str = ''
        let arr = []
        for(let i in obj) {
            if (obj[i] !== '' && queryArr.includes(i)) {
                if (isNaN(obj[i])) {
                    arr.push(`POSITION('${obj[i]}' IN ${i})`)
                } else {
                    arr.push(`POSITION(${obj[i]} IN ${i})`)
                }
            }
        }
        if (obj.start_time && obj.end_time && queryArr.includes('start_time') && queryArr.includes('end_time')) {
            arr.push(`create_time BETWEEN ${obj.start_time} AND ${obj.end_time}`)
        }
        str = arr.join(' AND ')
        str = str? `WHERE ${str}` : ''
        let limit = utilFunc.getLimit(obj.page, obj.pageSize)
        return {
            data: `SELECT * FROM ${tableName} ${str} LIMIT ${limit.start},${limit.length}`,
            total: `SELECT COUNT(1) FROM ${tableName} ${str}`
        }
    },
    queryExactSql(tableName, obj, queryArr) {
        let str = ''
        let arr = []
        for(let i in obj) {
            if (obj[i] !== '' && queryArr.includes(i)) {
                if (isNaN(obj[i])) {
                    arr.push(`${i}='${obj[i]}'`)
                } else {
                    arr.push(`${i}=${obj[i]}`)
                }
            }
        }
        str = arr.join(' AND ')
        str = str? `WHERE ${str}` : ''
        let limit = utilFunc.getLimit(obj.page, obj.pageSize)
        return {
            data: `SELECT * FROM ${tableName} ${str} LIMIT ${limit.start},${limit.length}`,
            total: `SELECT COUNT(1) FROM ${tableName} ${str}`
        }
    },
    updateSql(tableName, obj, updateArr, where) {
        let str = ''
        let arr = []
        for(let i in obj) {
            if (obj[i] !== '' && updateArr.includes(i)) {
                if (isNaN(obj[i])) {
                    arr.push(`${i}='${obj[i]}'`)
                } else {
                    arr.push(`${i}=${obj[i]}`)
                }
            }
        }
        str = arr.join(',')
        str = str? ` ${str}` : ''
        let whereStr = where? `${where}='${obj[where]}'` : `id=${obj.id}`
        return `UPDATE ${tableName} SET ${str} WHERE ${whereStr}`
    },
    addSql(tableName, obj, addArr) {
        let valArr = []
        let keyArr = []
        for(let i in obj) {
            if (addArr.includes(i)) {
                keyArr.push(i)
                if (isNaN(obj[i])) {
                    valArr.push(`'${obj[i]}'`)
                } else {
                    valArr.push(`${obj[i]}`)
                }
            }
        }
        let keyStr = keyArr.join(',')
        let valStr = valArr.join(',')
        return `INSERT INTO ${tableName}(${keyStr}) VALUES(${valStr})`
    },
    deleteSql() {

    },
    getLimit(page, pageSize) {
        let obj = {}
        if (page && pageSize) {
            obj.start = (page -1) * pageSize
            obj.length = pageSize
        } else {
            obj = {
                start: 0,
                length: 30
            }
        }
        return obj
    },
    /**
     * 
     * @param {*} res 服务器响应
     * @param {*} err sql报错
     * @param {*} errStatus 错误状态码
     */
    errorRes(res, err, errStatus) {
        let statusCode = errStatus || 500
        res.status(statusCode).json({
            code: 100,
            msg: err
        })
    }
}
module.exports = utilFunc