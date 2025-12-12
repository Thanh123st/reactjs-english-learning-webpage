import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/hooks/useAuthContext';
import { AuthContext } from '@/contexts/AuthContext';
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, logout } = useAuthContext();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;
