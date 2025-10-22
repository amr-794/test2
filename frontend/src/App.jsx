import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Student from './pages/Student';
import Playlists from './pages/Playlists';
import Player from './pages/Player';

export default function App(){
  return (<div>
    <header>
      <div className="container">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/playlists">Playlists</Link>
          <Link to="/login">Login</Link>
        </nav>
      </div>
    </header>
    <div className="container">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/student" element={<Student/>} />
        <Route path="/playlists" element={<Playlists/>} />
        <Route path="/player/:id" element={<Player/>} />
      </Routes>
    </div>
  </div>);
}
