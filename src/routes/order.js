'use strict';

import Express from "express";
const router = Express.Router();
import {
    fetchAllOrder,
    getOrderCreate,
    postOrderCreate,
    getOrderEdit,
    postOrderUpdate,
    deleteOrder
}
from "../controllers/order.controller.js"

// Add order
router.get('/add-order', getOrderCreate);
router.post('/add-order', postOrderCreate);

// Get order
router.get('/', fetchAllOrder);

// Update order
router.get('/edit-order/:id', getOrderEdit);
router.post('/update-order', postOrderUpdate); 

// Delete order
router.get('/:id', deleteOrder);

export default router;