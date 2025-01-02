import Payment from '../models/payment.model.js';
import Order from '../models/order.model.js';
import OrderDetail from '../models/orderDetail.model.js';
import Dish from '../models/dish.model.js';
import mongoose from 'mongoose';

import axios from 'axios';
import CryptoJS from 'crypto-js';
import moment from 'moment';

// Key for zalo payment
const config = {
  app_id: '554',
  key1: '8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn',
  key2: 'uUfsWgfLkRLzq6W2uNXTCxrfxs51auny',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create'
}

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
    throw new Error('Order not found!');
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


export const createOrder = async (findOrderDetail) => {
  const transID = Math.floor(Math.random() * 1000000)
  const embed_data = {
    redirecturl: 'http://localhost:3000/users'
  }
  const findOrder = await Order.findById(findOrderDetail.order_id)
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
    app_user: findOrder.staff_in_charge,
    app_time: Date.now(),
    item: JSON.stringify([
      {
        item_id: findOrderDetail.dish_id._id,
        item_name: findOrderDetail.dish_id.name,
        item_price: Math.round(findOrderDetail.dish_id.price * 1000),
        item_quantity: findOrderDetail.quantity,
      },
    ]),
    embed_data: JSON.stringify(embed_data),
    amount: findOrder.total_amount * 1000,
    description: `Payment for the order #${transID}`,
    bank_code: '',
    callback_url: 'https://0625-2403-e200-179-5c2c-8580-2716-a047-e53e.ngrok-free.app/payment/zalopay/callback'
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
    throw new Error(error.response?.data?.message || 'Something went wrong while connecting to Zalopay...')
  }
}

// for method payment has chosen and execute it
export const executePayment = async (paymentStrategy, orderId) => {
  return await paymentStrategy.pay(orderId);
};