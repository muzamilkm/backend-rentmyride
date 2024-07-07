const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const carSchema = new mongoose.Schema({
    cuid: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    year: { type: Number, required: true },
    status: { type: String, default: 'Available' },
    pricePerDay: { type: Number, required: true },
    availability: {
        startDate: { type: String, required: true },
        endDate: { type: String, required: true }
    },
    location: { type: String, required: true },
    owner: { type: String, ref: 'User' },
    description: { type: String },
    bookings: [{ type: String, ref: 'Booking' }],
    reviews: [{ type: String, ref: 'Review' }]
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);