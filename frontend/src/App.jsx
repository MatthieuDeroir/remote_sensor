import React from 'react';
import { SensorDataProvider } from './context/SensorDataContext';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
      <SensorDataProvider>
        <Dashboard />
      </SensorDataProvider>
  );
}

export default App;
