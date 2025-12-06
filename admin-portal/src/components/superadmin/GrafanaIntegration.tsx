import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import './GrafanaIntegration.css';

const GrafanaIntegration: React.FC = () => {
  const { t } = useTranslation();
  const grafanaUrl = process.env.REACT_APP_GRAFANA_URL || 'http://localhost:3000';

  return (
    <div className="grafana-integration">
      <Card className="grafana-info-card">
        <h5>{t('superadmin.grafanaMonitoring', 'Grafana Monitoring')}</h5>
        <p>{t('superadmin.grafanaDescription', 'Open Grafana for advanced monitoring, dashboards, and alert management.')}</p>
        
        <div className="grafana-buttons">
          <Button 
            label={t('superadmin.openGrafana', 'Open Grafana')}
            icon="pi pi-external-link"
            onClick={() => window.open(grafanaUrl, '_blank')}
            className="p-button-success"
          />
          <Button 
            label={t('superadmin.grafanaConfig', 'Configuration')}
            icon="pi pi-cog"
            className="p-button-secondary"
          />
        </div>

        <div className="grafana-info">
          <p><strong>{t('superadmin.url', 'URL')}:</strong> <code>{grafanaUrl}</code></p>
          <p><strong>{t('superadmin.features', 'Features')}:</strong></p>
          <ul>
            <li>{t('superadmin.feature1', 'Real-time dashboards')}</li>
            <li>{t('superadmin.feature2', 'Custom metrics and graphs')}</li>
            <li>{t('superadmin.feature3', 'Alert management')}</li>
            <li>{t('superadmin.feature4', 'Data source integration (Prometheus, etc.)')}</li>
          </ul>
        </div>
      </Card>

      <Card className="prometheus-info-card">
        <h5>{t('superadmin.prometheusMetrics', 'Prometheus Metrics')}</h5>
        <p>{t('superadmin.prometheusDescription', 'View metrics collected by Prometheus for system monitoring.')}</p>
        <Button 
          label={t('superadmin.viewMetrics', 'View Metrics')}
          icon="pi pi-chart-bar"
          onClick={() => window.open('http://localhost:9090', '_blank')}
          className="p-button-info"
        />
      </Card>
    </div>
  );
};

export default GrafanaIntegration;
