import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const tools = [
    {
      title: 'phpMyAdmin',
      icon: 'pi pi-database',
      description: 'Database management tool',
      url: 'http://localhost:8080',
      color: '#3B82F6',
    },
    {
      title: 'Grafana',
      icon: 'pi pi-chart-line',
      description: 'System monitoring and visualization',
      url: 'http://localhost:3001',
      color: '#F59E0B',
    },
    {
      title: 'Prometheus',
      icon: 'pi pi-server',
      description: 'Metrics collection and querying',
      url: 'http://localhost:9090',
      color: '#EC4899',
    },
    {
      title: 'Redis Commander',
      icon: 'pi pi-circle',
      description: 'Redis cache management',
      url: 'http://localhost:8001',
      color: '#EF4444',
    },
  ];

  return (
    <div className="superadmin-dashboard">
      <div className="dashboard-header">
        <h1>{t('superadmin.dashboard', 'Super Admin Dashboard')}</h1>
        <p>{t('superadmin.description', 'Access monitoring and management tools')}</p>
      </div>

      <div className="tools-grid">
        {tools.map((tool, index) => (
          <Card key={index} className="tool-card">
            <div className="tool-header" style={{ borderTopColor: tool.color }}>
              <i className={`${tool.icon} tool-icon`}></i>
              <h3>{tool.title}</h3>
            </div>
            <p className="tool-description">{tool.description}</p>
            <div className="tool-actions">
              <Button
                label="Open"
                icon="pi pi-external-link"
                className="p-button-sm"
                onClick={() => window.open(tool.url, '_blank')}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
