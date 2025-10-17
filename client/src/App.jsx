import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import EventDetailsPage from "./pages/EventDetailsPage";
import PaymentPage from "./pages/PaymentPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import CreateEventPage from "./pages/CreateEventPage";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import CheckinPage from "./pages/CheckinPage";
import EventAnalyticsPage from "./pages/EventAnalyticsPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import VerifiedSuccessPage from "./pages/VerifiedSuccessPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import MyEventsPage from "./pages/MyEventsPage";
import ManageEventPage from "./pages/ManageEventPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black">
          <Header />
          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route
                path="/verified-success"
                element={<VerifiedSuccessPage />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route
                path="/book/:bookingId"
                element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-events"
                element={
                  <RoleProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <MyEventsPage />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/booking-success/:bookingId"
                element={
                  <ProtectedRoute>
                    <BookingSuccessPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-event"
                element={
                  <RoleProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <CreateEventPage />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/events/:id/checkin"
                element={
                  <RoleProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <CheckinPage />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/events/:id/analytics"
                element={
                  <RoleProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <EventAnalyticsPage />
                  </RoleProtectedRoute>
                }
              />
            <Route
              path="/events/:id/manage"
              element={
                <RoleProtectedRoute allowedRoles={["organizer", "admin"]}>
                  <ManageEventPage />
                </RoleProtectedRoute>
              }
            />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
