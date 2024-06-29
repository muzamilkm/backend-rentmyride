const express = require('express');
const bcrypt = require('bcrypt')
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid')
const router = express.Router();
const jwt = require('jsonwebtoken');

require ('dotenv').config();

const { google } = require('googleapis');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const oauth2client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SECRET_KEY = process.env.SECRET_KEY;

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

router.get("/oauth2", async (req, res) => {
    const url = oauth2client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile']
    });

    res.redirect(url);
});

router.get('/oauth2/google/callback', async (req, res) => {
    try{
        const code = req.query.code;
        const { tokens } = await oauth2client.getToken(code);
        oauth2client.setCredentials(tokens);
        const oauth2 = google.oauth2({
            auth: oauth2client,
            version: 'v2'
            });

        oauth2.userinfo.get((err, response) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error retrieving user info' + err });
            } else {
                res.json(response.data);
            }
            });
    }
    catch(error)
    {
        console.error("Error authenticating user " + error);
        res.status(500).json({ error: 'Server error' + error});
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

        const token = jwt.sign({ userId: user.uuid }, SECRET_KEY, { expiresIn: '48h' });
        return res.json({ userId: user.uuid, token: token});
    }
    catch(error){
        console.error("Error logging in user " + error);
        res.status(500).json({ error: 'Server error' + error});
    }
});

// router.post('/updateuser:id')
// {
//     try{
//         const { email, password, name, phone, location } = req.body;
        

        

//         res.status(201).json({ message: 'User updated' });
//     }
//     catch(error){
//         console.error("Error updating user " + error);
//         res.status(500).json({ error: 'Server error' + error });
//     }
// }

module.exports = router;