'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'WorkSchedule';
const COLLECTION_NAME = 'WorkSchedules';

const workScheduleSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shift: { type: String, required: true },
    date: { type: Date, required: true },
    performance_score: { type: Number, min: 0, max: 100 },
    comments: { type: String, trim: true },
    evaluator_by: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const WorkSchedule = mongoose.model(DOCUMENT_NAME, workScheduleSchema);

export default WorkSchedule;