import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const MyEventsPage = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events/my-events");
        setMyEvents(res.data);
      } catch (err) {
        setError("Failed to fetch your events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user && (user.role === "organizer" || user.role === "admin")) {
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading)
    return (
      <p className="text-white text-center mt-20 animate-pulse">
        Loading your events...
      </p>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-20 font-semibold">{error}</p>
    );

  if (!myEvents.length)
    return (
      <p className="text-slate-400 text-center mt-20">
        You haven’t created any events yet.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto text-white px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8">My Created Events</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {myEvents.map((event) => (
          <div
            key={event._id}
            className="bg-slate-900/70 border border-slate-700 rounded-2xl p-5"
          >
            <div>
              <h3 className="text-xl font-bold text-sky-400 mb-1">
                {event.title}
              </h3>
              <p className="text-slate-400 text-sm">
                {new Date(event.startTime).toLocaleDateString("en-IN")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link
                to={`/events/${event._id}/analytics`}
                className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
              >
                View Analytics
              </Link>
              <Link
                to={`/events/${event._id}/checkin`}
                className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold"
              >
                Start Check-in
              </Link>
              <Link
                to={`/events/${event._id}/manage`}
                className="flex-1 text-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition-all"
              >
                Manage Event
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyEventsPage;
