const qiniu = require('qiniu')

let accessKey = ''
let secretKey = ''
let bucket = 'jermken-ybs'
module.exports = {
    getToken(req, res) {
        let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
        let options = {
            scope: bucket,
            expires: 7200
        }
        let putPolicy = new qiniu.rs.PutPolicy(options)
        let uploadToken = putPolicy.uploadToken(mac)
        res.json({
            code: 0,
            data: {
                uploadToken
            }
        })
    }
}