import React, { useState } from 'react';
import {useNavigate,Link} from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";

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
    <div  className="bg-black h-screen flex items-center justify-center">
      <div  className='flex flex-col'>
        <h1 className='text-white text-4xl font-extrabold mb-8'><center>GEOWEATHER</center></h1>
        <div>
          <Card className="w-96">
            <CardHeader
              variant="gradient"
              color="gray"
              className="mb-4 grid h-28 place-items-center"
            >
              <Typography variant="h3" color="white">
                Sign Up
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <div className="">
                <form onSubmit={handleSubmit} className='flex-col'>
                    <Input
                    type="text"
                    placeholder="Username"
                    label='Username'
                    value={username}
                    size='lg'
                    onChange={(e) => setUsername(e.target.value)}
                    />
                    <br/>
                    <Input
                    type="password"
                    placeholder="Password"
                    label='Password'
                    size='lg'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit"variant='gradient' fullWidth className="mt-8">Sign up</Button>
                </form>
              </div>
              {error && <p>{error}</p>}
            </CardBody>
            <CardFooter className="pt-0">
              <Typography variant="small" className="mt-6 flex justify-center">
                Already have an account?
                <Link to={"/login"}>
                  <Typography
                    as="a"
                    href="#signup"
                    variant="small"
                    color="blue-gray"
                    className="ml-1 font-bold"
                  >
                    Sign in
                  </Typography>
                </Link>
              </Typography>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Signup;
