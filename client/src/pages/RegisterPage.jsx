// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";

// const RegisterPage = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [showResend, setShowResend] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     try {
//       await api.post("/auth/register", { name, email, password, phone });
//       setMessage("Account created! Please check your email for a verification link.");
//       setShowResend(true);
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed. Please try again.");
//     }
//   };

//   const handleResend = async () => {
//     try {
//       await api.post("/auth/resend-verification", { email });
//       setMessage("Verification email resent successfully! Please check your inbox.");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to resend verification email.");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10">
//       <h1 className="text-3xl font-bold text-white text-center mb-6">
//         Create Your Account
//       </h1>
//       <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-lg shadow-lg">
        
        
//         <div className="mb-4">
//           <label className="block text-slate-300 mb-2" htmlFor="name">Name</label>
//           <input
//             type="text" id="name" value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full p-3 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-slate-300 mb-2" htmlFor="email">Email</label>
//           <input
//             type="email" id="email" value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-3 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-slate-300 mb-2" htmlFor="phone">Phone Number</label>
//           <input
//             type="tel" id="phone" value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="w-full p-3 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-slate-300 mb-2" htmlFor="password">Password</label>
//           <input
//             type="password" id="password" value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-3 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded transition duration-300"
//         >
//           Register
//         </button>

//         {showResend && (
//           <button
//             type="button"
//             onClick={handleResend}
//             className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300"
//           >
//             Resend Verification Email
//           </button>
//         )}
//         {error && <p className="bg-red-500 text-white p-3 rounded mb-4">{error}</p>}
//         {message && <p className="bg-green-600 text-white p-3 rounded mb-4">{message}</p>}
//       </form>
//     </div>
//   );
// };

// export default RegisterPage;






import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showResend, setShowResend] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!name.trim()) {
      errors.name = "Name is required.";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(phone)) {
      errors.phone = "Phone number must be 10 digits.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setShowResend(false);

    if (!validateForm()) return;

    try {
      await api.post("/auth/register", { name, email, password, phone });
      setMessage("Account created! Please check your email for a verification link.");
      setShowResend(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/resend-verification", { email });
      setMessage("Verification email resent successfully! Please check your inbox.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend verification email.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-4xl font-extrabold text-sky-400 text-center mb-8">
        Create Your Account
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-8 rounded-2xl shadow-md hover:shadow-sky-500/20 transition-all duration-300"
      >
        {error && (
          <p className="bg-red-600 text-white p-3 rounded mb-4 text-sm font-medium shadow">
            {error}
          </p>
        )}
        {message && (
          <p className="bg-green-600 text-white p-3 rounded mb-4 text-sm font-medium shadow">
            {message}
          </p>
        )}

        <div className="mb-4">
          <label htmlFor="name" className="block text-slate-300 mb-2 font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.name ? "ring-red-500" : "focus:ring-sky-500"
            } transition`}
          />
          {formErrors.name && <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-slate-300 mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.email ? "ring-red-500" : "focus:ring-sky-500"
            } transition`}
          />
          {formErrors.email && <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-slate-300 mb-2 font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.phone ? "ring-red-500" : "focus:ring-sky-500"
            } transition`}
          />
          {formErrors.phone && <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-slate-300 mb-2 font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.password ? "ring-red-500" : "focus:ring-sky-500"
            } transition`}
          />
          {formErrors.password && (
            <p className="text-red-400 text-sm mt-1">{formErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
        >
          Register
        </button>

        <Link to="/login" className="block text-center text-slate-400 hover:text-slate-200 mt-4 text-sm">
          Already have an account? Log in
        </Link>

        {showResend && (
          <button
            type="button"
            onClick={handleResend}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 transition-all duration-300"
          >
            Resend Verification Email
          </button>
        )}
      </form>
    </div>
  );
};

export default RegisterPage;
