import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import { useParams, Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Input } from "@material-tailwind/react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, Card, CardHeader, CardBody, CardFooter, Typography} from "@material-tailwind/react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationMarker({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      console.log("Map clicked at:", e.latlng);
      onLocationSelect(e.latlng);
    },
  });
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
  if (weather && weather.weather && weather.weather[0] && weather.weather[0].main) {
    return weatherImages[weather.weather[0].main] || 'https://example.com/default-weather.jpg';
  }
  return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMJ04aqNYUZTOUb37AA9kjT6SlKzZmhn8aMw&s';
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
    console.log("Selected location:", latlng);
    try {
      const response = await axios.get(`http://localhost:8010/weather/${latlng.lat}/${latlng.lng}`);
      console.log("Weather data:", response.data);
      setWeather(response.data.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
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
      console.log("City search results:", response.data);
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
        userId,
      });
      alert('City added to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  return (
    <div className="App">
      <div className='geoTitle flex flex-row justify-evenly mt-3 mb-3'>
        <h1 className="text-4xl font-bold">GeoWeather</h1>

        <div className="justify-normal">
          <Link to={`/favorites/${userId}`}><Button className='mr-2'>Favorites</Button></Link>
          <Link to={`/home/${userId}`}><Button color='gray' disabled='true'>Home</Button></Link>
          <Link to={`/prediction/${userId}`}><Button color='gray'>South Asia Weather Prediction</Button></Link>
        </div>
        
        <div className="relative flex w-full max-w-[24rem]">
            <Input
              type="text"
              label="Enter City name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="pr-20"
              containerProps={{
                className: "min-w-0",
              }}
            />
            <Button
              size="sm"
              color={city ? "gray" : "blue-gray"}
              disabled={!city}
              className="!absolute right-1 top-1 rounded"
              onClick={handleCitySearch}
            >
              Search
            </Button>
          </div>
            <Button color='blue-gray'>Logout</Button>
      </div>

      <div className='flex flex-row justify-evenly'>
        {/* <div className="map-container w-2/3">
          <MapContainer center={[6.94, 79.85]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker onLocationSelect={handleLocationSelect} />
            {location && <SetMapCenter latlng={location} />}
          </MapContainer>
        </div> */}
        <Card className="w-2/3">
            <CardHeader floated={false} className="">
              <div className="map-container h-4/5">
                <MapContainer center={[6.94, 79.85]} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker onLocationSelect={handleLocationSelect} />
                  {location && <SetMapCenter latlng={location} />}
                </MapContainer>
              </div>
            </CardHeader>
            <CardBody className="text-center">
              Select a Location in the map
            </CardBody>
        </Card>
        {weather && (
          <div> 
            <Card className="mt-6 w-96">
              <CardHeader color="blue-gray" className="relative h-56">
                <img
                  src={getImageUrl(weather)}
                  alt="weather-condition"
                  className="h-full w-full"
                />
              </CardHeader>
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Weather for {weather.name}
                </Typography>
                <Typography>
                  <p>Weather: {weather.weather[0].main}</p>
                  <p>Description: {weather.weather[0].description}</p>
                  <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)}°C</p>
                  <p>Location: {location.lat}, {location.lng}</p>
                </Typography>
              </CardBody>
              <CardFooter className="pt-0">
                <Button onClick={addToFavorites}>Add to Favorites</Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
      <div>
        <h2>Weather Prediction</h2>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={fetchPrediction}>Get Prediction</button>
        {prediction && <div><h3>Predicted Temperature: {prediction}°C</h3></div>}
      </div>
    </div>
  );
}
