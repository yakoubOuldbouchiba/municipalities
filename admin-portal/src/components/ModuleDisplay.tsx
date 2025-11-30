import React from 'react';
import { useTranslation } from 'react-i18next';
import { useModule, MODULE_CONFIGS, ModuleType } from '../context/ModuleContext';
import { Card } from 'primereact/card';
import './ModuleDisplay.css';

const ModuleDisplay: React.FC = () => {
  const { t } = useTranslation();
  const { currentModule, setCurrentModule, moduleConfig, allModules, loading } = useModule();

  const modules = allModules.map(m => m.code as ModuleType);

  const handleModuleChange = (module: ModuleType) => {
    setCurrentModule(module);
  };

  // Get module from database or fallback to static config
  const getModuleConfig = (moduleCode: string) => {
    const dbModule = allModules.find((m) => m.code === moduleCode);
    if (dbModule && dbModule.label) {
      return dbModule;
    }
    return MODULE_CONFIGS[moduleCode as ModuleType];
  };

  // Handle loading state
  if (loading || !moduleConfig || modules.length === 0) {
    return (
      <div className="module-display">
        <div className="module-header">
          <h1>{t('header.title')}</h1>
          <p className="module-description">{t('modules.selectModule')}</p>
        </div>
        <div className="loading">{t('common.loading', 'Loading modules...')}</div>
      </div>
    );
  }

  return (
    <div className="module-display">
      <div className="module-header">
        <h1>{t('header.title')}</h1>
        <p className="module-description">{t('modules.selectModule')}</p>
      </div>

      <div className="modules-grid">
        {modules.map((module) => {
          const config = getModuleConfig(module);
          if (!config) return null; // Skip if config not found
          const isActive = currentModule === module;

          return (
            <Card
              key={module}
              className={`module-card ${isActive ? 'active' : ''}`}
              onClick={() => handleModuleChange(module)}
            >
              <div className="card-header" style={{ borderLeftColor: config.color }}>
                <div className="card-icon" style={{ color: config.color }}>
                  <i className={config.icon}></i>
                </div>
                <h3>{config.label || t(config.nameKey)}</h3>
              </div>

              <div className="card-content">
                <p className="module-desc">{t(config.descriptionKey)}</p>
                <p className="item-count">{config.navItems.length} {t('nav.items', 'items')}</p>
                <div className="nav-items">
                  {config.navItems.map((item: any) => (
                    <span key={item.path} className="nav-badge">
                      <i className={item.icon}></i> {item.label ? item.label : t(item.labelKey)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card-footer">
                <button
                  className={`select-btn ${isActive ? 'active' : ''}`}
                  style={{ backgroundColor: isActive ? config.color : '#e5e7eb' }}
                >
                  {isActive ? '✓ ' + t('modules.switchModule') : t('modules.selectModule')}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Current Module Details */}
      {moduleConfig && (
      <div className="current-module-section">
        <div className="section-header">
          <div className="header-content">
            <div className="icon" style={{ color: moduleConfig.color }}>
              <i className={moduleConfig.icon}></i>
            </div>
            <div>
              <h2>{moduleConfig.label || t(moduleConfig.nameKey)}</h2>
              <p className="module-description">{t(moduleConfig.descriptionKey)}</p>
              <p className="color-indicator" style={{ color: moduleConfig.color }}>
                ● {t('modules.currentModule')}
              </p>
            </div>
          </div>
        </div>

        <div className="nav-section">
          <h3>{t('nav.items', 'Navigation Items')}</h3>
          <div className="nav-list">
            {moduleConfig.navItems.map((item: any) => (
              <div key={item.path} className="nav-item">
                <div className="item-icon">
                  <i className={item.icon}></i>
                </div>
                <div className="item-info">
                  <span className="item-label">{item.label ? item.label : t(item.labelKey)}</span>
                  <span className="item-path">{item.path}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default ModuleDisplay;
