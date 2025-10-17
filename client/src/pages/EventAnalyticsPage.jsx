import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const EventAnalyticsPage = () => {
  const { id: eventId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get(`/events/${eventId}/analytics`);
        setAnalytics(response.data);
      } catch (err) {
        setError('Failed to load event analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [eventId]);

  if (loading) return <p className="text-white text-center mt-10">Loading analytics...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!analytics) return <p className="text-white text-center mt-10">No analytics data found.</p>;

  return (
    <div className="max-w-6xl mx-auto text-white">
      <h1 className="text-4xl font-bold mb-2">{analytics.eventTitle}</h1>
      <p className="text-lg text-slate-400 mb-8">Live Analytics Dashboard</p>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <p className="text-slate-400 text-sm font-bold uppercase">Total Registrations</p>
          <p className="text-5xl font-bold text-sky-400 mt-2">{analytics.totalRegistrations}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <p className="text-slate-400 text-sm font-bold uppercase">Total Check-ins</p>
          <p className="text-5xl font-bold text-green-400 mt-2">{analytics.totalCheckIns}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <p className="text-slate-400 text-sm font-bold uppercase">Check-in Rate</p>
          <p className="text-5xl font-bold text-amber-400 mt-2">{analytics.checkInRate}%</p>
        </div>
      </div>

      {/* Attendee List */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Attendee List</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.attendees.map((attendee, index) => (
                <tr key={index} className="border-b border-slate-700">
                  <td className="p-3">{attendee.name}</td>
                  <td className="p-3 text-slate-400">{attendee.email}</td>
                  <td className="p-3 text-center">
                    {attendee.isCheckedIn ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">
                        Checked In
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-400">
                        Not Arrived
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {analytics.attendees.length === 0 && (
            <p className="text-slate-400 text-center py-6">No attendees have registered for this event yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventAnalyticsPage;