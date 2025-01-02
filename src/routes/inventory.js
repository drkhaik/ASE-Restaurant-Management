'use strict';

import express from 'express';
import {
    renderAddInventoryForm,
    handleAddInventory,
    renderEditInventoryForm,
    handleEditInventory,
    renderManageInventory,
    handleDeleteInventory
} from '../controllers/inventory.controller.js';
import { checkPermission } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Route to render "Add Inventory" form
router.get('/add-inventory', checkPermission("manage_inventory"), renderAddInventoryForm);

// Route to handle adding inventory
router.post('/add-inventory', checkPermission("manage_inventory"), handleAddInventory);

// Route to render "Edit Inventory" form
router.get('/edit-inventory/:id', checkPermission("manage_inventory"), renderEditInventoryForm);

// Route to handle editing inventory
router.post('/update-inventory/:id', checkPermission("manage_inventory"), handleEditInventory);

// Route to render "Manage Inventory" page
router.get('/', checkPermission("view_inventory"), renderManageInventory);

// Route to handle deleting inventory
router.post('/delete-inventory/:id', checkPermission("manage_inventory"), handleDeleteInventory);

export default router;
