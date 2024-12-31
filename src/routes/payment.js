'use strict';

import Express from "express";
import {getBill, getPaymentInfo, payWithCash, zaloPayment} from "../controllers/payment.controller.js"
const router = Express.Router();

// Hiển thị Payment hoặc tạo mới
router.get('/order-detail-pay/:id', getPaymentInfo);

// Thanh toán bằng tiền mặt
router.post('/pay-with-cash', payWithCash);

// Hiển thị hóa đơn
router.get('/bill/:id', getBill);

router.post('/zalopay', zaloPayment)
export default router;