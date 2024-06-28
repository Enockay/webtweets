// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Componets/pages/Login';
import SignUp from './Componets/pages/SignUp';
import Dashboard from './Componets/Dashboard';
import { UserProvider } from './Componets/Context';
import { DashboardProvider } from './Componets/DashContext';

const App: React.FC = () => {
  return (
    <UserProvider>
      <DashboardProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Login />} /> {/* Default route */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
      </DashboardProvider> 
    </UserProvider>
  );
};

export default App;
