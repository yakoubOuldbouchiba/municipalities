import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import axiosClient from '../../api/axiosClient';
import './RedisMonitor.css';

interface RedisStats {
  status: string;
  version: string;
  uptime: number;
  connectedClients: number;
  usedMemory: string;
  maxMemory: string;
  keys: number;
  commandsPerSecond: number;
}

const RedisMonitor: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<RedisStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [memoryPercent, setMemoryPercent] = useState(0);

  useEffect(() => {
    fetchRedisStats();
    const interval = setInterval(fetchRedisStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRedisStats = async () => {
    try {
      const response = await axiosClient.get('/api/superadmin/redis/stats');
      const data = response.data;
      setStats(data);
      
      // Calculate memory percentage
      const used = parseFloat(data.usedMemory);
      const max = parseFloat(data.maxMemory);
      if (max > 0) {
        setMemoryPercent((used / max) * 100);
      }
    } catch (error) {
      console.error('Failed to fetch Redis stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>{t('common.loading', 'Loading...')}</div>;
  }

  if (!stats) {
    return <div>{t('common.error', 'Error loading Redis stats')}</div>;
  }

  const statusSeverity = stats.status === 'connected' ? 'success' : 'danger';

  return (
    <div className="redis-monitor">
      <div className="redis-stats-grid">
        <Card className="redis-stat-card">
          <div className="stat-header">
            <h5>{t('superadmin.status', 'Status')}</h5>
            <Tag value={stats.status} severity={statusSeverity} />
          </div>
        </Card>

        <Card className="redis-stat-card">
          <div className="stat-header">
            <h5>{t('superadmin.version', 'Version')}</h5>
            <p className="stat-value">{stats.version}</p>
          </div>
        </Card>

        <Card className="redis-stat-card">
          <div className="stat-header">
            <h5>{t('superadmin.uptime', 'Uptime')}</h5>
            <p className="stat-value">{Math.floor(stats.uptime / 3600)}h {Math.floor((stats.uptime % 3600) / 60)}m</p>
          </div>
        </Card>

        <Card className="redis-stat-card">
          <div className="stat-header">
            <h5>{t('superadmin.connectedClients', 'Connected Clients')}</h5>
            <p className="stat-value">{stats.connectedClients}</p>
          </div>
        </Card>

        <Card className="redis-stat-card">
          <div className="stat-header">
            <h5>{t('superadmin.keys', 'Keys')}</h5>
            <p className="stat-value">{stats.keys}</p>
          </div>
        </Card>

        <Card className="redis-stat-card">
          <div className="stat-header">
            <h5>{t('superadmin.commandsPerSecond', 'Commands/sec')}</h5>
            <p className="stat-value">{stats.commandsPerSecond}</p>
          </div>
        </Card>
      </div>

      <Card className="memory-card">
        <h5>{t('superadmin.memoryUsage', 'Memory Usage')}</h5>
        <div className="memory-info">
          <span>{stats.usedMemory} / {stats.maxMemory}</span>
          <span className="memory-percent">{memoryPercent.toFixed(1)}%</span>
        </div>
        <ProgressBar value={memoryPercent} style={{ height: '2rem' }} />
      </Card>
    </div>
  );
};

export default RedisMonitor;
