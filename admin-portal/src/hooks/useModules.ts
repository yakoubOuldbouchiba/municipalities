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
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${apiUrl}/modules?lang=${lang}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        
        const data = await response.json();
        setModules(data);
        setError(null);
      } catch (err) {
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

export const useModuleById = (moduleId: string | number) => {
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${apiUrl}/modules/${moduleId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch module');
        }
        
        const data = await response.json();
        setModule(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setModule(null);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchModule();
    }
  }, [moduleId]);

  return { module, loading, error };
};

export const useNavItems = (moduleId: number) => {
  const { i18n } = useTranslation();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        setLoading(true);
        const lang = i18n.language || 'en';
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${apiUrl}/modules/${moduleId}/nav-items?lang=${lang}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch nav items');
        }
        
        const data = await response.json();
        setNavItems(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setNavItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchNavItems();
    }
  }, [moduleId, i18n.language]);

  return { navItems, loading, error };
};
