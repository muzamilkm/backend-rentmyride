const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const bookingSchema = mongoose.Schema({
    buid: { type: String, default: uuidv4, unique: true },
    car: { type: String, ref: 'Car', required: true },
    renter: { type: String, ref: 'User', required: true },
    renting: {
        startDate: { type: String, required: true },
        endDate: { type: String, required: true }
    },
    totalCost: { type: String, required: true },
    status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema)