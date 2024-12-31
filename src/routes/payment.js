'use strict';

import Express from "express";
import {getBill, getPaymentInfo, payWithCash} from "../controllers/payment.controller.js"
const router = Express.Router();

// router.get('/', (req, res) => {
//     res.render('payment/form-payment', { title: 'payment' });
// });
// // router.get('/order-detail-pay/:id', getPaymentInfo);
// router.get('/order-detail-pay/:id', (req,res) => {
//     res.render('payment/form-payment', { title: 'PAYMENT', orders: sampleOrders })
// });
// router.post("/pay-with-cash", payWithCash);

// Hiển thị Payment hoặc tạo mới
router.get('/order-detail-pay/:id', getPaymentInfo);

// Thanh toán bằng tiền mặt
router.post('/pay-with-cash', payWithCash);

// Hiển thị hóa đơn
router.get('/bill/:id', getBill);

export default router;