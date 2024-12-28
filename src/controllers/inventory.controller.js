import {
    createInventoryService,
    fetchAllInventoryService,
    fetchInventoryByIdService,
    updateInventoryService,
    deleteInventoryService
} from '../services/inventory.service.js';

export const renderAddInventoryForm = (req, res) => {
    res.render('inventory/form-add-inventory', { title: 'Add Inventory' });
};

export const handleAddInventory = async (req, res) => {
    const { body } = req;
    const result = await createInventoryService(body);
    if (result.errCode === 0) {
        res.redirect('/manage-inventory');
    } else {
        res.status(400).render('form-add-inventory', { title: 'Add Inventory', error: result.message });
    }
};

export const renderEditInventoryForm = async (req, res) => {
    const { id } = req.params;
    const result = await fetchInventoryByIdService(id);
    if (result.errCode === 0) {
        res.render('inventory/form-edit-inventory', { title: 'Edit Inventory', inventory: result.data });
    } else {
        res.status(404).render('error', { message: result.message });
    }
};

export const handleEditInventory = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const result = await updateInventoryService(id, body);
    if (result.errCode === 0) {
        res.redirect('/manage-inventory');
    } else {
        res.status(400).render('form-edit-inventory', { title: 'Edit Inventory', error: result.message });
    }
};

export const renderManageInventory = async (req, res) => {
    const result = await fetchAllInventoryService();
    // const Inven=[
    //     {
    //       "id": "1",
    //       "name": "Laptop",
    //       "quantity": 20,
    //       "price": 1200,
    //       "category": "Electronics",
    //       "description": "High-performance laptop suitable for all tasks."
    //     },
    //     {
    //       "id": "2",
    //       "name": "Desk Chair",
    //       "quantity": 15,
    //       "price": 150,
    //       "category": "Furniture",
    //       "description": "Ergonomic chair for office use."
    //     },
    //     {
    //       "id": "3",
    //       "name": "Coffee Maker",
    //       "quantity": 50,
    //       "price": 80,
    //       "category": "Appliances",
    //       "description": "Brews coffee in under 5 minutes."
    //     }
    //   ]
    if (result.errCode === 0) {
        res.render('inventory/manage-inventory', { title: 'Manage Inventory', inventories: result.data }); //inventories: result.data
    } else {
        res.status(500).render('error', { message: result.message });
    }
};

export const handleDeleteInventory = async (req, res) => {
    const { id } = req.params;
    const result = await deleteInventoryService(id);
    if (result.errCode === 0) {
        res.redirect('inventory/manage-inventory');
    } else {
        res.status(400).render('manage-inventory', { title: 'Manage Inventory', error: result.message });
    }
};
