import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const { t } = useTranslation();

  const menuItems = [
    { label: t('sidebar.dashboard', 'Dashboard'), icon: 'pi pi-home', path: '/' },
    { label: t('sidebar.ads', 'Advertisements'), icon: 'pi pi-bullhorn', path: '/ads' },
    { label: t('sidebar.events', 'Events'), icon: 'pi pi-calendar', path: '/events' },
    { label: t('sidebar.quickLinks', 'Quick Links'), icon: 'pi pi-link', path: '/quick-links' },
    { label: t('sidebar.importantNumbers', 'Important Numbers'), icon: 'pi pi-phone', path: '/important-numbers' },
    { label: t('sidebar.potentials', 'Potentials'), icon: 'pi pi-lightbulb', path: '/potentials' },
  ];

  return (
    <aside className="sidebar">
  <h2 className="sidebar-title">{t('sidebar.title', 'Admin Panel')}</h2>
      <nav className="sidebar-menu">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <i className={`${item.icon} mr-2`}></i>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
