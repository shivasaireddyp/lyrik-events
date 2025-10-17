import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import QRCode from "react-qr-code";
import ConfirmationModal from "../components/ConfirmationModal";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, bookings, updateBookingStatus, fetchBookings } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingBooking, setCheckingBooking] = useState(true);
  const [bookingError, setBookingError] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const userBooking = bookings.find((b) => b.event?._id === id && b.status === 'confirmed');
  
  useEffect(() => {
    const fetchEventAndCheckBooking = async () => {
      try {
        setLoading(true);
        const eventResponse = await api.get(`/events/${id}`);
        setEvent(eventResponse.data);
      } catch (err) {
        setError("Failed to fetch event details.");
      } finally {
        setLoading(false);
        setCheckingBooking(false);
      }
    };
    fetchEventAndCheckBooking();
  }, [id, user]);


  const handleBooking = async () => {
    setBookingError("");
    try {
      const response = await api.post("/bookings/initiate", {
        eventId: event._id,
      });
      navigate(`/book/${response.data.bookingId}`, {
        state: { eventId: event._id },
      });
    } catch (err) {
      setBookingError(err.response?.data?.message || "Booking failed.");
    }
  };

  const handleConfirmCancel = async () => {
    if (!userBooking) return;
    try {
      await api.put(`/bookings/${userBooking._id}/cancel`);
      // setUserBooking(null);
      updateBookingStatus(userBooking._id, 'cancelled');
      await fetchBookings();
    } catch (err) {
      console.error("Failed to cancel booking:", err);
    } finally {
      setIsCancelModalOpen(false);
    }
  };

  const renderBookingSection = () => {
    if (!user) {
      return (
        <p className="text-lg text-amber-400 text-center">
          Please{" "}
          <Link to="/login" className="font-bold underline text-sky-400">
            login
          </Link>{" "}
          to book this event.
        </p>
      );
    }

    if (checkingBooking) {
      return (
        <button
          disabled
          className="bg-slate-600 text-white font-semibold py-3 px-8 rounded-lg text-lg cursor-not-allowed w-full md:w-auto"
        >
          Checking status...
        </button>
      );
    }

    if (userBooking?.status === "confirmed") {
      return (
        <div className="text-center bg-slate-700/60 border border-slate-600 p-8 rounded-2xl shadow-xl">
          {userBooking.isCheckedIn ? (
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-green-400">
                🎉 You’re Checked In!
              </h2>
              <p className="text-slate-400 mt-2">
                Welcome to the event — enjoy your time!
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-green-400 mb-2">
                ✅ You've Registered for This Event!
              </h2>
              <p className="text-slate-400 mb-4">
                Booked on: {new Date(userBooking.createdAt).toLocaleString()}
              </p>
              <div className="p-4 bg-white rounded-lg inline-block">
                <QRCode value={userBooking.qrCodeData} size={200} />
              </div>
              <p className="text-slate-300 mt-4">
                Present this QR code at the venue for check-in.
              </p>
            </>
          )}

          {!userBooking.isCheckedIn && (
            <div className="mt-6">
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
              >
                Cancel My Booking
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        {(user.role==='user' || event.organizer._id != user._id)&& (
          <>
            <button
          onClick={handleBooking}
          disabled={!!bookingError}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 disabled:bg-slate-600"
        >
          Book Now
        </button>
          </>
        )} 
        {bookingError && <p className="text-red-500 mt-3">{bookingError}</p>}
      </>
    );
  };

  if (loading)
    return <p className="text-white text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!event)
    return <p className="text-white text-center mt-10">Event not found.</p>;

  return (
    <>
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Confirm Cancellation"
        message="Are you sure you want to cancel your booking? This action cannot be undone."
      />

      <div className="text-white max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Event Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-sky-400">
            {event.title}
          </h1>
          <p className="text-lg text-slate-400">
            Hosted by{" "}
            <span className="font-semibold text-white">
              {event.organizer.name}
            </span>
          </p>
        </div>

        {/* Event Details */}
        <div className="bg-slate-800/70 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-700">
          <p className="mb-6 text-slate-300 whitespace-pre-wrap leading-relaxed">
            {event.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-base sm:text-lg">
            <div>
              <span className="font-semibold text-sky-400">From:</span>{" "}
              {new Date(event.startTime).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold text-sky-400">To:</span>{" "}
              {new Date(event.endTime).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold text-sky-400">Venue:</span>{" "}
              {event.venue.name}
            </div>
            <div>
              <span className="font-semibold text-sky-400">Category:</span>{" "}
              {event.category}
            </div>
          </div>

          {/* Booking / Check-in / Organizer Controls */}
          <div className="mt-10 flex flex-col items-center space-y-6">
            {renderBookingSection()}

            {(user?.role === "organizer" || user?.role === "admin") && (
              <div className="flex flex-col">
                <button
                  onClick={() => navigate(`/events/${event._id}/analytics`)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  View Event Analytics
                </button>
                <button
                  onClick={() => navigate(`/events/${event._id}/checkin`)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 mt-2 rounded-lg transition-all"
                >
                  Start Check-in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetailsPage;
