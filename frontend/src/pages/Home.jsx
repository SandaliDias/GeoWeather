import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import { useParams, Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Ensure leaflet styles are properly imported
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for missing marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationMarker({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      console.log("Map clicked at:", e.latlng); // Debugging information
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

export default function Home() {

  const { userId } = useParams();

  const [prediction, setPrediction] = useState(null);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleLocationSelect = async (latlng) => {
    setLocation(latlng);
    console.log("Selected location:", latlng); // Debugging information
    try {
      const response = await axios.get(`http://localhost:8010/weather/${latlng.lat}/${latlng.lng}`);
      console.log("Weather data:", response.data); // Debugging information
      setWeather(response.data.data);
    } catch (error) {
      console.error("Error fetching weather data:", error); // Debugging information
    }
  };

  const handleCitySearch = async () => {
    try {
      const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search`, {
        params: {
          name: city,
          count: 1,
          language: 'en',
          format: 'json'
        }
      });
      console.log("City search results:", response.data); // Debugging information
      if (response.data.results && response.data.results.length > 0) {
        const { latitude, longitude } = response.data.results[0];
        handleLocationSelect({ lat: latitude, lng: longitude });
      } else {
        alert('City not found');
      }
    } catch (error) {
      console.error('Error searching city:', error);
    }
  };

  const SetMapCenter = ({ latlng }) => {
    const map = useMap();
    map.setView(latlng, map.getZoom());
    return null;
  };

  // Weather prediction
  const fetchPrediction = async () => {
    if (!date) {
      alert('Please select a date');
      return;
    }

    try {
      const response = await axios.get('http://127.0.0.1:8010/predict', {
        params: { date },
      });
      setPrediction(response.data.predicted_temp.toFixed(2));
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  const addToFavorites = async () => {
    if (!weather || !location) {
      alert('Please select a location and fetch the weather data first.');
      return;
    }

    try {
      await axios.post('http://localhost:8010/favorites/create', {
        city: weather.name,
        lat: location.lat,
        lng: location.lng,
        userId, // Pass the user's ID
      });
      alert('City added to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  return (
    <div className="App">
      <div className='geoTitle'>
        <h1 className="text-4xl font-bold p-3">GeoWeather</h1>
      </div>
      <div className="map-container">
        <MapContainer center={[6.94, 79.85]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onLocationSelect={handleLocationSelect} />
          {location && <SetMapCenter latlng={location} />}
        </MapContainer>
      </div>
      {weather && (
        <div> 
          <h2>Weather for {weather.name}</h2>
          <p>Location: {location.lat}, {location.lng}</p>
          <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)}°C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <button onClick={addToFavorites}>Add to Favorites</button>
        </div>
      )}
      <div>
        <h2>Weather Prediction</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={fetchPrediction}>Get Prediction</button>
        {prediction && (
          <div>
            <h3>Predicted Temperature: {prediction}°C</h3>
          </div>
        )}
      </div>
      <div>
        <h2>Search City</h2>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button onClick={handleCitySearch}>Search</button>
      </div>
      
      <Link to={`/favorites/${userId}`}>
      <button>Go to Favorites</button>
      </Link>
    </div>
  );
}
