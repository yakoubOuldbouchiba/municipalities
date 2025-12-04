import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useModules } from '../hooks/useModules';

export type ModuleType = 'admin' | 'website' | 'claims' | 'documents';

export interface NavItem {
  id?: number;
  labelKey?: string;
  label?: string;
  icon: string;
  path: string;
}

export interface DatabaseModule {
  id: number;
  code: string;
  label: string;
  color: string;
  icon: string;
  navItems: NavItem[];
}

export interface ModuleConfig {
  id?: number;
  code?: string;
  id_type?: ModuleType;
  nameKey?: string;
  label?: string;
  descriptionKey?: string;
  description?: string;
  icon: string;
  color: string;
  navItems: NavItem[];
}

interface ModuleContextType {
  currentModule: ModuleType;
  setCurrentModule: (module: ModuleType) => void;
  moduleConfig: ModuleConfig;
  allModules: ModuleConfig[];
  loading: boolean;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

// Fallback module configurations
export const MODULE_CONFIGS: Record<ModuleType, ModuleConfig> = {
  admin: {
    id_type: 'admin',
    nameKey: 'modules.admin.name',
    descriptionKey: 'modules.admin.description',
    icon: 'pi pi-lock',
    color: '#3b82f6',
    navItems: [
      { labelKey: 'nav.users', icon: 'pi pi-users', path: '/admin/users' },
      { labelKey: 'nav.groups', icon: 'pi pi-sitemap', path: '/admin/groups' },
      { labelKey: 'nav.roles', icon: 'pi pi-shield', path: '/admin/roles' },
      { labelKey: 'nav.applications', icon: 'pi pi-window-maximize', path: '/admin/applications' },
    ],
  },
  website: {
    id_type: 'website',
    nameKey: 'modules.website.name',
    descriptionKey: 'modules.website.description',
    icon: 'pi pi-globe',
    color: '#10b981',
    navItems: [
      { labelKey: 'sidebar.ads', icon: 'pi pi-bullhorn', path: '/ads' },
      { labelKey: 'sidebar.news', icon: 'pi pi-newspaper', path: '/news' },
      { labelKey: 'sidebar.events', icon: 'pi pi-calendar', path: '/events' },
      { labelKey: 'sidebar.papers', icon: 'pi pi-file', path: '/papers' },
      { labelKey: 'sidebar.quickLinks', icon: 'pi pi-link', path: '/quick-links' },
      { labelKey: 'sidebar.importantNumbers', icon: 'pi pi-phone', path: '/important-numbers' },
      { labelKey: 'sidebar.potentials', icon: 'pi pi-lightbulb', path: '/potentials' },
      { labelKey: 'sidebar.persons', icon: 'pi pi-user', path: '/persons' },
    ],
  },
  claims: {
    id_type: 'claims',
    nameKey: 'modules.claims.name',
    descriptionKey: 'modules.claims.description',
    icon: 'pi pi-file-export',
    color: '#f59e0b',
    navItems: [
      { labelKey: 'nav.citizenClaim', icon: 'pi pi-id-card', path: '/claims/citizen' },
      { labelKey: 'nav.companyClaim', icon: 'pi pi-building', path: '/claims/company' },
      { labelKey: 'nav.organizationClaim', icon: 'pi pi-sitemap', path: '/claims/organization' },
    ],
  },
  documents: {
    id_type: 'documents',
    nameKey: 'modules.documents.name',
    descriptionKey: 'modules.documents.description',
    icon: 'pi pi-file-pdf',
    color: '#10b981',
    navItems: [
      { labelKey: 'modules.documents.official', icon: 'pi pi-check-circle', path: '/documents/official' },
      { labelKey: 'modules.documents.forms', icon: 'pi pi-list', path: '/documents/forms' },
      { labelKey: 'modules.documents.reports', icon: 'pi pi-chart-bar', path: '/documents/reports' },
      { labelKey: 'modules.documents.archives', icon: 'pi pi-inbox', path: '/documents/archives' },
    ],
  },
};

// Helper function to extract string label from object or string
const extractLabel = (label: any, lang: string = 'en'): string => {
  if (typeof label === 'string') return label;
  if (typeof label === 'object' && label !== null) {
    return label[lang] || label['en'] || Object.values(label as Record<string, string>)[0] || '';
  }
  return '';
};

export const ModuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentModule, setCurrentModule] = useState<ModuleType>('website');
  const { modules, loading } = useModules();
  const [allModules, setAllModules] = useState<ModuleConfig[]>([]);

  useEffect(() => {
    if (modules.length > 0) {
      // Transform database modules to match ModuleConfig format
      const transformedModules = modules.map((dbModule: any) => ({
        id: dbModule.id,
        code: dbModule.code,
        label: extractLabel(dbModule.label, i18n.language),
        nameKey: dbModule.code ? `modules.${dbModule.code}.name` : undefined,
        icon: dbModule.icon,
        color: dbModule.color,
        navItems: (dbModule.navItems || []).map((item: any) => ({
          id: item.id,
          label: extractLabel(item.label, i18n.language), // Extract string from object
          icon: item.icon,
          path: item.path,
        })),
      }));
      setAllModules(transformedModules);
    } else {
      // Fallback to static configs if no modules from DB
      setAllModules(Object.values(MODULE_CONFIGS));
    }
  }, [modules, i18n.language]);

  const moduleConfig = allModules.find((m) => m.code === currentModule) || MODULE_CONFIGS[currentModule];

  return (
    <ModuleContext.Provider
      value={{
        currentModule,
        setCurrentModule,
        moduleConfig,
        allModules,
        loading,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
};

export const useModule = (): ModuleContextType => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModule must be used within ModuleProvider');
  }
  return context;
};
