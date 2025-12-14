import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import './AdminModulesPage.css';

interface Module {
  id: number;
  code: string;
  label: Record<string, string>;
  color: string;
  icon: string;
  navItems?: Array<{
    id: number;
    label: Record<string, string>;
    icon: string;
    path: string;
  }>;
}

const AdminModulesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/api/modules');
      setModules(response.data);
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (module: Module) => {
    // Navigate to specific module
    if (module.code === 'superadmin') {
      navigate('/admin/superadmin');
    } else if (module.code === 'admin') {
      navigate('/admin/users');
    } else if (module.code === 'website') {
      navigate('/ads');
    }
  };

  const getLabel = (label: Record<string, string>) => {
    return label[i18n.language] || label['en'] || 'N/A';
  };

  if (loading) {
    return <div className="admin-modules-loading">{t('common.loading', 'Loading...')}</div>;
  }

  return (
    <div className="admin-modules-page">
      <div className="page-header">
        <h1>{t('admin.modulesOverview', 'Admin Modules Overview')}</h1>
        <p className="page-subtitle">
          {t('admin.modulesDescription', 'Access and manage different admin modules for your system')}
        </p>
      </div>

      <div className="modules-grid">
        {modules.map((module) => (
          <Card
            key={module.id}
            className="module-card"
            style={{ borderLeft: `4px solid ${module.color}` }}
          >
            <div className="module-header">
              <div className="module-icon-container" style={{ backgroundColor: module.color }}>
                <i className={`${module.icon} module-icon`}></i>
              </div>
              <div className="module-title">
                <h3>{getLabel(module.label)}</h3>
                <p className="module-code">{module.code}</p>
              </div>
            </div>

            {module.navItems && module.navItems.length > 0 && (
              <div className="module-nav-items">
                <p className="nav-label">
                  {t('admin.quickAccess', 'Quick Access')}:
                </p>
                <ul>
                  {module.navItems.slice(0, 5).map((item) => (
                    <li key={item.id}>
                      <i className={item.icon}></i>
                      <span>{getLabel(item.label)}</span>
                    </li>
                  ))}
                  {module.navItems.length > 5 && (
                    <li className="more-items">
                      +{module.navItems.length - 5} {t('admin.more', 'more')}
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="module-actions">
              <Button
                label={t('admin.access', 'Access')}
                icon="pi pi-arrow-right"
                onClick={() => handleModuleClick(module)}
                style={{
                  backgroundColor: module.color,
                  borderColor: module.color
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      {modules.length === 0 && (
        <div className="empty-state">
          <i className="pi pi-inbox"></i>
          <p>{t('admin.noModules', 'No modules found')}</p>
        </div>
      )}
    </div>
  );
};

export default AdminModulesPage;
