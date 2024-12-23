'use strict'
// With strict mode, you can not use undeclared variables.
import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const userSchema = new Schema({
    name: { type: String, trim: true, maxLength: 150 },
    username: { type: String, trim: true, unique: true },
    email: { type: String, trim: true },
    password: { type: String, required: true },
    status: { type: String, enum: [0,1], default: 0},
    role_id: { type: Schema.Types.ObjectId, ref: 'Role' }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


const User = mongoose.model('User', userSchema);

export default User;