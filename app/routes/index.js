const api = require('../configs/api.js')
const { login, staff } = require('../controls/index.js')
module.exports = app => {
    // 登录
    app.post(api.register, login.register)
    app.post(api.passwordChange, login.passwordChange)
    app.post(api.login, login.login)
    app.post(api.loginOut, login.loginOut)

    // 员工
    app.get(api.getStaffList, staff.queryStaff)
    app.post(api.addStaff, staff.addStaff)
    app.post(api.updateStaff, staff.updateStaff)
    app.post(api.deleteStaff, staff.deleteStaff)
}