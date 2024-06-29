const express = require('express')
const mongoose = require('mongoose');

const cors = require('cors')
const port = process.env.PORT || 4306;
require('dotenv').config();

const { google } = require('googleapis');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const oauth2client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const app = express();

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI, {
    
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
})

app.use("/api/users", require("./routes/users"));

app.get("/api/test", (req, res) => {
    res.json({ message: "Express application for RentMyRide running (test)!" });
})

app.get("/api/oauth2", async (req, res) => {
    const url = oauth2client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile']
    });

    res.redirect(url);
});

app.get('/oauth2/google/callback', async (req, res) => {
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

app.listen(port, () => {
    console.log("Express Application for RentMyRide running on port " + port);
})