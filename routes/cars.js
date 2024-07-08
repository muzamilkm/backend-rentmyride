const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const User = require('../models/User');
const auth = require('../middleware/jwtAuth');

router.get('/', auth, async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const car = await Car.findOne({ cuid: req.params.id});
        res.json(car);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post('/', auth, async (req, res) => {
    try{
        console.log('Request body:', req.body);
        const { name, brand, year, pricePerDay, startDate, endDate, location, owner, description } = req.body;

        if (!name || !brand || !year || !pricePerDay || !startDate || !endDate || !location || !owner) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const car = new Car({
            name,
            brand,
            year,
            pricePerDay,
            availability: {
                startDate,
                endDate
            },
            location,
            owner,
            description
        });

        const savedCar = await car.save();

        await User.updateOne({ uuid: owner }, { $push: { cars: car.cuid } });

        res.json(savedCar);
    } catch (err) {
        console.error('Error saving car:', err);
        res.status(500).json({ error: err.message || 'Server error' });
    }
});
    

router.put('/:id', auth, async (req, res) => {
    try {
        const car = await Car.findOne({ cuid: req.params.id});
        if (req.body.name)
            car.name = req.body.name;
        if (req.body.brand)
            car.brand = req.body.brand;
        if (req.body.year)
            car.year = req.body.year;
        if (req.body.status)
            car.status = req.body.status;
        if (req.body.pricePerDay)
            car.pricePerDay = req.body.pricePerDay;
        if (req.body.startDate)
            car.availability.startDate = req.body.startDate;
        if (req.body.endDate)
            car.availability.endDate = req.body.endDate;
        if (req.body.location)
            car.location = req.body.location;
        if (req.body.owner)
            car.description = req.body.description;
        await car.save();
        res.json(car);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const car = await Car.findOne({ cuid: req.params.id });
        await Car.deleteOne({ cuid: req.params.id });
        res.json(car);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/getByOwner/:id', auth, async (req, res) => {
    try {
        const cars = await Car.find({ owner: req.params.id });
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post('/updatestatus/:id', auth, async (req, res) => {
    try {
        const car = await Car.findOne({ cuid: req.params.id });
        car.status = req.body.status;
        await car.save();
        res.json(car);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/getByLocation', auth, async (req, res) => {
    try {
        const cars = await Car.find({ location: req.body.location });
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;