const api = require('../configs/api.js')
const { userList } = require('../controls/index.js')

module.exports = app => {
    app.get(api.fetchUserList, userList.fetchUserList)
}