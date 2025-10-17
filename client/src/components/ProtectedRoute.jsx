import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  // Showing a loading indicator while the auth state is being checked on initial load.
  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

      // If no user logged in, redirecting to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the child component.
  return children;
};

export default ProtectedRoute;