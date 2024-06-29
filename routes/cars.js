const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
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
        const car = await Car.findOne({ uuid: req.params.id});
        res.json(car);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post('/', auth, async (req, res) => {
    const car = new Car({
        name: req.body.name,
        brand: req.body.brand,
        year: req.body.year,
        pricePerDay: req.body.pricePerDay,
        availability: {
            startDate: req.body.startDate,
            endDate: req.body.endDate
        },
        location: req.body.location,
        owner: req.user.id
    });

    try {
        const savedCar = await car.save();
        res.json(savedCar);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const car = await Car.findOne({ uuid: req.params.id});
        car.name = req.body.name;
        car.brand = req.body.brand;
        car.year = req.body.year;
        car.pricePerDay = req.body.pricePerDay;
        car.availability.startDate = req.body.startDate;
        car.availability.endDate = req.body.endDate;
        car.location = req.body.location;
        const updatedCar = await car.save();
        res.json(updatedCar);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const car = await Car.findOne({ uuid: req.params.id });
        const removedCar = await Car.deleteOne({ uuid: req.params.id });
        res.json(removedCar);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});