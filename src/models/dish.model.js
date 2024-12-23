'use strict';
// With strict mode, you cannot use undeclared variables.

const mongoose = require('mongoose');
const { model, Schema, Types } = mongoose;

const DOCUMENT_NAME = 'Dish';
const COLLECTION_NAME = 'Dishes';

const dishSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Schema.Types.Decimal128, required: true },
    category: { type: String, enum: ['starter', 'main dish', 'dessert'], required: true }
}, {
    timestamps: true,          
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, dishSchema);
