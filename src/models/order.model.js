'use strict';
// With strict mode, you can not use undeclared variables.

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const orderSchema = new Schema(
    {
        staff_in_charge: { type: Schema.Types.ObjectId, ref: 'User', required: true },

        total_amount: { type: Number, required: true, min: 0 },

        status: { type: String, enum: ['PENDING', 'DELIVERED', 'PAID'], default: 'PENDING' },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }, 
    }
);

const Order = mongoose.model(DOCUMENT_NAME, orderSchema);

export default Order;
