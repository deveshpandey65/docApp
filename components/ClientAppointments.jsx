import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';
import ClientDashboardNavbar from './ClientDashboardNavbar';
const ClientAppointment = () => {
    const { theme, toggleTheme } = useTheme();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('confirmed');
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        fetchAppointments();
    }, [statusFilter, dateRange]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/client/appointments?status=${statusFilter}`, {
                withCredentials: true
            });

            const filteredAppointments = response.data.data.appointments.filter(appointment => {
                const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
                const start = new Date(dateRange.startDate);
                const end = new Date(dateRange.endDate);
                end.setHours(23, 59, 59, 999);
                return appointmentDate >= start && appointmentDate <= end;
            });

            setAppointments(filteredAppointments);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setError(err.response?.data?.message || 'Failed to fetch appointments');
            setLoading(false);
        }
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleDateChange = (e) => {
        setDateRange({
            ...dateRange,
            [e.target.name]: e.target.value
        });
    };

    const formatAppointmentTime = (dateTimeStr) => {
        return format(new Date(dateTimeStr), 'MMM dd, yyyy - h:mm a');
    };

    const getStatusBadgeClass = (status) => {
        const styles = {
            confirmed: theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800',
            completed: theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800',
            cancelled: theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800',
            pending: theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
            default: theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800',
        };
        return styles[status] || styles.default;
    };

    const containerClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900';
    const cardClass = theme === 'dark' ? 'bg-gray-800 shadow-dark' : 'bg-white shadow';
    const headingClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const labelClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
    const inputClass = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';
    const tableHeaderClass = theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-500';
    const tableRowHoverClass = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
    const dividerClass = theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200';

    return (
        <section>
            <ClientDashboardNavbar />
            <div className={`p-6 max-w-6xl mx-auto transition-colors duration-200 ${containerClass}`}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className={`text-2xl font-bold ${headingClass}`}>Your Appointments</h1>
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'}`}
                    >
                        {theme === 'dark' ? '🌞' : '🌙'}
                    </button>
                </div>

                {/* Filters */}
                <div className={`${cardClass} p-4 rounded-lg mb-6`}>
                    <h2 className={`text-lg font-semibold mb-3 ${headingClass}`}>Filters</h2>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-full md:w-1/3">
                            <label className={`block text-sm font-medium ${labelClass} mb-1`}>Status</label>
                            <select
                                value={statusFilter}
                                onChange={handleStatusChange}
                                className={`w-full p-2 border rounded-md ${inputClass}`}
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="w-full md:w-1/3">
                            <label className={`block text-sm font-medium ${labelClass} mb-1`}>From</label>
                            <input
                                type="date"
                                name="startDate"
                                value={dateRange.startDate}
                                onChange={handleDateChange}
                                className={`w-full p-2 border rounded-md ${inputClass}`}
                            />
                        </div>

                        <div className="w-full md:w-1/3">
                            <label className={`block text-sm font-medium ${labelClass} mb-1`}>To</label>
                            <input
                                type="date"
                                name="endDate"
                                value={dateRange.endDate}
                                onChange={handleDateChange}
                                className={`w-full p-2 border rounded-md ${inputClass}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className={`${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'} border px-4 py-3 rounded mb-4`}>
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === 'dark' ? 'border-blue-400' : 'border-blue-500'}`} />
                    </div>
                ) : (
                    <>
                        <div className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Showing {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
                        </div>

                        {appointments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className={`min-w-full ${cardClass} rounded-lg`}>
                                    <thead className={tableHeaderClass}>
                                        <tr>
                                            <th className="py-3 px-4 text-left text-xs font-medium uppercase">Doctor</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium uppercase">Time</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`${dividerClass} divide-y`}>
                                        {appointments.map(appointment => (
                                            <tr key={appointment._id} className={tableRowHoverClass}>
                                                <td className="py-4 px-4">
                                                    <div className="font-medium">
                                                        {appointment.clientId?.name || 'Dr. Unknown'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Fee: ₹{appointment.fee}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-sm">
                                                    {formatAppointmentTime(`${appointment.date}T${appointment.time}`)}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                                                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className={`${cardClass} p-8 rounded-lg text-center`}>
                                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                                    No appointments found with the selected filters.
                                </p>
                                <button
                                    onClick={() => {
                                        setStatusFilter('all');
                                        setDateRange({
                                            startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
                                            endDate: new Date().toISOString().split('T')[0]
                                        });
                                    }}
                                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default ClientAppointment;
