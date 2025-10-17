import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = location.state || {};

  const {fetchBookings} = useAuth();

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (timeLeft === 0 && !sessionExpired) {
      setSessionExpired(true);
      setTimeout(() => {
        navigate(`/events/${eventId}`);
      }, 3000);
      return;
    }

    const timerId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, sessionExpired, navigate, eventId]);

  const handleConfirmPayment = async () => {
    setStatus("loading");
    setError("");
    try {
      await api.post(`/bookings/${bookingId}/confirm`);
      await fetchBookings();
      navigate(`/booking-success/${bookingId}`);
    } catch (err) {
      console.error("Payment confirmation failed:", err);
      setError(err.response?.data?.message || "Confirmation failed.");
      setStatus("error");
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-2xl mx-auto mt-10 text-center text-white">
      <h1 className="text-4xl font-bold mb-6">Confirm Your Booking</h1>
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
        {sessionExpired ? (
          <p className="text-red-500 text-2xl font-semibold">
            ⚠️ Session Timed Out! Redirecting...
          </p>
        ) : status === "error" ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="text-2xl font-mono text-amber-400 mb-6">
              Time left: {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </div>
            <button
              onClick={handleConfirmPayment}
              disabled={status === "loading"}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg text-xl disabled:bg-slate-600"
            >
              {status === "loading" ? "Processing..." : "Confirm Payment"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
