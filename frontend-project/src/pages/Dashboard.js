import React, { useState, useEffect } from 'react';
import { getSummary } from '../api/api';

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const response = await getSummary();
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>

            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : summary ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-8 rounded-lg shadow-lg text-white">
                        <h3 className="text-lg font-semibold mb-2">Total Suppliers</h3>
                        <p className="text-4xl font-bold">{summary.total_suppliers}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-400 to-green-600 p-8 rounded-lg shadow-lg text-white">
                        <h3 className="text-lg font-semibold mb-2">Total Shipments</h3>
                        <p className="text-4xl font-bold">{summary.total_shipments}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-8 rounded-lg shadow-lg text-white">
                        <h3 className="text-lg font-semibold mb-2">Total Deliveries</h3>
                        <p className="text-4xl font-bold">{summary.total_deliveries}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-8 rounded-lg shadow-lg text-white">
                        <h3 className="text-lg font-semibold mb-2">Total Quantity</h3>
                        <p className="text-4xl font-bold">{summary.total_quantity}</p>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">Failed to load data</p>
            )}

            <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to SCMS</h2>
                <p className="text-gray-600 mb-4">
                    Supply Chain Management System helps you manage suppliers, shipments, and deliveries efficiently.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Add and manage suppliers information</li>
                    <li>Track shipments and their status</li>
                    <li>Record and monitor deliveries</li>
                    <li>Generate daily, weekly, and monthly reports</li>
                </ul>
            </div>
        </div>
    );
}
