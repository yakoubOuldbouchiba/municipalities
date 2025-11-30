import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import LangSwitcher from '../../components/LangSwitcher';
import './LoginPage.css'; // Reuse LoginPage styling for consistency

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await axiosClient.post('/forgot-password', { email });
      setMessage(t('forgotPassword.resetLinkSent'));
    } catch {
      setError(t('forgotPassword.failedToSend'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <h2 className="login-title">{t('forgotPassword.title')}</h2>

        <div className="p-field">
          <label htmlFor="email">{t('forgotPassword.email')}</label>
          <InputText
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('forgotPassword.placeholderEmail')}
            className="p-inputtext-sm w-full"
          />
        </div>

        {message && <p className="error-text success">{message}</p>}
        {error && <p className="error-text">{error}</p>}

        <Button
          label={loading ? t('forgotPassword.sending') : t('forgotPassword.sendLink')}
          onClick={handleSubmit}
          loading={loading}
          className="w-full p-button-primary mb-3"
        />

        <div className="login-links">
          <Button
            label={t('forgotPassword.backToLogin')}
            link
            className="p-button-text"
            onClick={() => navigate('/login')}
          />
        </div>
      </Card>

      <div className="login-footer mt-4">
        <LangSwitcher />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
