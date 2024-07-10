const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const auth = require('../middleware/jwtAuth');

router.get('/:id', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ buid: req.params.id });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post('/', auth, async (req, res) => {
    const booking = new Booking({
        car: req.body.car,
        renter: req.body.renter,
        renting:{
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        },
        totalCost: req.body.totalCost
    });

    try {
        await booking.save();
        const car = await Car.findOne( { cuid: req.body.car });
        car.status = 'booked';
        car.bookings.push(booking.buid);
        await car.save();
        const renter = await User.findOne( { uuid: req.body.renter });
        renter.bookings.push(booking.buid);
        await renter.save();
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne( { buid: req.params.id });
        const car = await Car.findOne( { cuid: booking.car });
        car.status = 'available';
        car.bookings = car.bookings.filter(booking => booking !== req.params.id);
        await car.save();
        const renter = await User.findOne( { uuid: booking.renter });
        renter.bookings = renter.bookings.filter(booking => booking !== req.params.id);
        await renter.save();
        await Booking.findOneAndDelete({ buid: req.params.id })
        res.json({ message: 'Booking removed' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post('/updatestatus/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne( { buid: req.params.id });
        booking.status = req.body.status;
        await booking.save();
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;