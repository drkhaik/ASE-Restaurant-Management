'use strict'
// With strict mode, you can not use undeclared variables.

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const userSchema = new Schema({
    name: { type: String, trim: true, maxLength: 150 },
    username: { type: String, trim: true, unique: true },
    email: { type: String, trim: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive'},
    roles: { type: String }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


module.exports = model(DOCUMENT_NAME, userSchema);