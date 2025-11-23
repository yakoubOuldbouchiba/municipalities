import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import  './LoginPage.css';
import LangSwitcher from '../components/LangSwitcher';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setMessage('');
    try {
      await axiosClient.get('/sanctum/csrf-cookie');
      await axiosClient.post('/register', form);
      setMessage(t('registerMessages.success'));
    } catch (err: any) {
      setMessage(t('registerMessages.failed'));
    }
  };

  return (
    <div className="login-page">
      <Card className="auth-card">
        <h2 className="auth-title">{t('register.title')}</h2>

        <InputText name="name" placeholder={t('register.placeholderName')} onChange={handleChange} className="w-full mb-2" />
        <InputText name="email" placeholder={t('register.placeholderEmail')} onChange={handleChange} className="w-full mb-2" />
        <Password name="password" placeholder={t('register.placeholderPassword')} onChange={handleChange} feedback={false} className="w-full mb-2" />
        <Password name="password_confirmation" placeholder={t('register.placeholderPasswordConfirmation')}  onChange={handleChange} feedback={false} className="w-full mb-3" />

        {message && <p className="message">{message}</p>}
        <Button label={t('register.register')} onClick={handleRegister} className="w-full" />
      </Card>
      <div className="login-footer">
        <LangSwitcher />
      </div>
    </div>
  );
};

export default RegisterPage;
