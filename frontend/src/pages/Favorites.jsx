import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function Favorites() {
    const { userId } = useParams();

    const [favorites, setFavorites] = useState([]);

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

    return (
        <div>
            <h1 className="text-4xl font-bold p-3">Favorite Cities</h1>
            <Link to={`/home/${userId}`}>
                <button>Back to Home</button>
            </Link>
            {favorites.length === 0 ? (
                <p>No favorite cities added.</p>
            ) : (
                <ul>
                    {favorites.map((favorite, index) => (
                        <li key={index}>
                            <h2>{favorite.city}</h2>
                            <p>Latitude: {favorite.lat}</p>
                            <p>Longitude: {favorite.lng}</p>
                            <p>Temperature: {favorite.temp}°C</p>
                            <p>Time: {favorite.time}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
