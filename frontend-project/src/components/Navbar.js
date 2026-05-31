import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ token, setToken }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/');
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold">SCMS</h1>

                {token && (
                    <div className="flex gap-6">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-white hover:text-blue-200 transition"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/supplier')}
                            className="text-white hover:text-blue-200 transition"
                        >
                            Suppliers
                        </button>
                        <button
                            onClick={() => navigate('/shipment')}
                            className="text-white hover:text-blue-200 transition"
                        >
                            Shipments
                        </button>
                        <button
                            onClick={() => navigate('/delivery')}
                            className="text-white hover:text-blue-200 transition"
                        >
                            Deliveries
                        </button>
                        <button
                            onClick={() => navigate('/reports')}
                            className="text-white hover:text-blue-200 transition"
                        >
                            Reports
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
