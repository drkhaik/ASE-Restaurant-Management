import { 
  findPaymentByOrderId, 
  createPayment, 
  getOrderDetails, 
  updatePaymentStatus, 
  findPaymentById, 
  createOrder
} from '../services/payment.service.js';
import Order from "../models/order.model.js"
import OrderDetail from '../models/orderDetail.model.js';
// Lấy thông tin hoặc tạo Payment
export const getPaymentInfo = async (req, res) => {
  const { id } = req.params;
  try {
    // Kiểm tra nếu Payment đã tồn tại
    let payment = await findPaymentByOrderId(id);
    // Nếu chưa tồn tại, tạo mới
    if (!payment) {
      const order = await getOrderDetails(id);
      payment = await createPayment(order, 'paywithcash');
      // Gắn dữ liệu của order vào payment để render
      payment = {
        ...order,
        paymentMethod: payment.paymentMethod,
      };
    } else {
      const order = await getOrderDetails(payment.order_id.toString());
      payment = {
        ...order,
        paymentMethod: payment.paymentMethod,
      };
    }
    // Render giao diện
    res.render('payment/form-payment', {
      title: 'Payment',
      orders: [payment],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin Payment!' });
  }
};

// Thanh toán bằng tiền mặt
export const payWithCash = async (req, res) => {
  const { orderId } = req.body;
  try {
    const updatedPayment = await updatePaymentStatus(orderId, 'cash', 'PAID');
    if (!updatedPayment) {
      return res.status(404).json({ message: 'Không tìm thấy Payment!' });
    }

    res.redirect(`/payment/bill/${updatedPayment._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi từ server...' });
  }
};

// Hiển thị hóa đơn
export const getBill = async (req, res) => {
  const {id} = req.params;
  try {
    const payment = await findPaymentById(id);
    console.log(payment)
    if (!payment) {
      return res.status(404).json({ message: 'Không tìm thấy Payment!' });
    }

    const order = await getOrderDetails(payment.order_id);

    res.render('payment/form-billing', {
      title: 'Hóa Đơn',
      payment: {
        ...order,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi từ server!' });
  }
};

// Thanh toán với zalopay
export const zaloPayment = async (req, res) => {
  try {
    const findOrderDetail = await OrderDetail.find({order_id: req.body.orderInfo}).populate('dish_id');
    const zaloPayResponse = await createOrder(findOrderDetail[0])
    if (zaloPayResponse.return_code === 1) {
      const updatedPayment = await updatePaymentStatus(req.body.orderInfo, 'zalopay', 'PAID');
      if (!updatedPayment) {
        return res.status(404).json({ message: 'Không tìm thấy Payment!' });
      }
      // Chuyển hướng đến URL thanh toán
      return res.redirect(zaloPayResponse.order_url);
    }

    res.status(400).json({
      message: zaloPayResponse.return_message || 'Giao dịch không thành công',
    });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

