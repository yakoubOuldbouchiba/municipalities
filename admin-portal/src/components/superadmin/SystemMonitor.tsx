import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import axiosClient from '../../api/axiosClient';
import './SystemMonitor.css';

interface SystemInfo {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: number;
  loadAverage: [number, number, number];
  processCount: number;
}

const SystemMonitor: React.FC = () => {
  const { t } = useTranslation();
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemInfo();
    const interval = setInterval(fetchSystemInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const response = await axiosClient.get('/api/superadmin/system/info');
      setSysInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch system info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>{t('common.loading', 'Loading...')}</div>;
  }

  if (!sysInfo) {
    return <div>{t('common.error', 'Error loading system info')}</div>;
  }

  return (
    <div className="system-monitor">
      <div className="monitor-grid">
        <Card className="monitor-card cpu-card">
          <h5>{t('superadmin.cpu', 'CPU Usage')}</h5>
          <p className="monitor-value">{sysInfo.cpuUsage.toFixed(2)}%</p>
          <ProgressBar value={sysInfo.cpuUsage} style={{ height: '1.5rem' }} />
        </Card>

        <Card className="monitor-card memory-card">
          <h5>{t('superadmin.memory', 'Memory Usage')}</h5>
          <p className="monitor-value">{sysInfo.memoryUsage.toFixed(2)}%</p>
          <ProgressBar value={sysInfo.memoryUsage} style={{ height: '1.5rem' }} />
        </Card>

        <Card className="monitor-card disk-card">
          <h5>{t('superadmin.disk', 'Disk Usage')}</h5>
          <p className="monitor-value">{sysInfo.diskUsage.toFixed(2)}%</p>
          <ProgressBar value={sysInfo.diskUsage} style={{ height: '1.5rem' }} />
        </Card>

        <Card className="monitor-card uptime-card">
          <h5>{t('superadmin.uptime', 'Server Uptime')}</h5>
          <p className="monitor-value">{Math.floor(sysInfo.uptime / 86400)}d {Math.floor((sysInfo.uptime % 86400) / 3600)}h</p>
        </Card>

        <Card className="monitor-card load-card">
          <h5>{t('superadmin.loadAverage', 'Load Average')}</h5>
          <p className="monitor-value">
            {sysInfo.loadAverage[0].toFixed(2)} / {sysInfo.loadAverage[1].toFixed(2)} / {sysInfo.loadAverage[2].toFixed(2)}
          </p>
          <p className="load-label">{t('superadmin.1min', '1min')} / {t('superadmin.5min', '5min')} / {t('superadmin.15min', '15min')}</p>
        </Card>

        <Card className="monitor-card process-card">
          <h5>{t('superadmin.processes', 'Processes')}</h5>
          <p className="monitor-value">{sysInfo.processCount}</p>
        </Card>
      </div>
    </div>
  );
};

export default SystemMonitor;
