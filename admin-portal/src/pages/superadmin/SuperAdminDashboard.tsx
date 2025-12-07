import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

import './SuperAdminDashboard.css';

interface Tool {
  id: number;
  code: string;
  label: Record<string, string>;
  description: Record<string, string>;
  icon: string;
  url: string;
  color: string;
  order: number;
}

const SuperAdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tools', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          setTools(data.data);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching tools:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tools');
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const getToolLabel = (tool: Tool): string => {
    return tool.label[i18n.language] || tool.label['en'] || tool.code;
  };

  const getToolDescription = (tool: Tool): string => {
    return tool.description[i18n.language] || tool.description['en'] || '';
  };

  if (loading) {
    return (
      <div className="superadmin-dashboard loading-container">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="superadmin-dashboard error-container">
        <div className="dashboard-header">
          <h1>{t('superadmin.dashboard', 'Super Admin Dashboard')}</h1>
        </div>
        <Card className="error-card">
          <p className="error-message">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="superadmin-dashboard">
      <div className="dashboard-header">
        <h1>{t('superadmin.dashboard', 'Super Admin Dashboard')}</h1>
        <p>{t('superadmin.description', 'Access monitoring and management tools')}</p>
      </div>

      <div className="tools-grid">
        {tools.length > 0 ? (
          tools.map((tool) => (
            <Card key={tool.id} className="tool-card">
              <div className="tool-header" style={{ borderTopColor: tool.color }}>
                <i className={`${tool.icon} tool-icon`}></i>
                <h3>{getToolLabel(tool)}</h3>
              </div>
              <p className="tool-description">{getToolDescription(tool)}</p>
              <div className="tool-actions">
                <Button
                  label="Open"
                  icon="pi pi-external-link"
                  className="p-button-sm"
                  onClick={() => window.open(tool.url, '_blank')}
                />
              </div>
            </Card>
          ))
        ) : (
          <Card className="no-tools-card">
            <p>{t('superadmin.noTools', 'No tools available')}</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
