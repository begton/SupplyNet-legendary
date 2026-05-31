import React, { useState, useEffect } from 'react';
import { getShipments, addShipment, updateShipment, deleteShipment, getSuppliers } from '../api/api';

export default function Shipment() {
    const [shipments, setShipments] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        shipment_number: '',
        supplier_id: '',
        shipment_date: '',
        shipment_status: 'Pending',
        destination: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [shipmentsRes, suppliersRes] = await Promise.all([
                getShipments(),
                getSuppliers()
            ]);
            setShipments(shipmentsRes.data);
            setSuppliers(suppliersRes.data);
        } catch (error) {
            alert('Error fetching data: ' + error.message);
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
            if (editId) {
                await updateShipment(editId, formData);
                alert('Shipment updated successfully!');
                setEditId(null);
            } else {
                await addShipment(formData);
                alert('Shipment added successfully!');
            }
            setFormData({
                shipment_number: '',
                supplier_id: '',
                shipment_date: '',
                shipment_status: 'Pending',
                destination: ''
            });
            fetchData();
        } catch (error) {
            alert('Error: ' + error.response?.data?.message);
        }
    };

    const handleEdit = (shipment) => {
        setEditId(shipment.shipment_id);
        setFormData({
            shipment_number: shipment.shipment_number,
            supplier_id: shipment.supplier_id,
            shipment_date: shipment.shipment_date,
            shipment_status: shipment.shipment_status,
            destination: shipment.destination
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this shipment?')) {
            try {
                await deleteShipment(id);
                alert('Shipment deleted successfully!');
                fetchData();
            } catch (error) {
                alert('Error deleting shipment: ' + error.message);
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Shipment Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        {editId ? 'Edit Shipment' : 'Add New Shipment'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="shipment_number"
                            placeholder="Shipment Number"
                            value={formData.shipment_number}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                        <select
                            name="supplier_id"
                            value={formData.supplier_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map(s => (
                                <option key={s.supplier_id} value={s.supplier_id}>
                                    {s.supplier_name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            name="shipment_date"
                            value={formData.shipment_date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                        <select
                            name="shipment_status"
                            value={formData.shipment_status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        >
                            <option>Pending</option>
                            <option>In Transit</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                        </select>
                        <input
                            type="text"
                            name="destination"
                            placeholder="Destination"
                            value={formData.destination}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
                            >
                                {editId ? 'Update' : 'Add'}
                            </button>
                            {editId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditId(null);
                                        setFormData({
                                            shipment_number: '',
                                            supplier_id: '',
                                            shipment_date: '',
                                            shipment_status: 'Pending',
                                            destination: ''
                                        });
                                    }}
                                    className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition font-semibold"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Shipments List */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipments List</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : shipments.length > 0 ? (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {shipments.map((shipment) => (
                                <div key={shipment.shipment_id} className="bg-gray-50 p-3 rounded border border-gray-200">
                                    <p className="font-semibold text-gray-800">{shipment.shipment_number}</p>
                                    <p className="text-sm text-gray-600">Supplier: {shipment.supplier_name}</p>
                                    <p className="text-sm text-gray-600">Status: {shipment.shipment_status}</p>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleEdit(shipment)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(shipment.shipment_id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No shipments found</p>
                    )}
                </div>
            </div>
        </div>
    );
}
