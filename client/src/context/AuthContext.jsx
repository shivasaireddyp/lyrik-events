import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me")
        .then((response) => {
          setUser(response.data);
          fetchBookings();
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
    fetchBookings();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setBookings([]);
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(prev => prev.map(b => b.event._id === bookingId ? { ...b, status: newStatus } : b));
  };

  const isBooked = (eventId) => {
    return bookings.some(b => b.event?._id === eventId && b.status === 'confirmed');
  };

  const value = { user, loading, login, logout, isBooked, bookings, updateBookingStatus, fetchBookings };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
