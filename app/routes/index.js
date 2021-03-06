const api = require('../configs/api.js')
const { login, staff, goods, qiniuToken, user, store, card, setMeal, bill } = require('../controls/index.js')

module.exports = app => {
    // 登录
    app.post(api.register, login.register)
    app.post(api.passwordChange, login.passwordChange)
    app.post(api.login, login.login)
    app.post(api.loginOut, login.loginOut)

    // 员工
    app.get(api.getStaffList, staff.queryStaff)
    app.get(api.getStaffDetail, staff.queryStaffDetail)
    app.post(api.addStaff, staff.addStaff)
    app.post(api.updateStaff, staff.updateStaff)
    app.post(api.deleteStaff, staff.deleteStaff)

    // 账单
    app.get(api.getBillList, bill.queryBill)
    app.post(api.addBill, bill.addBill)
    app.post(api.updateBill, bill.updateBill)
    app.post(api.deleteBill, bill.deleteBill)
    app.post(api.auditorBill, bill.auditorBill)
    app.get(api.getBillDetail, bill.queryBillDetail)

    // 产品
    app.get(api.getGoodsList, goods.queryGoods)
    app.post(api.addGoods, goods.addGoods)
    app.post(api.updateGoods, goods.updateGoods)
    app.post(api.deleteGoods, goods.deleteGoods)
    app.get(api.getGoodsDetail, goods.queryGoodsDetail)

    // 库存
    app.get(api.getGoodsStore, store.queryGoodsStore)
    app.get(api.getStore, store.queryStore)
    app.post(api.createStore, store.createStore)
    app.post(api.deleteStore, store.deleteStore)
    app.post(api.updateStore, store.updateStore)
    app.get(api.storeDetail, store.queryStoreDetail)

    // 客户
    app.get(api.getUserList, user.queryUser)
    app.post(api.addUser, user.addUser)
    app.post(api.updateUser, user.updateUser)
    app.post(api.deleteUser, user.deleteUser)
    app.get(api.getUserDetail, user.queryUserDetail)

    // 卡类
    app.get(api.getCardList, card.queryCard)
    app.post(api.addCard, card.addCard)
    app.post(api.updateCard, card.updateCard)
    app.post(api.deleteCard, card.deleteCard)
    app.post(api.addUserToCard, card.addUserToCard)
    app.post(api.deleteUserFromCard, card.deleteUserFromCard)
    app.get(api.getCardDetail, card.queryCardDetail)

    // 套餐
    app.get(api.getSetMeal, setMeal.querySetmeal)
    app.post(api.addSetMeal, setMeal.addSetmeal)
    app.post(api.updateSetMeal, setMeal.updateSetmeal)
    app.post(api.deleteSetMeal, setMeal.deleteSetmeal)
    app.post(api.addSetmealSaleList, setMeal.addSetmealSaleList)
    app.post(api.updateSetmealSaleList, setMeal.updateSetmealSaleList)
    app.get(api.getSetmealSaleList, setMeal.querySetmealSaleList)
    app.get(api.getSetMealDetail, setMeal.querySetmealDetail)

    // 七牛上传
    app.get(api.getUploadToken, qiniuToken.getToken)
}