import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Simple auth guard that checks for a token in localStorage.
// If not present (or empty/'undefined'), redirects to /login and preserves the attempted location.
const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // Debugging help: log token state (won't run in production if you strip logs)
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug('[RequireAuth] token:', token);
  }, [token]);

  const isUnauthenticated =
    !token || token === 'undefined' || (typeof token === 'string' && token.trim() === '');

  if (isUnauthenticated) {
    // Use Navigate to preserve router history behavior.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
