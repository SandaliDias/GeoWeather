import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";

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
  Tornado: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQXPYZGQgLSIg9GQhhCkjQDX8hciAhzUva6w&s',
};

function getImageUrl(weather) {
  if (weather) {
    return weatherImages[weather] || 'https://example.com/default-weather.jpg';
  }
  return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMJ04aqNYUZTOUb37AA9kjT6SlKzZmhn8aMw&s';
}

export default function Favorites() {
  const { userId } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const navigate = useNavigate();

  //fetch all favorites for user id and set it under favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:8010/favorites?userId=${userId}`);
        if (response.data.success) {
          setFavorites(response.data.favorites);
        } else {
          console.error('Failed to fetch favorites:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [userId]);

  //useEffect to fetch weather data for each favorite
  useEffect(() => {
    const fetchWeatherData = async () => {
      const weatherPromises = favorites.map(async (favorite) => {
        try {
          const response = await axios.get(`http://localhost:8010/weather/${favorite.lat}/${favorite.lng}`);
          return { ...favorite, temp: response.data.data.main.temp, weather: response.data.data.weather[0].main };
        } catch (error) {
          console.error("Error fetching weather data:", error);
          return { ...favorite, temp: null };
        }
      });

      const weatherResults = await Promise.all(weatherPromises);
      const weatherMap = weatherResults.reduce((acc, weather) => {
        acc[weather._id] = weather;
        return acc;
      }, {});

      setWeatherData(weatherMap);
    };

    if (favorites.length > 0) {
      fetchWeatherData();
    }
  }, [favorites]);

  //delete favorites
  const handleDelete = async (favoriteId) => {
    try {
      await axios.delete(`http://localhost:8010/favorites/delete/${favoriteId}`);
      setFavorites(favorites.filter(favorite => favorite._id !== favoriteId));
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  };

  //logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/'); // Redirect to login page
  };

  return (
    <div>
      <header className='geoTitle flex flex-row justify-evenly mt-3 mb-3'>
        <h1 className="text-4xl font-bold">GeoWeather</h1>
        <h2 className="text-4xl font-bold">Favorite Cities</h2>

        <div className="justify-normal">
          <Link to={`/favorites/${userId}`}><Button className='mr-2' disabled='true'>Favorites</Button></Link>
          <Link to={`/home/${userId}`}><Button color='gray' className='mr-2'>Home</Button></Link>
          <Link to={`/prediction/${userId}`}><Button color='gray'>South Asia Weather Prediction</Button></Link>
        </div>
        
        <Button color='blue-gray' onClick={handleLogout}>Logout</Button>
      </header>

      {/* Favorite Body */}
      <div className='flex justify-evenly flex-wrap mt-8'>
        {favorites.length === 0 ? (
          <p>No favorite cities added.</p>
        ) : (
          favorites.map((favorite) => (
            <Card key={favorite._id} className="mt-6 w-80 m-5">
              <CardHeader color="blue-gray" className="relative h-56">
                <img
                  src={weatherData[favorite._id] ? getImageUrl(weatherData[favorite._id].weather) : getImageUrl(null)}
                  alt="weather-condition"
                  className="h-full w-full"
                />
              </CardHeader>
              <CardBody>
                <Typography color="blue-gray" className="mb-2">
                  <h2 className="font-bold text-lg">{favorite.city}</h2>
                  <p>Latitude: {favorite.lat}</p>
                  <p>Longitude: {favorite.lng}</p>
                  <p>Temperature: {weatherData[favorite._id] ? (weatherData[favorite._id].temp - 273.15).toFixed(2) : 'Loading...'}°C</p>
                  <p>Weather: {weatherData[favorite._id] ? weatherData[favorite._id].weather : 'Loading...'}</p>
                </Typography>
              </CardBody>
              <CardFooter>
                <Button onClick={() => handleDelete(favorite._id)}>Delete</Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
