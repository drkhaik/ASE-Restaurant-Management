'use strict';

import Express from "express";
import {
    fetchAllOrder,
    getOrderCreate,
    postOrderCreate,
    getOrderEdit,
    postOrderUpdate,
    deleteOrder
} from "../controllers/order.controller.js";
import { checkPermission } from '../middleware/roleMiddleware.js';

const router = Express.Router();

// Add order
router.get('/add-order', checkPermission("manage_orders"), getOrderCreate);
router.post('/add-order', checkPermission("manage_orders"), postOrderCreate);

// Get orders
router.get('/', checkPermission("view_orders"), fetchAllOrder);

// Update order
router.get('/edit-order/:id', checkPermission("manage_orders"), getOrderEdit);
router.post('/update-order', checkPermission("manage_orders"), postOrderUpdate);

// Delete order
router.get('/:id', checkPermission("manage_orders"), deleteOrder);

export default router;
