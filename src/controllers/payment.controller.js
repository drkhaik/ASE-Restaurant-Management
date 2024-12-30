import { 
  findPaymentByOrderId, 
  createPayment, 
  getOrderDetails, 
  updatePaymentStatus, 
  findPaymentById 
} from '../services/payment.service.js';

// Lấy thông tin hoặc tạo Payment
export const getPaymentInfo = async (req, res) => {
  const { id } = req.params;
  try {
    // Kiểm tra nếu Payment đã tồn tại
    let payment = await findPaymentByOrderId(id);
    console.log(payment)
    // Nếu chưa tồn tại, tạo mới
    if (!payment) {
      const order = await getOrderDetails(id);
      console.log("Đay là order ", order)
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
    console.log("Orders", payment)
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
  console.log(orderId, "Hello")
  try {
    const updatedPayment = await updatePaymentStatus(orderId, 'cash', 'PAID');
    if (!updatedPayment) {
      console.log(updatedPayment)
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
  const { id } = req.params;
  try {
    const payment = await findPaymentById(id);

    if (!payment) {
      return res.status(404).json({ message: 'Không tìm thấy Payment!' });
    }

    const order = await getOrderDetails(payment.order_id);

    res.render('payment/form-billing', {
      title: 'Hóa Đơn',
      payment: {
        ...order,
        paymentMethod: payment.paymentMethod,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi từ server!' });
  }
};
