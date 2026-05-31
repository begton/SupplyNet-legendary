import React, { useState, useEffect } from 'react';
import { getDeliveries, addDelivery, updateDelivery, deleteDelivery, getShipments } from '../api/api';

export default function Delivery() {
    const [deliveries, setDeliveries] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        delivery_code: '',
        shipment_id: '',
        delivery_date: '',
        quantity_delivered: '',
        delivery_status: 'Pending'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [deliveriesRes, shipmentsRes] = await Promise.all([
                getDeliveries(),
                getShipments()
            ]);
            setDeliveries(deliveriesRes.data);
            setShipments(shipmentsRes.data);
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
                await updateDelivery(editId, formData);
                alert('Delivery updated successfully!');
                setEditId(null);
            } else {
                await addDelivery(formData);
                alert('Delivery added successfully!');
            }
            setFormData({
                delivery_code: '',
                shipment_id: '',
                delivery_date: '',
                quantity_delivered: '',
                delivery_status: 'Pending'
            });
            fetchData();
        } catch (error) {
            alert('Error: ' + error.response?.data?.message);
        }
    };

    const handleEdit = (delivery) => {
        setEditId(delivery.delivery_id);
        setFormData({
            delivery_code: delivery.delivery_code,
            shipment_id: delivery.shipment_id,
            delivery_date: delivery.delivery_date,
            quantity_delivered: delivery.quantity_delivered,
            delivery_status: delivery.delivery_status
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this delivery?')) {
            try {
                await deleteDelivery(id);
                alert('Delivery deleted successfully!');
                fetchData();
            } catch (error) {
                alert('Error deleting delivery: ' + error.message);
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Delivery Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        {editId ? 'Edit Delivery' : 'Add New Delivery'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="delivery_code"
                            placeholder="Delivery Code"
                            value={formData.delivery_code}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                        <select
                            name="shipment_id"
                            value={formData.shipment_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        >
                            <option value="">Select Shipment</option>
                            {shipments.map(s => (
                                <option key={s.shipment_id} value={s.shipment_id}>
                                    {s.shipment_number}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            name="delivery_date"
                            value={formData.delivery_date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                        <input
                            type="number"
                            name="quantity_delivered"
                            placeholder="Quantity Delivered"
                            value={formData.quantity_delivered}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                        <select
                            name="delivery_status"
                            value={formData.delivery_status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        >
                            <option>Pending</option>
                            <option>Completed</option>
                            <option>Failed</option>
                        </select>
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
                                            delivery_code: '',
                                            shipment_id: '',
                                            delivery_date: '',
                                            quantity_delivered: '',
                                            delivery_status: 'Pending'
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

                {/* Deliveries List */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Deliveries List</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : deliveries.length > 0 ? (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {deliveries.map((delivery) => (
                                <div key={delivery.delivery_id} className="bg-gray-50 p-3 rounded border border-gray-200">
                                    <p className="font-semibold text-gray-800">{delivery.delivery_code}</p>
                                    <p className="text-sm text-gray-600">Shipment: {delivery.shipment_number}</p>
                                    <p className="text-sm text-gray-600">Quantity: {delivery.quantity_delivered}</p>
                                    <p className="text-sm text-gray-600">Status: {delivery.delivery_status}</p>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleEdit(delivery)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(delivery.delivery_id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No deliveries found</p>
                    )}
                </div>
            </div>
        </div>
    );
}
