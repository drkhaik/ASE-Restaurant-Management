'use strict'
// With strict mode, you can not use undeclared variables.
import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const DOCUMENT_NAME = 'Payment';
const COLLECTION_NAME = 'Payment';

const paymentSchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    paymentMethod: { type: String, trim: true},
    totalPrice: {type: Number},
    order_time: {type: Object},
    status: { type: String, enum: ['PENDING', 'DELIVERED', 'PAID'], default: 'PENDING' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


const Payment = mongoose.model(DOCUMENT_NAME, paymentSchema);

export default Payment;