'use strict';
// With strict mode, you can not use undeclared variables.

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'OrderDetail';
const COLLECTION_NAME = 'OrderDetails';

const orderDetailSchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    dish_id: { type: Schema.Types.ObjectId, ref: 'Dish', required: true }, 
    quantity: { type: Number, required: true, min: 1 }                     
}, {
    timestamps: true,          
    collection: COLLECTION_NAME    
});

module.exports = model(DOCUMENT_NAME, orderDetailSchema);
