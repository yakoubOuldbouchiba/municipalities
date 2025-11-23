import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../LangSwitcher';
import './Header.css';

const Header: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    const sanitize = (v: any) => {
      if (v == null) return '';
      if (typeof v !== 'string') return '';
      const s = v.trim();
      if (!s) return '';
      const lower = s.toLowerCase();
      if (lower === 'null' || lower === 'undefined') return '';
      return s;
    };

    // Try a few common localStorage keys for user info. If your app exposes
    // an AuthContext or different storage keys, adapt accordingly.
    try {
      const raw =
        localStorage.getItem('user') ||
        localStorage.getItem('auth_user') ||
        localStorage.getItem('profile') ||
        '';

      if (raw) {
        const data = JSON.parse(raw);
        // data may be an object or a plain string. Prefer object fields.
        if (data && typeof data === 'object') {
          const name = sanitize(data?.name) || sanitize(data?.username) || sanitize(data?.fullName);
          setUserName(name);
        } else {
          // parsed value could be a string (or null)
          setUserName(sanitize(data));
        }
        return;
      }

      const altRaw = localStorage.getItem('userName') || localStorage.getItem('username') || '';
      setUserName(sanitize(altRaw));
    } catch (e) {
      // Fallback to a simple username key if parsing fails
      setUserName(sanitize(localStorage.getItem('username')));
    }
  }, []);

  const handleLogout = () => {
    // Clear common auth keys. If your app uses different keys or an auth
    // provider, replace with the appropriate sign-out flow.
    ['token', 'authToken', 'user', 'auth_user', 'profile', 'username', 'userName'].forEach((k) =>
      localStorage.removeItem(k)
    );
    sessionStorage.clear();

    // Redirect to login page (adjust path if your app uses a different route)
    window.location.href = '/login';
  };

  return (
    <header className="admin-header">
      <h2 className="header-title">{t('header.title', 'Dashboard')}</h2>
      <div className="header-actions">
        <div className="header-user">
          <Button icon="pi pi-user" className="p-button-text p-button-rounded" />
          {userName ? <span className="user-name">{userName}</span> : null}
        </div>
        <LangSwitcher />
        <Button
          icon="pi pi-power-off"
          label={t('header.logout', 'Déconnexion')}
          aria-label={t('header.logout', 'Déconnexion')}
          className="p-button-text p-button-rounded logout-button"
          onClick={handleLogout}
        />
      </div>
    </header>
  );
};

export default Header;
