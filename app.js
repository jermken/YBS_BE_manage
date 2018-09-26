const express = require('express')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const MySqlStore = require('express-mysql-session')
const { dbConfig, sessionConfig, apiConfig } = require('./app/configs/index.js')
const apiRouter = require('./app/routes/index.js')
const { setHeader, checkLogin } = require('./app/middlewares/index.js')

const app = express()
// 设置静态目录文件夹
app.use(express.static(path.join(__dirname, 'app/dist')))

app.use(bodyParser.json())

const db_connection = mysql.createConnection({
    ...dbConfig,
    useConnectionPooling: true
})
db_connection.connect()

const sessionStore = new MySqlStore({
    expiration: 86400000,
    autoReconnect: true,
    keepAlive: true,
    keepAliveInterval: 30000,
    createDatabaseTable: true
}, db_connection)
// session 中间件
app.use(session({
    name: sessionConfig.name,
    secret: sessionConfig.secret,
    cookie: {
        maxAge: sessionConfig.maxAge
    },
    saveUninitialized: true,
    resave: false,
    store: sessionStore
}))

app.use(setHeader)

// 检查是否登录，登录、注册、修改信息除外
app.use(checkLogin)

// 接口
apiRouter(app)

// 解决浏览器刷新问题
app.use('*', (req, res) => {
    if(!Object.values(apiConfig).includes(req.baseUrl)) {
        // 404处理
        res.send('<div><script type="text/javascript" src="http://www.qq.com/404/search_children.js" charset="utf-8"></script><script>setTimeout(function(){document.getElementsByClassName("desc")[0].innerHTML="<a href=\'/home\' class=\'desc_link\'>返回首页</a>"},200)</script></div>')
        res.end()
    } else {
        res.sendFile(path.resolve(__dirname, 'app/dist', 'index.html'))
    }
})

app.listen(3337, () => {
    console.log('success running at port 3337')
})

