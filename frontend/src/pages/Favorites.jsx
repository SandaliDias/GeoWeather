import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Button } from "@material-tailwind/react";

export default function Favorites() {
  const { userId } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [weatherData, setWeatherData] = useState({});

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

  useEffect(() => {
    const fetchWeatherData = async () => {
      const weatherPromises = favorites.map(async (favorite) => {
        try {
          const response = await axios.get(`http://localhost:8010/weather/${favorite.lat}/${favorite.lng}`);
          return { ...favorite, temp: response.data.data.main.temp };
        } catch (error) {
          console.error("Error fetching weather data:", error);
          return { ...favorite, temp: null };
        }
      });

      const weatherResults = await Promise.all(weatherPromises);
      const weatherMap = weatherResults.reduce((acc, weather) => {
        acc[weather._id] = weather; // Corrected property name for matching weather data
        return acc;
      }, {});

      setWeatherData(weatherMap);
    };

    if (favorites.length > 0) {
      fetchWeatherData();
    }
  }, [favorites]);

  const handleDelete = async (favoriteId) => {
    try {
      await axios.delete(`http://localhost:8010/favorites/delete/${favoriteId}`);
      setFavorites(favorites.filter(favorite => favorite._id !== favoriteId)); 
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold p-3">Favorite Cities</h1>
      <Link to={`/home/${userId}`}>
        <Button>Back to Home</Button>
      </Link>
      {favorites.length === 0 ? (
        <p>No favorite cities added.</p>
      ) : (
        <ul>
          {favorites.map((favorite) => (
            <li key={favorite._id}> {/* Corrected key property */}
              <h2>{favorite.city}</h2>
              <p>Latitude: {favorite.lat}</p>
              <p>Longitude: {favorite.lng}</p>
              <p>Temperature: {weatherData[favorite._id] ? (weatherData[favorite._id].temp - 273.15).toFixed(2) : 'Loading...'}°C</p>
              <Button onClick={() => handleDelete(favorite._id)}>Delete</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
