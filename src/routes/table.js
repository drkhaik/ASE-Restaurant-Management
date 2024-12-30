'use strict';

import Express from "express";
const router = Express.Router();
import {
    fetchAllTable,
    getTableCreate,
    postTableCreate,
    getTableDetail,
    postTableUpdate,
    deleteTable
}
from "../controllers/table.controller.js"

// Add table
router.get('/add-table', getTableCreate);
router.post('/add-table', postTableCreate);

// Get table
router.get('/', fetchAllTable);

// Table Details
router.get('/table-details/:id', getTableDetail);
router.post('/update-table', postTableUpdate); 
router.get('/:id', deleteTable);

export default router;