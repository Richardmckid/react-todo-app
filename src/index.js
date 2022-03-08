import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import './index.css';
import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
