import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

// Simple auth guard that checks for a token in localStorage.
// If not present (or empty/'undefined'), redirects to /login after a delay and preserves the attempted location.
// Can be used either as a wrapper component with children or as a layout route with Outlet.
const RequireAuth: React.FC<{ children?: React.ReactElement; redirectDelay?: number }> = ({ 
  children, 
  redirectDelay = 0 // delay in milliseconds before redirecting (default: 0 = immediate)
}) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug('[RequireAuth] token:', token);
    
    const isUnauthenticated =
      !token || token === 'undefined' || (typeof token === 'string' && token.trim() === '');

    if (isUnauthenticated) {
      if (redirectDelay > 0) {
        // If delay is specified, set a timeout before marking as ready to redirect
        const timer = setTimeout(() => {
          setIsAuthenticating(false);
        }, redirectDelay);
        return () => clearTimeout(timer);
      } else {
        // Mark as ready to redirect immediately
        setIsAuthenticating(false);
      }
    } else {
      // Token exists and is valid, mark as authenticated
      setIsAuthenticating(false);
    }
  }, [token, redirectDelay]);

  // If still authenticating, render nothing (prevents flash of content)
  if (isAuthenticating) {
    return null;
  }

  // If no valid token, redirect to login
  if (!token || token === 'undefined' || (typeof token === 'string' && token.trim() === '')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Token exists and is valid, render protected content
  return children ? children : <Outlet />;
};

export default RequireAuth;
