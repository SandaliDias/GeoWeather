import React from 'react';
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

export default function Main() {
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
              <Typography variant="h4" color="white">
                <center>Welcome To Geoweather</center>
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4 items-center">
              <p className='mb-4'>LOGIN TO ENTER INTO THE WEBSITE</p>
              <Link to={"/login"}>
                <Button variant="gradient">Sign in</Button>
              </Link>
              <Link to={"/signup"}>
                <Button variant="outlined">Sign up</Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}