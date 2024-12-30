import Payment from '../models/payment.model.js';
import Order from '../models/order.model.js';
import OrderDetail from '../models/orderDetail.model.js';
import Dish from '../models/dish.model.js';
import mongoose from 'mongoose';

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
