import express from 'express';
import {
    renderAddInventoryForm,
    handleAddInventory,
    renderEditInventoryForm,
    handleEditInventory,
    renderManageInventory,
    handleDeleteInventory
} from '../controllers/inventory.controller.js';

  
const router = express.Router();

// Route to render "Add Inventory" form
router.get('/add-inventory', renderAddInventoryForm);

// Route to handle adding inventory
router.post('/add-inventory', handleAddInventory);

// Route to render "Edit Inventory" form
router.get('/edit-inventory/:id', renderEditInventoryForm);

// Route to handle editing inventory
router.post('/update-inventory/:id', handleEditInventory);

// Route to render "Manage Inventory" page
router.get('/', renderManageInventory);

// Route to handle deleting inventory
router.post('/delete-inventory/:id', handleDeleteInventory);

export default router;
