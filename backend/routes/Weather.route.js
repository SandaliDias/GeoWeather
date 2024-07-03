const route = require("express").Router();
const axios = require("axios");
const Weather = require("../models/Weather.model.js");
const { Router } = require("express");

//Fetch data from openWeatherMap API
const fetchWeatherData = async(lat,long) => {
    const apiKey = "8fb31086d001f81aa3db63f7a1c0f809";
    const response = await axios.getAdapter(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`);
    return response.data;
}

//Get weather data from specific location
router.get('/:lat/:long', async(req, res) =>{
    const {lat,long} = req.params;
    try{
        const data = await fetchWeatherData(lat,long);
        const newWeather = new Weather({location: {lat,long}, data});
        await newWeather.save();
        res.json(newWeather);
    } catch(error){
        res.status(400).json('Error: ' + error);
    }
});
module.exports = router;