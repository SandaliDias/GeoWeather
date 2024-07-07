import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { Button, Input, Card, CardHeader, CardBody, CardFooter, Typography, Select, Option, Popover, PopoverContent, PopoverHandler} from "@material-tailwind/react";

import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

// Fix for missing marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const southAsiaBounds = [
  [5, 60],  // Southwest
  [40, 100] // Northeast
];

const capitalCities = {
  'Dhaka': { lat: 23.8103, lon: 90.4125 },
  'Thimphu': { lat: 27.4728, lon: 89.6390 },
  'New Delhi': { lat: 28.6139, lon: 77.2090 },
  'Malé': { lat: 4.1755, lon: 73.5093 },
  'Kathmandu': { lat: 27.7172, lon: 85.3240 },
  'Islamabad': { lat: 33.6844, lon: 73.0479 },
  'Colombo': { lat: 6.9271, lon: 79.8612 },
  'Kabul': { lat: 34.5553, lon: 69.2075 },
};

function LocationMarker({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      console.log("Map clicked at:", e.latlng);
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

function SetMapCenter({ latlng }) {
  const map = useMap();
  map.setView(latlng, map.getZoom());
  return null;
}

const weatherImages = {
    Clear: 'https://clarksvillenow.sagacom.com/files/2020/10/shutterstock_206307496-1200x768.jpg',
    Clouds: 'https://img.freepik.com/free-photo/sky-covered-with-clouds_1122-742.jpg',
    Rain: 'https://static.vecteezy.com/system/resources/previews/042/146/565/non_2x/ai-generated-beautiful-rain-day-view-photo.jpg',
    Snow: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS21-EiJfMk0ieYafjg5AvMOOhTwtqYiov1g&s',
    Thunderstorm: 'https://s.w-x.co/thunderstormasthma.jpg',
    Drizzle: 'https://images.ctfassets.net/4ivszygz9914/5d6ff03c-f52a-4139-99ba-27c341ae42ce/d45b70e4bee347e4e2350ca65f915d1b/d97a3c44-dd44-4f3e-98f8-19cff669e2ad.jpeg?fm=webp',
    Mist: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6ppLr6JgPXrVNGz2kxCw2-fefNS56Je5Ypw&s',
    Smoke: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyQGRTTkzaIT6qT3jf7awccef6WH0e6WkDYA&s',
    Haze: 'https://d2h8hramu3xqoh.cloudfront.net/blog/wp-content/uploads/2022/08/Hazy-Skies-scaled.webp',
    Dust: 'https://www.shutterstock.com/image-photo/climate-change-africa-dramatic-dusty-600nw-1751879375.jpg',
    Fog: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSIAtQyvSXGAbyLN_FeUlsZAEx3nLllPFkVw&s',
    Tornado: 'hhttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQXPYZGQgLSIg9GQhhCkjQDX8hciAhzUva6w&s',
};

function getImageUrl(weather) {
    if (weather) {
      return weatherImages[weather] || 'https://example.com/default-weather.jpg';
    }
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMJ04aqNYUZTOUb37AA9kjT6SlKzZmhn8aMw&s';
}

export default function Prediction() {
  const [prediction, setPrediction] = useState(null);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');

  const handleLocationSelect = (latlng) => {
    setLocation(latlng);
    setSelectedCity('');
    console.log("Selected location:", latlng);
  };

  const handleCitySelect = (value) => {
    const city = value;
    const cityData = capitalCities[city];
    setLocation(cityData);
    setSelectedCity(city);
    console.log("Selected city:", city, "Location:", cityData);
  };

  const fetchPrediction = async () => {
    if (!date) {
      alert('Please select a date');
      return;
    }
  
    // Format date using date-fns
    const formattedDate = format(new Date(date), "yyyy-MM-dd");
  
    try {
      const response = await axios.get('http://127.0.0.1:8010/predict', {
        params: {
          date: formattedDate,
          city: selectedCity,
          lat: location.lat,
          lon: location.lon,
        },
      });
      setPrediction(response.data);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  return (
    <div className="Prediction">
      <h1 className="text-4xl font-bold p-3">Weather Prediction</h1>
      <div className="map-container" style={{ height: '500px' }}>
        <MapContainer
          center={[20, 80]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          bounds={southAsiaBounds}
          maxBounds={southAsiaBounds}
          
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {location && <Marker position={[location.lat, location.lon]} />}
          {location && <SetMapCenter latlng={location} />}
        </MapContainer>
      </div>
      <div className="controls">
        <label htmlFor="city-select">Select a city:</label>
        <div className="relative z-50 w-72 mb-5">
          <Select value={selectedCity} onChange={handleCitySelect} id='city-select' label="Select City" variant="outlined">
            {Object.keys(capitalCities).map(city => (
              <Option key={city} value={city}>{city}</Option>
            ))}
          </Select>
        </div>

        {/* <select id="city-select" value={selectedCity} onChange={handleCitySelect}>
          <option value="">--Choose a city--</option>
          {Object.keys(capitalCities).map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select> */}
        <br />
        <label htmlFor="date">Select a date:</label>
        {/* <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        /> */}
        <div className="p-24">
          <Popover placement="bottom">
            <PopoverHandler>
              <Input
                label="Select a Date"
                value={date}
                readOnly
              />
            </PopoverHandler>
            <PopoverContent>
              <DayPicker
                mode="single"
                selected={date ? format(date, "PPP") : ""}
                onSelect={(date) => setDate(format(date, 'yyyy-MM-dd'))} // Ensure date is formatted as string
                showOutsideDays
                className="border-0"
                classNames={{
                  caption: "flex justify-center py-2 mb-4 relative items-center",
                  caption_label: "text-sm font-medium text-gray-900",
                  nav: "flex items-center",
                  nav_button: "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                  nav_button_previous: "absolute left-1.5",
                  nav_button_next: "absolute right-1.5",
                  table: "w-full border-collapse",
                  head_row: "flex font-medium text-gray-900",
                  head_cell: "m-0.5 w-9 font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal",
                  day_range_end: "day-range-end",
                  day_selected: "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                  day_today: "rounded-md bg-gray-200 text-gray-900",
                  day_outside: "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                  day_disabled: "text-gray-500 opacity-50",
                  day_hidden: "invisible",
                }}
                components={{
                  IconLeft: ({ ...props }) => (
                    <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                  ),
                  IconRight: ({ ...props }) => (
                    <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                  ),
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <button onClick={fetchPrediction}>Get Prediction</button>

        {/* preicted data */}
        {prediction && (
          <div>
            <h3>Predicted Temperature: {prediction.predicted_temp}°C</h3>
            <h4>Weather: {prediction.weather}</h4>
            <h4>City: {selectedCity || location.city}</h4>
                
            <div>
                <Card className="mt-6 w-96">
                    <CardHeader color="blue-gray" className="relative h-56">
                    <img
                        src={getImageUrl(prediction.weather)}
                        alt="weather-condition"
                        className="h-full w-full"
                    />
                    </CardHeader>
                    <CardBody>
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        Weather for {selectedCity} on {date && format(new Date(date), "dd MMMM yyyy")}
                    </Typography>
                    <Typography>
                        <p>Weather: {prediction.weather}</p>
                        <p>Temperature: {(prediction.predicted_temp).toFixed(2)}°C</p>
                    </Typography>
                    </CardBody>
                </Card>
            </div>
          </div>
          
        )}
      </div>
    </div>
  )
}
