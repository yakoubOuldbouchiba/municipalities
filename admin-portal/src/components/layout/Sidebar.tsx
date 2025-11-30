import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useModule, ModuleType, MODULE_CONFIGS } from '../../context/ModuleContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentModule, setCurrentModule, moduleConfig, allModules } = useModule();

  const modules = allModules.map(m => m.code as ModuleType);

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
        {modules.map((module) => {
          const moduleData = allModules.find(m => m.code === module) || MODULE_CONFIGS[module];
          return (
            <button
              key={module}
              onClick={() => handleModuleChange(module)}
              className={`module-button ${currentModule === module ? 'active' : ''}`}
              style={{
                borderLeftColor:
                  currentModule === module ? moduleData.color : 'transparent',
              }}
              title={moduleData.label || t(moduleData.nameKey || '')}
            >
              <i className={moduleData.icon}></i>
              <span>{moduleData.label || t(moduleData.nameKey || '')}</span>
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
              <span>{moduleConfig.label || t(moduleConfig.nameKey)}</span>
            </div>

            {moduleConfig.navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <i className={`${item.icon} mr-2`}></i>
                {/* Use label if available (from database), otherwise use labelKey for translation */}
                {item.label ? item.label : t(item.labelKey)}
              </Link>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
