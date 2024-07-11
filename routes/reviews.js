const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Car = require('../models/Car');
const User = require('../models/User');
const auth = require('../middleware/jwtAuth');

router.get('/:id', auth, async (req, res) => {
    try {
        const reviews = await Review.find({ cuid: req.params.id })
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/user/:id', auth, async (req, res) => {
    try {
        const reviews = await Review.find({ reviewer: req.params.id })
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

router.post('/:id', auth, async (req, res) => {
    try {
        const review = new Review( { 
            car: req.params.id, 
            reviewer: req.body.reviewer, 
            rating: req.body.rating, 
            comment: req.body.comment });
        const car = await Car.findOne({ cuid: req.params.id });
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        await review.save();
        car.reviews.push(review.ruid);
        await car.save();
        const reviewer = await User.findOne({ uuid: req.body.reviewer });
        reviewer.reviews.push(review.ruid);
        await reviewer.save();
        res.json(review);
        
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findOne({ ruid: req.params.id });
        if (!review)
            return res.status(404).json({ message: "Review not found" });
        review.rating = req.body.rating;
        review.comment = req.body.comment;
        await review.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findOne({ ruid: req.params.id });
        if (!review)
            return res.status(404).json({ message: "Review not found" });
        const reviewer = await User.findOne({ uuid: review.reviewer });
        reviewer.reviews = reviewer.reviews.filter(r => r !== review.ruid);
        await reviewer.save();
        const car = await Car.findOne({ cuid: review.car });
        car.reviews = car.reviews.filter(r => r !== review.ruid);
        await car.save();
        await review.deleteOne( { ruid: req.params.id });
        res.json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

module.exports = router;