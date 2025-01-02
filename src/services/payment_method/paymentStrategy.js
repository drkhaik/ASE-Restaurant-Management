// PaymentStrategy.js
class PaymentStrategy {
    async pay(orderId) {
        throw new Error("This method should be overridden for detail payment!");
    }
}

export default PaymentStrategy;