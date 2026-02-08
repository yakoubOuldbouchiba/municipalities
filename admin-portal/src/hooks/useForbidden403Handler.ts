import { useState, useEffect, useRef } from 'react';

interface Forbidden403Error {
  message: string;
  requiredRoles: string[];
  status: number;
  data?: any;
}

export const useForbidden403Handler = () => {
  const [forbidden403Error, setForbidden403Error] = useState<Forbidden403Error | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    const handleApi403Error = (event: Event) => {
      if (!isMountedRef.current) return;
      
      const customEvent = event as CustomEvent<Forbidden403Error>;
      setForbidden403Error(customEvent.detail);
    };

    window.addEventListener('api403Error', handleApi403Error);
    return () => window.removeEventListener('api403Error', handleApi403Error);
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const clearError = () => {
    if (isMountedRef.current) {
      setForbidden403Error(null);
    }
  };

  return { forbidden403Error, clearError };
};
