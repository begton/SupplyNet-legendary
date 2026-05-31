import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const loginUser = (username, password) => 
    api.post('/auth/login', { username, password });

export const registerUser = (username, password, email) => 
    api.post('/auth/register', { username, password, email });

// Suppliers
export const getSuppliers = () => api.get('/supplier');
export const getSupplier = (id) => api.get(`/supplier/${id}`);
export const addSupplier = (data) => api.post('/supplier', data);

// Shipments
export const getShipments = () => api.get('/shipment');
export const getShipment = (id) => api.get(`/shipment/${id}`);
export const addShipment = (data) => api.post('/shipment', data);
export const updateShipment = (id, data) => api.put(`/shipment/${id}`, data);
export const deleteShipment = (id) => api.delete(`/shipment/${id}`);

// Deliveries
export const getDeliveries = () => api.get('/delivery');
export const getDelivery = (id) => api.get(`/delivery/${id}`);
export const addDelivery = (data) => api.post('/delivery', data);
export const updateDelivery = (id, data) => api.put(`/delivery/${id}`, data);
export const deleteDelivery = (id) => api.delete(`/delivery/${id}`);

// Reports
export const getDailyReports = () => api.get('/reports/daily');
export const getWeeklyReports = () => api.get('/reports/weekly');
export const getMonthlyReports = () => api.get('/reports/monthly');
export const getSummary = () => api.get('/reports/summary');
