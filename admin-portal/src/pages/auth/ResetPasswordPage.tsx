import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import './Auth.css';
import { useTranslation } from 'react-i18next';

const ResetPasswordPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const email = query.get('email');

  const [form, setForm] = useState({
    password: '',
    password_confirmation: '',
  });
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      await axiosClient.post('/reset-password', { ...form, token, email });
  setMessage(t('resetPassword.success'));
    } catch {
  setMessage(t('resetPassword.failed'));
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
  <h2 className="auth-title">{t('resetPassword.title')}</h2>
  <Password placeholder={t('resetPassword.newPassword')} onChange={(e) => setForm({ ...form, password: e.target.value })} feedback={false} className="w-full mb-2" />
  <Password placeholder={t('resetPassword.confirmPassword')} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} feedback={false} className="w-full mb-3" />
        {message && <p className="message">{message}</p>}
  <Button label={t('resetPassword.submit')} onClick={handleReset} className="w-full" />
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
