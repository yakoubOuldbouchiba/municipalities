import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${apiUrl}/modules?lang=${lang}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch modules: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update cache
        modulesCache.set(cacheKey, { data, timestamp: Date.now() });
        
        setModules(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [i18n.language]);

  return { modules, loading, error };
};

// Cache for individual modules
const moduleByIdCache = new Map<string, { data: Module; timestamp: number }>();

export const useModuleById = (moduleId: string | number) => {
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

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${apiUrl}/modules/${moduleId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch module: ${response.status}`);
        }
        
        const data = await response.json();
        moduleByIdCache.set(cacheKey, { data, timestamp: Date.now() });
        
        setModule(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching module:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setModule(null);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  return { module, loading, error };
};

// Cache for nav items
const navItemsCache = new Map<string, { data: NavItem[]; timestamp: number }>();

export const useNavItems = (moduleId: number) => {
  const { i18n } = useTranslation();
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

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${apiUrl}/modules/${moduleId}/nav-items?lang=${lang}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch nav items: ${response.status}`);
        }
        
        const data = await response.json();
        navItemsCache.set(cacheKey, { data, timestamp: Date.now() });
        
        setNavItems(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching nav items:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setNavItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNavItems();
  }, [moduleId, i18n.language]);

  return { navItems, loading, error };
};
