import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8010/auth/register', { username, password });
      console.log(response.data);
      navigate(`/login`)
    } catch (error) {
      setError(error.response.data.error || 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <div className="flex">
        <form onSubmit={handleSubmit} className='flex-col'>
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className=" bg-blue-800 p-3 pl-5 pr-5 mt-10 rounded-lg text-white">Register</button>
        </form>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Signup;
