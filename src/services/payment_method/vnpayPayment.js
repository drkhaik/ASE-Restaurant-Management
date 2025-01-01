import moment from 'moment';
import crypto from 'crypto';
import PaymentStrategy from './paymentStrategy.js';
import querystring from 'qs';
import { fetchTotalAmountOfOrderById } from '../order.service.js';

const sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

class VnpayPayment extends PaymentStrategy {
    async pay(orderId) {
        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');
        const tmnCode = process.env.VNP_TMNCODE;
        const secretKey = process.env.VNP_HASHSECRET;
        const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        const returnUrl = "http://localhost:8000/payment/vnpay_return";
        // "vnp_Api": "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
        // let ipAddr = req.headers['x-forwarded-for'] ||
        //     req.connection.remoteAddress ||
        //     req.socket.remoteAddress ||
        //     req.connection.socket.remoteAddress;
            
        const bankCode = "VNBANK";
        const ipAddr = '192.168.1.1';

        console.log("check tmnCode", tmnCode);
        console.log("check secretKey", secretKey);
        const order = await fetchTotalAmountOfOrderById(orderId);
        if (!order) {
            throw new Error("Order not found");
        }
        console.log("check order", order);

        const totalAmount = order.total_amount;
        const amountInVND = totalAmount * 23000; 

        const vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Locale: 'en',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: `Thanh toan cho don hang: ${orderId}`,
            vnp_OrderType: 'other',
            vnp_Amount: amountInVND * 100,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
            // vnp_BankCode: bankCode
        };
        
        // Tạo chữ ký
        const sortedParams = sortObject(vnp_Params);
        console.log("check vnp_Params", sortedParams)
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        // console.log("check signData", signData);
        const paymentUrl = `${vnpUrl}?${querystring.stringify(vnp_Params, { encode: false })}`;
        return paymentUrl;
    }
}

export default VnpayPayment;