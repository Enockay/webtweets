// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Componets/pages/Login';
import SignUp from './Componets/pages/SignUp';
import Dashboard from './Componets/Dashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} /> {/* Default route */}
        <Route path="/Dashboard" element={<Dashboard/>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
