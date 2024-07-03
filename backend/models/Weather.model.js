const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const weatherSchema = new Schema({
    location : {
        type : {lat: Number, long: Number},
        required : true
    },
    data: {
        type: Object,
        required: true
    }
}, {
    timestamps: true
});

const Weather = mongoose.model("Weather", weatherSchema);

module.exports = Weather;