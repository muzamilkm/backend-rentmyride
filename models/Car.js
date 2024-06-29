const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const carSchema = new mongoose.Schema({
    uuid: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    year: { type: Number, required: true },
    status: { type: String, default: 'available' },
    pricePerDay: { type: Number, required: true },
    availability: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true }
    },
    location: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);