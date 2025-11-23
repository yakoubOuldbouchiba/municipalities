import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient, { fetchCsrf } from '../api/axiosClient';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import './LoginPage.css';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../components/LangSwitcher';

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in (token in localStorage), redirect to home
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
  // Ensure Sanctum CSRF cookie is set on the API root (not under /api)
  await fetchCsrf();
      const res = await axiosClient.post('/login', { email, password });
      // Save token
      localStorage.setItem('token', res.data.token);

      // Persist user info for UI (Header) if available in the response.
      // The backend might return user at res.data.user or res.data.data.user,
      // or not at all. Try common locations first, otherwise request /user.
      try {
        const maybeUser = res.data?.user || res.data?.data?.user || null;
        if (maybeUser && typeof maybeUser === 'object') {
          localStorage.setItem('user', JSON.stringify(maybeUser));
        } else {
          // Try fetching the authenticated user's profile from API
          const me = await axiosClient.get('/user');
          if (me?.data) {
            localStorage.setItem('user', JSON.stringify(me.data));
          }
        }
      } catch (userErr) {
        // If fetching user fails, log but don't block navigation.
        // Header will simply show no name.
        console.warn('Could not persist user after login', userErr);
      }
      // If user was redirected here, route back to original location if present
  const from = (location.state as any)?.from?.pathname || '/';
  navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login failed', err);
      setError(t('loginPage.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <h2 className="login-title">{t('loginPage.title')}</h2>
        <Divider />

        {error && <p className="error-text">{error}</p>}

        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="email">{t('loginPage.email')}</label>
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('loginPage.placeholderEmail')}
              className="p-inputtext-sm w-full"
            />
          </div>

          <div className="p-field">
            <label htmlFor="password">{t('loginPage.password')}</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
              placeholder={t('loginPage.placeholderPassword')}
              className="w-full p-inputtext-sm"
            />
          </div>

          <Button
            label={loading ? t('loginPage.loggingIn') : t('loginPage.login')}
            onClick={handleLogin}
            loading={loading}
            className="w-full p-button-primary mt-3"
          />
        </div>

        <div className="login-links mt-3">
          <Button
            label={t('loginPage.forgotPassword')}
            link
            className="p-button-text"
            onClick={() => navigate('/forgot-password')}
          />
          <Button
            label={t('loginPage.register')}
            link
            className="p-button-text"
            onClick={() => navigate('/register')}
          />
        </div>
      </Card>

      <div className="login-footer">
        <LangSwitcher />
      </div>
    </div>
  );
};

export default LoginPage;
