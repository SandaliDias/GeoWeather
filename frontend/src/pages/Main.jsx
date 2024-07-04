import React from 'react'

export default function Main() {
  return (
    <div className="bg-custom-image h-screen flex items-center justify-center">
      <div className=" bg-blue-900 opacity-90 h-1/2 w-1/4 rounded-md flex flex-col justify-center text-center">
        <h2 className="text-white text-3xl font-bold text-center">Welcome to GeoWeather</h2>
        <p className="mt-4 text-white">Login to enter in to the website</p>
        <a href='/login'><button className=" bg-blue-800 p-3 pl-5 pr-5 mt-10 rounded-lg text-white">Login</button></a>
        <a href='/signup'><button className=" bg-blue-800 p-3 pl-5 pr-5 mt-10 rounded-lg text-white">Sign Up</button></a>
        
      </div>
    </div>
  )
}