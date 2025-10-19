import { useState, useEffect } from "react";
import api from "../services/api";
import EventCard from "../components/EventCard";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { user, bookings } = useAuth();
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

  const scrollToEvents = () => {
    document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
  };

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
    <>
      {!user && (
  <div className="relative -mt-4 -mx-6 mb-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-sky-900 to-indigo-900 animate-gradient-x"></div>
    <div className="relative max-w-7xl mx-auto px-6 py-24 text-center text-white">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
        The <span className="text-sky-400">Heartbeat</span> of Campus Events
      </h1>
      <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-300">
        Welcome to Lyrik, the central hub for all college festival activities. Discover exciting tech competitions, vibrant cultural shows, and thrilling sports events. Book your spot, manage your schedule, and never miss a moment of the action.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={scrollToEvents}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
        >
          Explore Events
        </button>
      </div>
    </div>
  </div>
)}

<style>{`
  @keyframes gradient-x {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 15s ease infinite;
  }
`}</style>

      
      {/* 👇 EXISTING CONTENT STARTS HERE 👇 */}
      <div id="events-section" className="max-w-7xl mx-auto px-5 py-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Discover Exciting Events <span className="text-sky-400">On Campus.</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Explore the latest events, book your seat, or create your own!
          </p>
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-4">Upcoming Events</h2>
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
    </>
  );
};

export default HomePage;