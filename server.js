const express = require('express')
const mongoose = require('mongoose');

const cors = require('cors')
const port = process.env.PORT || 4306;
require('dotenv').config();

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
app.use("/api/cars", require("./routes/cars"));
app.use("/api/bookings", require("./routes/bookings"));

app.get("/api/test", (req, res) => {
    res.json({ message: "Express application for RentMyRide running (test)!" });
})


app.listen(port, () => {
    console.log("Express Application for RentMyRide running on port " + port);
})