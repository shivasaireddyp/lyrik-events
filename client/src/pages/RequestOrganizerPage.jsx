import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// Removed api import for now as backend endpoint doesn't exist

const RequestOrganizerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Pre-fill email and phone if available from user context
    email: user?.email.endsWith('@vnrvjiet.org') ? user.email : '', 
    phone: user?.phone || '', 
    eventName: '',
    reason: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side email validation
    if (!formData.email.endsWith('@vnrvjiet.org')) {
      setError('Please provide a valid VNRVJIET email address (@vnrvjiet.org).');
      return;
    }
    if (!formData.eventName || !formData.reason || !formData.phone) {
        setError('Please fill out all fields.');
        return;
    }

    setLoading(true);

    // --- Placeholder for Backend Call ---
    // In a real implementation, you would make an API call here:
    // await api.post('/auth/request-organizer-role', formData);

    // Simulate API call success
    setTimeout(() => {
      setSuccess('Your request has been submitted! An admin will review it shortly.');
      setLoading(false);
      // Optional: Redirect after a few seconds
      // setTimeout(() => navigate('/profile'), 3000); 
    }, 1500); 
    // --- End Placeholder ---
  };

  return (
    <div className="max-w-xl mx-auto mt-10 text-white px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-sky-400">Request Organizer Role</h1>
      
      {success ? (
        <div className="bg-green-800/50 p-6 rounded-lg shadow-lg text-center border border-green-600">
          <h2 className="text-2xl font-bold text-green-400 mb-3">✅ Request Submitted!</h2>
          <p className="text-slate-300">{success}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-800/70 backdrop-blur-md p-8 rounded-lg shadow-xl border border-slate-700 space-y-5">
          {error && <p className="bg-red-500/80 border border-red-700 text-white p-3 rounded-md text-center">{error}</p>}
          
          <div>
            <label className="block text-slate-300 mb-2 font-medium" htmlFor="email">VNRVJIET Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="yourname@vnrvjiet.org"
              className="w-full p-3 bg-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 border border-slate-600" 
              pattern=".+@vnrvjiet\.org$" // HTML5 pattern validation
              title="Must be a vnrvjiet.org email address"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-medium" htmlFor="phone">Contact Phone</label>
            <input 
              type="tel" 
              name="phone" 
              id="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
              placeholder="Your phone number"
              className="w-full p-3 bg-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 border border-slate-600" 
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-medium" htmlFor="eventName">Fest/Event Name</label>
            <input 
              type="text" 
              name="eventName" 
              id="eventName" 
              value={formData.eventName} 
              onChange={handleChange} 
              required 
              placeholder="E.g., Convergence 2026, Syntillations Tech Fest"
              className="w-full p-3 bg-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 border border-slate-600" 
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-medium" htmlFor="reason">Reason for Request</label>
            <textarea 
              name="reason" 
              id="reason" 
              value={formData.reason} 
              onChange={handleChange} 
              required 
              rows="4" 
              placeholder="Briefly explain why you want to be an organizer (e.g., previous experience, club affiliation)."
              className="w-full p-3 bg-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 border border-slate-600"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      )}
    </div>
  );
};

export default RequestOrganizerPage;