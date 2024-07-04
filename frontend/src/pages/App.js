import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import '../App.css'; // Import the CSS file

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

  const SetMapCenter = ({ latlng }) => {
    const map = useMap();
    map.setView(latlng, map.getZoom());
    return null;
  };

  return (
    <div className="App">
      <div className='geoTitle'>
        <h1>GeoWeather</h1>
      </div>
      <div className="map-container">
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%" }}>
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
          <p>Temperature: {weather.main.temp}°K</p>
          <p>Weather: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;
