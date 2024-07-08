import {React, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
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
import { Link } from 'react-router-dom';

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
          const userId = response.data.userId
          navigate(`/home/${userId}`);
        } catch (error) {
          setError(error.response.data.error || 'Invalid credentials');
        }
    };
    
  return (
        <div className="bg-black h-screen flex items-center justify-center">
          <div className='flex flex-col'>
            <h1 className='text-white text-4xl font-extrabold mb-8'><center>GEOWEATHER</center></h1>
            <div>
              <Card className="w-96">
                <CardHeader
                  variant="gradient"
                  color="gray"
                  className="mb-4 grid h-28 place-items-center"
                >
                  <Typography variant="h3" color="white">
                    Sign In
                  </Typography>
                </CardHeader>
                <CardBody className="gap-4">
                  <form onSubmit={handleSubmit}>
                    <Input
                    type="text"
                    label='Username'
                    placeholder="Username"
                    value={username}
                    className="text-black"
                    onChange={(e) => setUsername(e.target.value)}
                    size="lg"
                    />
                    <br/>
                    <Input
                    type="password"
                    label='Password'
                    placeholder="Password"
                    value={password}
                    className="text-black"
                    onChange={(e) => setPassword(e.target.value)}
                    size='lg'
                    />
                    <Button type="submit" variant="gradient" fullWidth className='mt-8'>Login</Button>
                </form>
                </CardBody>
                <CardFooter className="pt-0">
                  
                  <Typography variant="small" className="mt-6 flex justify-center">
                    Don&apos;t have an account?
                    <Link to={"/signup"}>
                      <Typography
                        as="a"
                        href="#signup"
                        variant="small"
                        color="blue-gray"
                        className="ml-1 font-bold"
                      >
                        Sign up
                      </Typography>
                    </Link>
                  </Typography>
                </CardFooter>
              </Card>
            </div>
          </div>
          
        </div>
  )
}
