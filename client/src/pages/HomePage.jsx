import { useState, useEffect } from "react";
import api from "../services/api";
import EventCard from "../components/EventCard";
import { useAuth } from "../context/AuthContext";


const HomePage = () => {
  const { user, bookings} = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data);
      } catch (err) {
        setError("Failed to fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-white text-lg animate-pulse">
        Loading events...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-400 text-lg font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Discover Exciting Events 🎉
        </h1>
        <p className="text-slate-400 text-lg">
          Explore the latest events, book your seat, or create your own!
        </p>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event._id} className="h-full">
              <EventCard event={event} user={user} bookings={bookings} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-center text-xl mt-10">
          No upcoming events found.
        </p>
      )}
    </div>
  );
};

export default HomePage;
