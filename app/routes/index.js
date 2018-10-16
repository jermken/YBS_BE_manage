const api = require('../configs/api.js')
const { login } = require('../controls/index.js')
module.exports = app => {
    // 登录
    app.post(api.register, login.login)
    app.post(api.passwordChange, login.passwordChange)
    app.post(api.login, login.login)
}