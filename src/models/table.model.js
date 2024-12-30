'use strict';
// With strict mode, you can not use undeclared variables.

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Table';
const COLLECTION_NAME = 'Tables';

const tableSchema = new Schema({
    name: { type: String , required: true, unique: true},
    status: { type: String, enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED'], default: 'AVAILABLE' },        
    currentOrder: { type: Schema.Types.ObjectId, ref: 'Order'},           
}, {
    timestamps: true,          
    collection: COLLECTION_NAME
});

const Table = mongoose.model(DOCUMENT_NAME, tableSchema);

export default Table
