// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';
// import { useAuth } from '../context/AuthContext';
// import { Link } from 'react-router-dom';


// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [formErrors, setFormErrors] = useState({});
//   const [error, setError] = useState('');
//   const [showResend, setShowResend] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const validateForm = () => {
//     const errors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!email.trim()) {
//       errors.email = 'Email is required.';
//     } else if (!emailRegex.test(email)) {
//       errors.email = 'Please enter a valid email address.';
//     }

//     if (!password) {
//       errors.password = 'Password is required.';
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');
//     setShowResend(false);

//     if (!validateForm()) return;

//     try {
//       setLoading(true);
//       const response = await api.post('/auth/login', { email, password });
//       const { user, token } = response.data;
//       login(user, token);
//       setLoading(false);
//       navigate('/');
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
//       setError(msg);
//       if (msg.toLowerCase().includes('verify')) setShowResend(true);
//     }
//   };

//   const handleResend = async () => {
//     try {
//       await api.post('/auth/resend-verification', { email });
//       setMessage('Verification email resent successfully! Please check your inbox.');
//       setError('');
//     } catch (err) {
//       setError('Failed to resend verification email.');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-16 px-4">
//       <h1 className="text-4xl font-extrabold text-sky-400 text-center mb-8">
//         Welcome Back
//       </h1>
//       <form
//         onSubmit={handleSubmit}
//         className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-8 rounded-2xl shadow-md hover:shadow-sky-500/20 transition-all duration-300"
//       >
//         {error && (
//           <p className="bg-red-600 text-white p-3 rounded mb-4 text-sm font-medium shadow">
//             {error}
//           </p>
//         )}
//         {message && (
//           <p className="bg-green-600 text-white p-3 rounded mb-4 text-sm font-medium shadow">
//             {message}
//           </p>
//         )}

//         <div className="mb-5">
//           <label htmlFor="email" className="block text-slate-300 mb-2 font-medium">
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className={`w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 ${
//               formErrors.email ? 'ring-red-500' : 'focus:ring-sky-500'
//             } transition`}
//             required
//           />
//           {formErrors.email && (
//             <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
//           )}
//         </div>

//         <div className="mb-6">
//           <label htmlFor="password" className="block text-slate-300 mb-2 font-medium">
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className={`w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 ${
//               formErrors.password ? 'ring-red-500' : 'focus:ring-sky-500'
//             } transition`}
//             required
//           />
//           {formErrors.password && (
//             <p className="text-red-400 text-sm mt-1">{formErrors.password}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>


//         <Link to="/register" className="block text-center text-sm text-slate-400 hover:text-slate-200 mt-4">
//           New here? Create an account
//         </Link>

//         {showResend && (
//           <button
//             type="button"
//             onClick={handleResend}
//             className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 transition-all duration-300"
//           >
//             Resend Verification Email
//           </button>
//         )}
//       </form>
//     </div>
//   );
// };

// export default LoginPage;






import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setShowResend(false);

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      login(user, token);
      navigate('/');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Login failed. Please check your credentials.';
      setError(msg);
      if (msg.toLowerCase().includes('verify')) setShowResend(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      await api.post('/auth/resend-verification', { email });
      setMessage('Verification email resent successfully! Please check your inbox.');
      setError('');
    } catch (err) {
      setError('Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-4xl font-extrabold text-sky-400 text-center mb-8">
        Welcome Back
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

        <div className="mb-5">
          <label htmlFor="email" className="block text-slate-300 mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 ${
              formErrors.email ? 'ring-red-500' : 'focus:ring-sky-500'
            } transition`}
            required
          />
          {formErrors.email && (
            <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
          )}
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
              formErrors.password ? 'ring-red-500' : 'focus:ring-sky-500'
            } transition`}
            required
          />
          {formErrors.password && (
            <p className="text-red-400 text-sm mt-1">{formErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <Link
          to="/register"
          className="block text-center text-sm text-slate-400 hover:text-slate-200 mt-4"
        >
          New here? Create an account
        </Link>

        {showResend && (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className={`w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 transition-all duration-300 ${
              resendLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {resendLoading ? 'Resending...' : 'Resend Verification Email'}
          </button>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
