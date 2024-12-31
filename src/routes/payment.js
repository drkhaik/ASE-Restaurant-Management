'use strict';

import Express from "express";
import { getBill, getPaymentInfo, payWithCash, zaloPayment } from "../controllers/payment.controller.js";
import { checkPermission } from '../middleware/roleMiddleware.js';

const router = Express.Router();

// Display Payment info
router.get('/order-detail-pay/:id', checkPermission("manage_payments"), getPaymentInfo);

// Process payment with cash
router.post('/pay-with-cash', checkPermission("manage_payments"), payWithCash);

// Display Bill
router.get('/bill/:id', checkPermission("manage_payments"), getBill);

router.post('/zalopay', checkPermission("manage_payments"),zaloPayment)
export default router;
