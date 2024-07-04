const router = require("express").Router();
const axios = require("axios");
const Weather = require("../models/Weather.model.js");

// Fetch data from openWeatherMap API
const fetchWeatherData = async (lat, lon) => {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    return response.data;
}

// Get weather data from specific location
router.get('/:lat/:lon', async (req, res) => {
    const { lat, lon } = req.params;
    try {
        const data = await fetchWeatherData(lat, lon);
        const newWeather = new Weather({ location: { lat, lon }, data });
        await newWeather.save();
        res.json(newWeather);
    } catch (error) {
        res.status(400).json('Error: ' + error);
    }
});

module.exports = router;
