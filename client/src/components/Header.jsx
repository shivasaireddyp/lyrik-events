import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const navLink = (to, label, className = "") => (
    
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`block px-4 py-2 text-white hover:text-sky-400 ${className}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="bg-black shadow-md border-b border-slate-700">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-white hover:text-sky-400 transition"
        >
          Lyrik Events
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {user ? (
            <>
              {(user.role === "organizer" || user.role === "admin") &&
                navLink("/create-event", "Create Event")}
              {navLink("/my-bookings", "My Bookings")}
              <span className="text-white font-medium">Hi, {user.name}!</span>
              {navLink("/profile", "Profile")}
            </>
          ) : (
            <>
              {navLink("/login", "Login")}
              <Link
                to="/register"
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3">
          {user && (
            <span className="text-sky-400 font-medium">
              Hi, {user.name.split(" ")[0]}!
            </span>
          )}
          <button
            className="text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-slate-900 shadow-lg transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-sky-400"
            onClick={() => setMenuOpen(false)}
          >
            Lyrik Events
          </Link>
          <button onClick={() => setMenuOpen(false)} className="text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-3">
          {user ? (
            <>
              <span className="text-sky-400 font-medium px-4 py-2">
                Hi, {user.name.split(" ")[0]}!
              </span>
              {(user.role === "organizer" || user.role === "admin") &&
                navLink("/create-event", "Create Event")}
              {navLink("/profile", "Profile")}
              {navLink("/my-bookings", "My Bookings")}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {navLink("/login", "Login")}
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg text-center transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Background Overlay when menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
