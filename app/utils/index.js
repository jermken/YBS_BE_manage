module.exports = {
    filterQueryStr(obj, queryObj) {
        let str = ''
        let arr = []
        for(let i in obj) {
            if (obj[i] !== '' && queryObj.includes(i)) {
                arr.push(`${i}=${obj[i]}`)
            }
        }
        str = arr.join(' AND ')
        return str
    }
}