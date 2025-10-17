import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const BookingSuccessPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [calendarLink, setCalendarLink] = useState("");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await api.get(`/bookings/${bookingId}`);
        setBooking(response.data.booking);
        setCalendarLink(response.data.googleCalendarUrl);
      } catch (err) {
        setError("Could not fetch booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  if (loading)
    return (
      <p className="text-white text-center mt-10">
        Loading your confirmation...
      </p>
    );
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!booking)
    return <p className="text-white text-center mt-10">Booking not found.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 text-center text-white">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-green-400">
            ✅ Booking Confirmed!
          </h1>
          <p className="text-slate-300">
            Your ticket for <strong>{booking.event.title}</strong> is secured.
          </p>
          <a
            href={calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add to Google Calendar
          </a>
          <div className="pt-4">
            <Link to="/my-bookings" className="text-sky-400 hover:underline">
              View all your bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
