'use strict';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, trim: true },
    description: { type: String, trim: true },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const Inventory = mongoose.model(DOCUMENT_NAME, inventorySchema);
export default Inventory;