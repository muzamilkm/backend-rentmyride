const express = require('express');
const bcrypt = require('bcrypt')
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid')
const router = express.Router();

router.post('/signup', async (req, res) => {
    try {

        const { email, password, name, phone, location } = req.body;
        if (!email || !password || !name || !phone || !location) {
            return res.status(400).json({ error: 'Please enter all fields' });
        }

        const user = new User({ email, password, name, phone, location });
        await user.save();

        res.status(201).json({ message: 'User created' });
    }
    catch(error){
        console.error("Error creating user " + error);
        res.status(500).json({ error: 'Server error' + error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Please enter all fields' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.json({ message: 'User logged in' });
    }
    catch(error){
        console.error("Error logging in user " + error);
        res.status(500).json({ error: 'Server error' + error});
    }
});

router.post('/update:id')

module.exports = router;