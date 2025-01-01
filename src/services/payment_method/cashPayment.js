import PaymentStrategy from './paymentStrategy.js';
import { updatePaymentStatus } from '../payment.service.js';

class CashPayment extends PaymentStrategy {
    async pay(orderId) {
        return await updatePaymentStatus(orderId, 'cash', 'PAID');
    }
}

export default CashPayment;