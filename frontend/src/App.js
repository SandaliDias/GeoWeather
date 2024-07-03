import React, {useState} from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

function LocationMarker({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
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
    const response = await axios.get(`http://localhost:8010/weather/${latlng.lat}/${latlng.lng}`);
    setWeather(response.data.data);
  };

  return (
    <div className="App">
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={handleLocationSelect} />
      </MapContainer>
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
