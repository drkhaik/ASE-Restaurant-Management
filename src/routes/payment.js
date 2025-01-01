'use strict';

import Express from "express";
import { getBill, getPaymentInfo, handlePayment, vnpayReturn } from "../controllers/payment.controller.js"
const router = Express.Router();

// Display Payment info
router.get('/order-detail-pay/:id', getPaymentInfo);

/**
  * @description Payment (cash, zalopay,...)
  * @param {ObjectId} orderId
  * @param {String} method
  * @method POST
  */
router.post('/pay', handlePayment);
router.get('/vnpay_return', vnpayReturn);

// Display Bill
router.get('/bill/:id', getBill);

export default router;
