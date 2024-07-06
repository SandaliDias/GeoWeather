import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { ThemeProvider } from "@material-tailwind/react";

// Page imports
import App from './pages/App';
import Main from './pages/Main';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Favorites from './pages/Favorites';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/loggedIn' element={<App />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/home/:userId' element={<Home />} />
          <Route path='/favorites/:userId' element={<Favorites />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
