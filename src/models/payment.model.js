'use strict'
// With strict mode, you can not use undeclared variables.
import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const DOCUMENT_NAME = 'Payment';
const COLLECTION_NAME = 'Payment';

const paymentSchema = new Schema({
    name: { type: String, trim: true, maxLength: 150 },
    paymentMethod: { type: String, trim: true},
    totalPrice: {type: Number},
    status: { type: String, enum: [0,1], default: 1}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


const Payment = mongoose.model(DOCUMENT_NAME, paymentSchema);

export default Payment;