import Payment from '../models/payment.model'
const axios = require('axios')
const CryptoJS = require('crypto-js')
const moment = require('moment')
const config = {
    app_id: '2554',
    key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
    key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create'
}
const createOrder = async (orderInfo) => {
const transID = Math.floor(Math.random() * 1000000)
const embed_data = {
    redirecturl: 'http://localhost:5173'
}
const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: orderInfo.user,
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(orderInfo.items),
    embed_data: JSON.stringify(embed_data),
    amount: orderInfo.amount,
    description: `Lazada - Payment for the order #${transID}`,
    bank_code: orderInfo.bankCode,
    callback_url: 'https://5085-27-2-128-132.ngrok-free.app/api/payment/zalopay/callback'
}
console.log(`App trans iD is ${moment().format('YYMMDD')}_${transID}`)
const data =
    config.app_id +
    '|' +
    order.app_trans_id +
    '|' +
    order.app_user +
    '|' +
    order.amount +
    '|' +
    order.app_time +
    '|' +
    order.embed_data +
    '|' +
    order.item
order.mac = CryptoJS.HmacSHA256(data, config.key1).toString()
try {
    // Gửi request đến Zalo Pay
    const response = await axios.post(config.endpoint, null, { params: order })
    return response.data
} catch (error) {
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi kết nối Zalo Pay')
}
}

const zaloPaymentCallback = async (dataStr, reqMac) => {
let result = {}
try {
    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString()
    if (reqMac !== mac) {
    // callback không hợp lệ
    result.returncode = -1
    result.returnmessage = 'mac not equal'
    } else {
    // thanh toán thành công
    // merchant cập nhật trạng thái cho đơn hàng
    let dataJson = JSON.parse(dataStr, config.key2)
    // Lấy orderID từ order mới tạo
    const orderId = JSON.parse(dataJson.item)
    const orderUpdate = await Order.findByIdAndUpdate(orderId[0].orderId, { isPaid: true }, { new: true })
    console.log(orderUpdate)
    console.log("update order's status = success where app_trans_id =", dataJson['app_trans_id'])
    result.return_code = 1
    result.return_message = 'success'
    }
} catch (ex) {
    result.return_code = 0 // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message
}
// thông báo kết quả cho ZaloPay server
return result
}
export const updatePay = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let payment = await Payment.findOne({
                // raw: true,
                _id: id
            })
            if (!payment) {
                resolve({
                    status: 'error',
                    message: "Payment not found"
                })
            }
            const updatePayment = await Payment.findByIdAndUpdate(id, {status: "1"}, { new: true })
            resolve({
                errCode: 0,
                message: "OK",
                data: updatePayment
            })
        } catch (e) {
            reject(e)
        }
    })
}

export const paymentWithZalopay = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let payment = await Payment.findOne({
                // raw: true,
                _id: id
            })
            if (!payment) {
                resolve({
                    status: 'error',
                    message: "Payment not found"
                })
            }
            const updatePayment = await Payment.findByIdAndUpdate(id, {status: "1"}, { new: true })
            resolve({
                errCode: 0,
                message: "OK",
                data: updatePayment
            })
        } catch (e) {
            reject(e)
        }
    })
}