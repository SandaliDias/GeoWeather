const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

console.log(process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 8010;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to DB");
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch((err) => console.log(err));

// Routes
const weatherRouter = require('./routes/Weather.route.js');
app.use('/weather', weatherRouter);
const userRouter = require('./routes/User.route.js');
app.use("/auth", userRouter);
const favoriteRouter = require('./routes/Favorite.route.js');
app.use("/favorites", favoriteRouter );