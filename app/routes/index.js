const api = require('../configs/api.js')
const { user } = require('../controls/index.js')

module.exports = app => {
    app.get(api.fetchUserList, user.fetchUserList)
}