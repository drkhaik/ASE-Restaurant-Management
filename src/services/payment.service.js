import Payment from '../models/payment.model.js';
import Order from '../models/order.model.js';
import OrderDetail from '../models/orderDetail.model.js';
import Dish from '../models/dish.model.js';
import mongoose from 'mongoose';

import axios from 'axios';
import CryptoJS from 'crypto-js';
import moment from 'moment';
// Tìm Payment theo order_id
export const findPaymentByOrderId = async (orderId) => {
  return await Payment.findOne({ order_id: orderId });
};

// Tạo Payment mới
export const createPayment = async (order, paymentMethod) => {
  const newPayment = new Payment({
    order_id: order._id,
    paymentMethod,
    totalPrice: order.total_amount,
    status: 'PENDING',
  });
  return await newPayment.save();
};

// Lấy Order, OrderDetails và Dish
export const getOrderDetails = async (orderId) => {
  const order = await Order.findById(orderId)
  console.log(order?.status)
  if (!order) {
    throw new Error('Không tìm thấy đơn hàng!');
  }
  
  const objectId = mongoose.Types.ObjectId.isValid(orderId) ? new mongoose.Types.ObjectId(orderId) : null;
  const orderDetails = await OrderDetail.find({ order_id: objectId }).populate('dish_id');
  const details = orderDetails.map((item) => ({
    dish: {
      name: item.dish_id.name,
      price: parseFloat(item.dish_id.price.toString()),
    },
    quantity: item.quantity,
  }));
  return {
    _id: order._id,
    staff_in_charge: { name: order?.staff_in_charge?.name },
    total_amount: order.total_amount,
    status: order?.status,
    details,
    paymentMethod: 'paywithcash',
  };
};

// Cập nhật trạng thái thanh toán
export const updatePaymentStatus = async (orderId, method, status) => {
  return await Payment.findOneAndUpdate(
    { order_id: orderId },
    { paymentMethod: method, status },
    { new: true }
  );
};

// Tìm Payment theo _id
export const findPaymentById = async (paymentId) => {
  return await Payment.findById(paymentId).populate('order_id');
};

// Thanh toán với zaloPay
const config = {
  app_id: '2554',
  key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
  key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create'
}
export const createOrder = async (orderInfo) => {
  const transID = Math.floor(Math.random() * 1000000)
  const embed_data = {
    redirecturl: 'http://localhost:3000'
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
    callback_url: 'https://76c4-2403-e200-179-5c2c-59de-fcbe-d5a-49ef.ngrok-free.app/api/payment/zalopay/callback'
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

export const zaloPaymentCallbackService = async (dataStr, reqMac) => {
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
