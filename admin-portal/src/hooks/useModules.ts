import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

interface NavItem {
  id: number;
  label: string;
  icon: string;
  path: string;
}

interface Module {
  id: number;
  code: string;
  label: string;
  color: string;
  icon: string;
  navItems: NavItem[];
}

// Cache for modules data to prevent duplicate API calls
const modulesCache = new Map<string, { data: Module[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useModules = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const lang = i18n.language || 'en';
        const cacheKey = `modules-${lang}`;
        
        // Check cache first
        const cached = modulesCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setModules(cached.data);
          setError(null);
          setLoading(false);
          return;
        }

        const response = await axiosClient.get(`/modules?lang=${lang}`);
        
        const data = response.data;
        
        // Update cache
        modulesCache.set(cacheKey, { data, timestamp: Date.now() });
        
        setModules(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching modules:', err);
        
        // Handle 401 - redirect to login
        if (err.response?.status === 401) {
          navigate('/login');
          return;
        }
        
        // Handle 403 - no access to modules
        if (err.response?.status === 403) {
          console.warn('User does not have access to any modules');
          setModules([]);
          setError(null);
          return;
        }
        
        setError(err instanceof Error ? err.message : 'An error occurred');
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [i18n.language, navigate]);

  return { modules, loading, error };
};

// Cache for individual modules
const moduleByIdCache = new Map<string, { data: Module; timestamp: number }>();

export const useModuleById = (moduleId: string | number) => {
  const navigate = useNavigate();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId) return;

    const fetchModule = async () => {
      try {
        setLoading(true);
        const cacheKey = `module-${moduleId}`;
        
        // Check cache
        const cached = moduleByIdCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setModule(cached.data);
          setError(null);
          setLoading(false);
          return;
        }

        const response = await axiosClient.get(`/modules/${moduleId}`);
        
        const data = response.data;
        moduleByIdCache.set(cacheKey, { data, timestamp: Date.now() });
        
        setModule(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching module:', err);
        
        // Handle 401 - redirect to login
        if (err.response?.status === 401) {
          navigate('/login');
          return;
        }
        
        // Handle 403 - no access to this module
        if (err.response?.status === 403) {
          console.warn('User does not have access to this module');
          setError('You do not have access to this module');
          setModule(null);
          return;
        }
        
        setError(err instanceof Error ? err.message : 'An error occurred');
        setModule(null);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId, navigate]);

  return { module, loading, error };
};

// Cache for nav items
const navItemsCache = new Map<string, { data: NavItem[]; timestamp: number }>();

export const useNavItems = (moduleId: number) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId) return;

    const fetchNavItems = async () => {
      try {
        setLoading(true);
        const lang = i18n.language || 'en';
        const cacheKey = `nav-items-${moduleId}-${lang}`;
        
        // Check cache
        const cached = navItemsCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setNavItems(cached.data);
          setError(null);
          setLoading(false);
          return;
        }

        const response = await axiosClient.get(`/modules/${moduleId}/nav-items?lang=${lang}`);
        
        const data = response.data;
        navItemsCache.set(cacheKey, { data, timestamp: Date.now() });
        
        setNavItems(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching nav items:', err);
        
        // Handle 401 - redirect to login
        if (err.response?.status === 401) {
          navigate('/login');
          return;
        }
        
        // Handle 403 - no access to nav items
        if (err.response?.status === 403) {
          console.warn('User does not have access to any nav items in this module');
          setNavItems([]);
          setError(null);
          return;
        }
        
        setError(err instanceof Error ? err.message : 'An error occurred');
        setNavItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNavItems();
  }, [moduleId, i18n.language, navigate]);

  return { navItems, loading, error };
};
