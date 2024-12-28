import Inventory from '../models/inventory.model.js';

export const createInventoryService = async (data) => {
    try {
        const inventory = new Inventory(data);
        await inventory.save();
        return { errCode: 0, message: 'Inventory created successfully', data: inventory };
    } catch (error) {
        return { errCode: 1, message: error.message };
    }
};

export const fetchAllInventoryService = async () => {
    try {
        const inventories = await Inventory.find({});
        return { errCode: 0, message: 'OK', data: inventories };
    } catch (error) {
        return { errCode: 1, message: error.message };
    }
};

export const fetchInventoryByIdService = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return { errCode: 1, message: 'Invalid ID format' };
        }
        const inventory = await Inventory.findById(id);
        if (!inventory) {
            return { errCode: 1, message: 'Inventory not found' };
        }
        return { errCode: 0, message: 'OK', data: inventory };
    } catch (error) {
        return { errCode: 1, message: error.message };
    }
};

export const updateInventoryService = async (id, data) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return { errCode: 1, message: 'Invalid ID format' };
        }
        const inventory = await Inventory.findByIdAndUpdate(id, data, { new: true });
        if (!inventory) {
            return { errCode: 1, message: 'Inventory not found' };
        }
        return { errCode: 0, message: 'Inventory updated successfully', data: inventory };
    } catch (error) {
        return { errCode: 1, message: error.message };
    }
};

export const deleteInventoryService = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return { errCode: 1, message: 'Invalid ID format' };
        }
        const inventory = await Inventory.findByIdAndDelete(id);
        if (!inventory) {
            return { errCode: 1, message: 'Inventory not found' };
        }
        return { errCode: 0, message: 'Inventory deleted successfully' };
    } catch (error) {
        return { errCode: 1, message: error.message };
    }
};