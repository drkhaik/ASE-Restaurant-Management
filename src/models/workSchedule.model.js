'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'WorkSchedule';
const COLLECTION_NAME = 'WorkSchedules';

const workScheduleSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shift: { type: String, required: true },
    date: { type: Date, required: true },
    performance_score: { type: Number, min: 0, max: 100 },
    comments: { type: String, trim: true },
    evaluator_by: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, workScheduleSchema);