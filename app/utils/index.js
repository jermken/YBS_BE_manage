module.exports = {
    filterQueryStr(obj, queryObj) {
        let str = ''
        let arr = []
        for(let i in obj) {
            if (obj[i] !== '' && queryObj.includes(i)) {
                if (isNaN(obj[i])) {
                    arr.push(`${i}='${obj[i]}'`)
                } else {
                    arr.push(`${i}=${obj[i]}`)
                }
            }
        }
        str = arr.join(' AND ')
        str = str? `where ${str}` : ''
        return str
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
    }
}