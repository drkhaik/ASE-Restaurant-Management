'use strict';
// With strict mode, you can not use undeclared variables.

const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

const { model, Schema, Types } = mongoose;
const Currency = mongoose.Types.Currency;

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const orderSchema = new Schema({
    staff_in_charge: { type: Schema.Types.ObjectId, ref: 'User', required: true  },
    total_amount: { type: Currency, required: true, min: 0 },
    currency: { type: String, enum: ['USD', 'EUR'], default: 'USD' },
    status: { type: String, enum: ['0', '1', '2'], default: '0' } // Order status (e.g., pending, completed, paid)
}, {
    timestamps: true,             
    collection: COLLECTION_NAME    
});

orderSchema.virtual('order_date').get(function() {
    return this.createdAt; // Access the createdAt field as order_date
});

module.exports = model(DOCUMENT_NAME, orderSchema);
