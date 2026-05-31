import React, { useState, useEffect } from 'react';
import { getDailyReports, getWeeklyReports, getMonthlyReports, getSummary } from '../api/api';

export default function Reports() {
    const [activeTab, setActiveTab] = useState('daily');
    const [summary, setSummary] = useState(null);
    const [dailyReports, setDailyReports] = useState([]);
    const [weeklyReports, setWeeklyReports] = useState([]);
    const [monthlyReports, setMonthlyReports] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [summaryRes, dailyRes, weeklyRes, monthlyRes] = await Promise.all([
                getSummary(),
                getDailyReports(),
                getWeeklyReports(),
                getMonthlyReports()
            ]);
            setSummary(summaryRes.data);
            setDailyReports(dailyRes.data);
            setWeeklyReports(weeklyRes.data);
            setMonthlyReports(monthlyRes.data);
        } catch (error) {
            alert('Error fetching reports: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Supply Chain Reports</h1>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-100 p-6 rounded-lg shadow">
                        <h3 className="text-gray-700 font-semibold">Total Suppliers</h3>
                        <p className="text-3xl font-bold text-blue-600">{summary.total_suppliers}</p>
                    </div>
                    <div className="bg-green-100 p-6 rounded-lg shadow">
                        <h3 className="text-gray-700 font-semibold">Total Shipments</h3>
                        <p className="text-3xl font-bold text-green-600">{summary.total_shipments}</p>
                    </div>
                    <div className="bg-purple-100 p-6 rounded-lg shadow">
                        <h3 className="text-gray-700 font-semibold">Total Deliveries</h3>
                        <p className="text-3xl font-bold text-purple-600">{summary.total_deliveries}</p>
                    </div>
                    <div className="bg-orange-100 p-6 rounded-lg shadow">
                        <h3 className="text-gray-700 font-semibold">Total Quantity</h3>
                        <p className="text-3xl font-bold text-orange-600">{summary.total_quantity}</p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('daily')}
                    className={`px-4 py-2 rounded font-semibold transition ${
                        activeTab === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                    Daily Reports
                </button>
                <button
                    onClick={() => setActiveTab('weekly')}
                    className={`px-4 py-2 rounded font-semibold transition ${
                        activeTab === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                    Weekly Reports
                </button>
                <button
                    onClick={() => setActiveTab('monthly')}
                    className={`px-4 py-2 rounded font-semibold transition ${
                        activeTab === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                    Monthly Reports
                </button>
            </div>

            {/* Reports Table */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : (
                    <>
                        {activeTab === 'daily' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Daily Reports</h2>
                                {dailyReports.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100 border-b-2 border-gray-300">
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Date</th>
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Suppliers</th>
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Shipments</th>
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Deliveries</th>
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dailyReports.map((report, idx) => (
                                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="px-4 py-2 text-gray-700">{report.report_date}</td>
                                                        <td className="px-4 py-2 text-gray-700">{report.total_suppliers}</td>
                                                        <td className="px-4 py-2 text-gray-700">{report.total_shipments}</td>
                                                        <td className="px-4 py-2 text-gray-700">{report.total_deliveries}</td>
                                                        <td className="px-4 py-2 text-gray-700">{report.total_quantity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No daily reports available</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'weekly' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Weekly Reports</h2>
                                {weeklyReports.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100 border-b-2 border-gray-300">
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Week</th>
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Year</th>
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Suppliers</th>
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Shipments</th>
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Deliveries</th>
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {weeklyReports.map((report, idx) => (
                                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="px-4 py-2 text-gray-700">{report.week_number}</td>
                                                        <td className="px-4 py-2 text-gray-700">{report.year}</td>
                                                        <td className="px-4 py-2 text-gray-700">{report.total_suppliers}</td>
                                                        <td className="px-4 py-2 text-gray-700">{report.total_shipments}</td>
                                                        <td className="px-4 py-2 text-gray-700">{report.total_deliveries}</td>
                                                        <td className="px-4 py-2 text-gray-700">{report.total_quantity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No weekly reports available</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'monthly' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Monthly Reports</h2>
                                {monthlyReports.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100 border-b-2 border-gray-300">
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Month</th>
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Year</th>
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Suppliers</th>
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Shipments</th>
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Deliveries</th>
                                                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {monthlyReports.map((report, idx) => (
                                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="px-4 py-2 text-gray-700">{report.month_number}</td>
                                                        <td className="px-4 py-2 text-gray-700">{report.year}</td>
                                                        <td className="px-4 py-2 text-gray-700">{report.total_suppliers}</td>
                                                        <td className="px-4 py-2 text-gray-700">{report.total_shipments}</td>
                                                        <td className="px-4 py-2 text-gray-700">{report.total_deliveries}</td>
                                                        <td className="px-4 py-2 text-gray-700">{report.total_quantity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No monthly reports available</p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
