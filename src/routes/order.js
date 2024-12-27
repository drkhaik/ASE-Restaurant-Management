'use strict';

import Express from "express";
const router = Express.Router();
import {
    fetchAllOrder,
    getOrderCreate,
    postOrderCreate
}
from "../controllers/order.controller.js"

// Add order
router.get('/add-order', getOrderCreate);
router.post('/add-order', postOrderCreate);

// Get order
router.get('/', fetchAllOrder);

// Update order


export default router;