import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import  './LoginPage.css';
import LangSwitcher from '../../components/LangSwitcher';
import { useTranslation } from 'react-i18next';

// Wrapper component for consistent field styling
const FormField = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col h-full">
    <div className="flex-1 flex items-start">
      {children}
    </div>
  </div>
);

// Faded input class constant
const fadedInputClass = "bg-gray-50 border-gray-300 text-gray-700";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    firstname: { en: '', fr: '', ar: '' },
    lastname: { en: '', fr: '', ar: '' },
    email: '',
    password: '',
    password_confirmation: '',
    birthdate: '',
    birthplace: { en: '', fr: '', ar: '' },
    nin: '',
    gender: '',
    phone: '',
    iphone: '',
    address: { en: { city: '', country: '' }, fr: { city: '', country: '' }, ar: { city: '', country: '' } },
  });
  const [message, setMessage] = useState('');
  const languages = [
    { label: 'English', code: 'en' },
    { label: 'Français', code: 'fr' },
    { label: 'العربية', code: 'ar' }
  ];
  const genderOptions = [
    { label: t('register.male', 'Male'), value: 'male' },
    { label: t('register.female', 'Female'), value: 'female' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMultilingualChange = (field: string, lang: string, value: string) => {
    setForm({
      ...form,
      [field]: {
        ...(form[field as keyof typeof form] as Record<string, any>),
        [lang]: value
      }
    });
  };

  const handleAddressChange = (lang: string, field: 'city' | 'country', value: string) => {
    const currentAddress = form.address[lang as 'en' | 'fr' | 'ar'] || { city: '', country: '' };
    setForm({
      ...form,
      address: {
        ...form.address,
        [lang]: {
          ...currentAddress,
          [field]: value
        }
      }
    });
  };

  const handleRegister = async () => {
    setMessage('');
    try {
      // Get CSRF cookie from web endpoint (without /api prefix)
      const baseUrl = axiosClient.defaults.baseURL?.replace('/api', '') || 'http://127.0.0.1:8000';
      await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });
      
      // Register with CSRF protection
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

        <div className="space-y-6">
          {/* Basic Information Section */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">{t('register.basicInfo', 'Basic Information')}</h3>
            <div className="grid grid-cols-2 gap-6">
              <FormField>
                <InputText name="name" value={form.name} onChange={handleChange} placeholder={t('register.placeholderName')} className={`w-full ${fadedInputClass}`} />
              </FormField>
              <FormField>
                <InputText name="email" value={form.email} onChange={handleChange} placeholder={t('register.placeholderEmail')} className={`w-full ${fadedInputClass}`} />
              </FormField>
            </div>
          </div>

          {/* Multilingual Names Section */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">{t('register.names', 'Names')}</h3>
            <div className="grid grid-cols-3 gap-6">
              {languages.map(lang => (
                <div key={lang.code} className="border-l-2 border-blue-300 pl-4">
                  <p className="text-xs font-semibold text-blue-600 mb-4">{lang.label}</p>
                  <div className="space-y-4">
                    <FormField>
                      <InputText
                        value={(form.firstname as Record<string, string>)[lang.code] || ''}
                        onChange={(e) => handleMultilingualChange('firstname', lang.code, e.target.value)}
                        placeholder={`${t('register.firstName', 'First Name')}`}
                        className={`w-full ${fadedInputClass}`}
                      />
                    </FormField>
                    <FormField>
                      <InputText
                        value={(form.lastname as Record<string, string>)[lang.code] || ''}
                        onChange={(e) => handleMultilingualChange('lastname', lang.code, e.target.value)}
                        placeholder={`${t('register.lastName', 'Last Name')}`}
                        className={`w-full ${fadedInputClass}`}
                      />
                    </FormField>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">{t('register.personalDetails', 'Personal Details')}</h3>
            <div className="grid grid-cols-4 gap-6">
              <FormField>
                <InputText name="nin" value={form.nin} onChange={handleChange} placeholder={t('register.nin', 'NIN')} className={`w-full ${fadedInputClass}`} />
              </FormField>
              <FormField>
                <Dropdown
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.value })}
                  options={genderOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder={t('register.selectGender', 'Select')}
                  className={`w-full ${fadedInputClass}`}
                />
              </FormField>
              <FormField>
                <Calendar
                  value={form.birthdate ? new Date(form.birthdate) : null}
                  onChange={(e) => setForm({ ...form, birthdate: e.value ? e.value.toISOString().split('T')[0] : '' })}
                  dateFormat="yy-mm-dd"
                  placeholder={t('register.placeholderBirthdate', 'Select')}
                  className={`w-full ${fadedInputClass}`}
                />
              </FormField>
              <FormField>
                <InputText name="phone" value={form.phone} onChange={handleChange} placeholder={t('register.phone', 'Phone')} className={`w-full ${fadedInputClass}`} />
              </FormField>
            </div>
          </div>

          {/* Multilingual Birthplace & Contact Section */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">{t('register.location', 'Location & Contact')}</h3>
            <div className="grid grid-cols-4 gap-6">
              {languages.map(lang => (
                <FormField key={lang.code}>
                  <InputText
                    value={(form.birthplace as Record<string, string>)[lang.code] || ''}
                    onChange={(e) => handleMultilingualChange('birthplace', lang.code, e.target.value)}
                    placeholder={`${t('register.birthplace', 'Birthplace')} (${lang.label})`}
                    className={`w-full ${fadedInputClass}`}
                  />
                </FormField>
              ))}
              <FormField>
                <InputText name="iphone" value={form.iphone} onChange={handleChange} placeholder={t('register.iphone', 'iPhone')} className={`w-full ${fadedInputClass}`} />
              </FormField>
            </div>
          </div>

          {/* Multilingual Address Section */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">{t('register.address', 'Address')}</h3>
            {languages.map(lang => {
              const langCode = lang.code as 'en' | 'fr' | 'ar';
              const addressData = form.address[langCode] || { city: '', country: '' };
              return (
                <div key={lang.code} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-4">{lang.label}</p>
                  <div className="grid grid-cols-2 gap-6">
                    <FormField>
                      <InputText
                        value={addressData.city}
                        onChange={(e) => handleAddressChange(lang.code, 'city', e.target.value)}
                        placeholder={t('register.city', 'City')}
                        className={`w-full ${fadedInputClass}`}
                      />
                    </FormField>
                    <FormField>
                      <InputText
                        value={addressData.country}
                        onChange={(e) => handleAddressChange(lang.code, 'country', e.target.value)}
                        placeholder={t('register.country', 'Country')}
                        className={`w-full ${fadedInputClass}`}
                      />
                    </FormField>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Password Section */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">{t('register.security', 'Security')}</h3>
            <div className="grid grid-cols-2 gap-6">
              <FormField>
                <Password name="password" value={form.password} onChange={handleChange} feedback={false} placeholder={t('register.placeholderPassword')} className={`w-full ${fadedInputClass}`} />
              </FormField>
              <FormField>
                <Password name="password_confirmation" value={form.password_confirmation} onChange={handleChange} feedback={false} placeholder={t('register.placeholderPasswordConfirmation')} className={`w-full ${fadedInputClass}`} />
              </FormField>
            </div>
          </div>

          {/* Message and Submit */}
          {message && <p className="message p-3 rounded bg-blue-50 text-blue-700">{message}</p>}
          <div className="pt-4 mt-4 space-y-4">
            <Button label={t('register.register')} onClick={handleRegister} className="w-full" style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '600' }} />
            <p className="text-center text-sm text-gray-600">
              {t('register.haveAccount', 'Already have an account?')}{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                {t('register.loginHere', 'Login here')}
              </Link>
            </p>
          </div>
        </div>
      </Card>
      <div className="login-footer">
        <LangSwitcher />
      </div>
    </div>
  );
};

export default RegisterPage;
