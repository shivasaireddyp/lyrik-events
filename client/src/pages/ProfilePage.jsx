import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Please log in to view your profile.
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
    // setMenuOpen(false);
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900/80 text-white mt-16 p-8 rounded-2xl shadow-lg border border-slate-700">
      <h1 className="text-3xl font-extrabold mb-4 text-center">My Profile</h1>

      <div className="space-y-3 mb-6">
        <p>
          <span className="font-semibold text-slate-400">Name:</span>{" "}
          {user.name}
        </p>
        <p>
          <span className="font-semibold text-slate-400">Email:</span>{" "}
          {user.email}
        </p>
        <p>
          <span className="font-semibold text-slate-400">Role:</span>{" "}
          {user.role}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Link
          to="/my-bookings"
          className="bg-sky-600 hover:bg-sky-700 text-white text-center py-2 rounded-lg font-semibold transition-all"
        >
          View My Bookings
        </Link>
        {(user.role === "organizer" || user.role === "admin") && (
          <Link
            to="/my-events"
            className="bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg font-semibold transition-all"
          >
            View My Created Events
          </Link>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 mt-4 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
