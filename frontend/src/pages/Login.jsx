import {React, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:8010/auth/login', { username, password });
          console.log(response.data);
          navigate('/home');
        } catch (error) {
          setError(error.response.data.error || 'Invalid credentials');
        }
    };
    
  return (
            <div className="bg-custom-image h-screen flex items-center justify-center">
          <div className=" bg-blue-900 opacity-90 h-1/2 w-1/4 rounded-md flex flex-col justify-center text-center">
            <h2 className="text-white text-3xl font-bold text-center">Welcome to GeoWeather</h2>
            <p className="mt-4 text-white">Login to enter in to the website</p>
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                placeholder="Username"
                value={username}
                className="text-black"
                onChange={(e) => setUsername(e.target.value)}
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                className="text-black"
                onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit"  className=" bg-blue-800 p-3 pl-5 pr-5 mt-10 rounded-lg text-white">Login</button>
            </form>
            {error && <p>{error}</p>}
            <p>Don't have an account? <a href='/signup' className="text-blue-500">Sign Up</a></p>
            
          </div>
        </div>
  )
}
