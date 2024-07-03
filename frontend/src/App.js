import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
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

function App() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

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

  return (
    <div className="App">
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={handleLocationSelect} />
      </MapContainer>
      {location && <div>Selected Location: {location.lat}, {location.lng}</div>}
      {weather && (
        <div>
          <h2>Weather for {location.lat}, {location.lng}</h2>
          <p>Temperature: {weather.main.temp}°K</p>
          <p>Weather: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;
