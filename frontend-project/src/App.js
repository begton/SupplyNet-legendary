import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Supplier from './pages/Supplier';
import Shipment from './pages/Shipment';
import Delivery from './pages/Delivery';
import Reports from './pages/Reports';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    return (
        <Router>
            <div className="bg-gray-50 min-h-screen">
                {token && <Navbar token={token} setToken={setToken} />}
                
                <Routes>
                    <Route path="/" element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
                    <Route path="/supplier" element={token ? <Supplier /> : <Navigate to="/" />} />
                    <Route path="/shipment" element={token ? <Shipment /> : <Navigate to="/" />} />
                    <Route path="/delivery" element={token ? <Delivery /> : <Navigate to="/" />} />
                    <Route path="/reports" element={token ? <Reports /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
