import PaymentStrategy from './paymentStrategy.js';
import OrderDetail from '../../models/orderDetail.model.js';
import { createOrder, updatePaymentStatus } from '../payment.service.js';

class ZalopayPayment extends PaymentStrategy {
    async pay(orderId) {
        const findOrderDetail = await OrderDetail.find({ order_id: orderId }).populate('dish_id');
        const zalopayResponse = await createOrder(findOrderDetail[0]);

        if (zalopayResponse.return_code === 1) {
            await updatePaymentStatus(orderId, 'zalopay', 'PAID');
            return zalopayResponse.order_url;
        } else {
            throw new Error(zalopayResponse.return_message || 'Payment failure');
        }
    }
}

export default ZalopayPayment;