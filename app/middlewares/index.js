exports.setHeader = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type'),
    res.header('Access-Control-Allow-Credentials', true)
    if (req.method === 'OPTIONS') {
        res.send(200) /*让options请求快速返回*/
    }else {
        next()
    }
}

exports.checkLogin = (req, res, next) => {
    if((req.url.indexOf('/api/') > -1
        && req.url.indexOf('/api/login') <= -1
        && req.url.indexOf('/api/register') <= -1
        && req.url.indexOf('/api/password_change') <= -1)
        && !req.session.user
    ) {
        res.json({
            code: 401,
            msg: '您暂未登录！'
        })
    }
    next()
}