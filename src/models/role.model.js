import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const COLLECTION_NAME = 'Roles';

const roleSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
}, { 
    timestamps: true,
    collection: COLLECTION_NAME
 });

const Role = mongoose.model('Role', roleSchema);

export default Role;