import { 
  findPaymentByOrderId, 
  createPayment, 
  getOrderDetails,
  executePayment,
  updatePaymentStatus
} from '../services/payment.service.js';
import CashPayment from '../services/payment_method/cashPayment.js';
import ZalopayPayment from '../services/payment_method/zalopayPayment.js';
import VnpayPayment from '../services/payment_method/vnpayPayment.js';

const paymentStrategies = {
  cash: CashPayment,
  zalopay: ZalopayPayment,
  vnpay: VnpayPayment,
};

// Get Payment Info
export const getPaymentInfo = async (req, res) => {
  const { id } = req.params;
  try {
    let payment = await findPaymentByOrderId(id);
    if (!payment) {
      const order = await getOrderDetails(id);
      payment = await createPayment(order, 'paywithcash');
      // Attach data of order to payment for rendering
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
    // Render UI
    res.render('payment/form-payment', {
      title: 'Payment',
      orders: [payment],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error from server...' });
  }
};

// Get bill
export const getBill = async (req, res) => {
  const {id} = req.params;
  try {
    // console.log("check id", id);
    const payment = await findPaymentByOrderId(id);
    // console.log("check payment", payment)
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found!' });
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
    res.status(500).json({ message: 'Error from server...' });
  }
};

// handle payment with PaymentStrategy (Strategy Pattern)
export const handlePayment = async (req, res) => {
  const { orderId, method } = req.body;
  const PaymentStrategy = paymentStrategies[method];

  if (!PaymentStrategy) {
    return res.status(400).send("Invalid payment method");
  }

  const paymentStrategy = new PaymentStrategy();

  try {
    const result = await executePayment(paymentStrategy, orderId);
    processReturn(res, result, method, orderId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process the return based on the payment method
const processReturn = (res, result, method, orderId) => {
  if (method === 'vnpay' || method === 'zalopay') {
    return res.redirect(result);
  }
  res.redirect(`/payment/bill/${orderId}`);
};


// export const handlePayment = async (req, res) => {
//   const { orderId, method } = req.body;
//   const PaymentStrategy = paymentStrategies[method];
//   if (!PaymentStrategy) {
//     return res.status(400).send("Invalid payment method");
//   }

//   const paymentStrategy = new PaymentStrategy();

//   try {
//     const result = await executePayment(paymentStrategy, orderId);

//     if (method === 'vnpay') {
//       return res.redirect(result);
//     }
//     if (method === 'zalopay') {
//       return res.redirect(result);
//     }
//     res.redirect(`/payment/bill/${orderId}`);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const vnpayReturn = async (req, res) => {
  const responseParams = req.query;

  if (responseParams.vnp_ResponseCode === '00') {
    await updatePaymentStatus(responseParams.vnp_TxnRef, 'vnpay', 'PAID');
    res.render('payment/vnp-return', {
      title: "Ket Qua GD",
      message: "Giao dịch thành công",
      id: responseParams.vnp_TxnRef
    });
  } else {
    res.send('Giao dịch không thành công. Mã lỗi: ' + responseParams.vnp_ResponseCode);
  }
};