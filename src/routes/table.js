'use strict';

import Express from "express";
import {
    fetchAllTable,
    getTableCreate,
    postTableCreate,
    getTableDetail,
    postTableUpdate,
    deleteTable
} from "../controllers/table.controller.js";
import { checkPermission } from '../middleware/roleMiddleware.js';

const router = Express.Router();

// Add table
router.get('/add-table', checkPermission("manage_tables"), getTableCreate);
router.post('/add-table', checkPermission("manage_tables"), postTableCreate);

// Get table
router.get('/', checkPermission("view_tables"), fetchAllTable);

// Table Details
router.get('/table-details/:id', checkPermission("view_tables"), getTableDetail);
router.post('/update-table', checkPermission("manage_tables"), postTableUpdate);

// Delete table
router.get('/:id', checkPermission("manage_tables"), deleteTable);

export default router;
