const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config()

const app = express();
const PORT = 8010;

//Midlleware
app.use(cors());
app.use(express.json());

//MongoDB Connection
const uri = "mongodb+srv://user:geoweather@cluster0.9zsin18.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri)
.then(() => {
    console.log("Connect to DB")
    app.listen(PORT, () => console.log("Server is running..."))
})
.catch((err) => console.log(err))

//Routes
const weatherRouter = require('./routes/Weather.route.js')
app.use('/weather', weatherRouter);