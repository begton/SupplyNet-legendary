import React, { useState, useEffect } from 'react';
import { getSuppliers, addSupplier } from '../api/api';

export default function Supplier() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        supplier_code: '',
        supplier_name: '',
        telephone: '',
        address: '',
        email: ''
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const response = await getSuppliers();
            setSuppliers(response.data);
        } catch (error) {
            alert('Error fetching suppliers: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addSupplier(formData);
            alert('Supplier added successfully!');
            setFormData({
                supplier_code: '',
                supplier_name: '',
                telephone: '',
                address: '',
                email: ''
            });
            fetchSuppliers();
        } catch (error) {
            alert('Error adding supplier: ' + error.response?.data?.message);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Supplier Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Supplier</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="supplier_code"
                            placeholder="Supplier Code"
                            value={formData.supplier_code}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                        <input
                            type="text"
                            name="supplier_name"
                            placeholder="Supplier Name"
                            value={formData.supplier_name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                        <input
                            type="tel"
                            name="telephone"
                            placeholder="Telephone"
                            value={formData.telephone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
                        >
                            Add Supplier
                        </button>
                    </form>
                </div>

                {/* Suppliers List */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Suppliers List</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : suppliers.length > 0 ? (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {suppliers.map((supplier) => (
                                <div key={supplier.supplier_id} className="bg-gray-50 p-3 rounded border border-gray-200">
                                    <p className="font-semibold text-gray-800">{supplier.supplier_name}</p>
                                    <p className="text-sm text-gray-600">Code: {supplier.supplier_code}</p>
                                    <p className="text-sm text-gray-600">Email: {supplier.email}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No suppliers found</p>
                    )}
                </div>
            </div>
        </div>
    );
}
