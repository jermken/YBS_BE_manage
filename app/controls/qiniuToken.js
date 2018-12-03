const qiniu = require('qiniu')

let accessKey = 'uHpQbWv9mpvMixCI4l-_U88RXbu1hSIratdSIvVf'
let secretKey = 'PAxlleZ-RyKJsp4Of9tC9PRYEbRenn3eqiW2v7Ad'
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