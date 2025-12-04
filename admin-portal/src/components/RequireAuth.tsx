import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Simple auth guard that checks for a token in localStorage.
// If not present (or empty/'undefined'), redirects to /login after a delay and preserves the attempted location.
const RequireAuth: React.FC<{ children: React.ReactElement; redirectDelay?: number }> = ({ 
  children, 
  redirectDelay = 0 // delay in milliseconds before redirecting (default: 0 = immediate)
}) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Debugging help: log token state (won't run in production if you strip logs)
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug('[RequireAuth] token:', token);
  }, [token]);

  // Handle authentication check with optional delay
  useEffect(() => {
    const isUnauthenticated =
      !token || token === 'undefined' || (typeof token === 'string' && token.trim() === '');

    if (isUnauthenticated) {
      if (redirectDelay > 0) {
        // If delay is specified, set a timeout before redirecting
        const timer = setTimeout(() => {
          setShouldRedirect(true);
        }, redirectDelay);

        return () => clearTimeout(timer); // Cleanup timeout on unmount
      } else {
        // Redirect immediately
        setShouldRedirect(true);
      }
    }
  }, [token, redirectDelay]);

  if (shouldRedirect) {
    // Use Navigate to preserve router history behavior.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
