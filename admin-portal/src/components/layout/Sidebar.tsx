import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useModule, ModuleType, MODULE_CONFIGS } from '../../context/ModuleContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { currentModule, setCurrentModule, moduleConfig, allModules } = useModule();

  const modules = allModules.map(m => m.code as ModuleType);

  const getLabel = (label: any, fallbackKey: string = ''): string => {
    if (typeof label === 'string') return label;
    if (typeof label === 'object' && label !== null) {
      return label[i18n.language] || label['en'] || '';
    }
    return fallbackKey ? t(fallbackKey) : '';
  };

  const handleModuleChange = (module: ModuleType) => {
    setCurrentModule(module);
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">{t('sidebar.title', 'Admin Panel')}</h2>

      {/* Module Switcher */}
      <div className="module-switcher">
        <div className="module-switcher-label">{t('modules.selectModule')}</div>
        {modules.map((module , index) => {
          const moduleData = allModules.find(m => m.code === module) || MODULE_CONFIGS[module as ModuleType];
          return (
            <button
              key={`${module}-${index}`}
              onClick={() => handleModuleChange(module)}
              className={`module-button ${currentModule === module ? 'active' : ''}`}
              style={{
                borderLeftColor:
                  currentModule === module ? moduleData.color : 'transparent',
              }}
              title={getLabel(moduleData.label, moduleData.nameKey || '')}
            >
              <i className={moduleData.icon}></i>
              <span>{getLabel(moduleData.label, moduleData.nameKey || '')}</span>
            </button>
          );
        })}
      </div>

      {/* Module Navbar */}
      <nav className="sidebar-menu">
        {moduleConfig && (
          <>
            <div className="current-module">
              <i className={moduleConfig.icon} style={{ color: moduleConfig.color }}></i>
              <span>{getLabel(moduleConfig.label, moduleConfig.nameKey)}</span>
            </div>

            {moduleConfig.navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <i className={`${item.icon} mr-2`}></i>
                {getLabel(item.label, item.labelKey)}
              </Link>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
