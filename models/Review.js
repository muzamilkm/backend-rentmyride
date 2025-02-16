const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const reviewSchema = new mongoose.Schema({
    ruid: { type: String, default: uuidv4, unique: true },
    car: { type: String, ref: 'Car', required: true },
    reviewer: { type: String, ref: 'User', required: true },
    rating: { type: String, required: true },
    comment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);