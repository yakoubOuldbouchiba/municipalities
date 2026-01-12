import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Divider } from 'primereact/divider';
import { useRef } from 'react';
import api from '../../lib/api';

const CitizenClaimForm: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    nin: '',
    address: '',
    content: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const toastRef = useRef<Toast>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e: any) => {
    const newFiles = Array.from(e.files) as File[];
    if (files.length + newFiles.length > 3) {
      toastRef.current?.show({
        severity: 'error',
        summary: t('common.error'),
        detail: t('claims.fileError'),
      });
      return;
    }
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      files.forEach((file, index) => {
        formDataToSend.append(`files[${index}]`, file);
      });

      const response = await api.post('/claims/citizen', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const refNum = response.data.reference_number;
        setReferenceNumber(refNum);
        toastRef.current?.show({
          severity: 'success',
          summary: t('common.success'),
          detail: t('claims.submitted', { refNumber: refNum }),
          life: 5000,
        });

        // Reset form
        setFormData({
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          nin: '',
          address: '',
          content: '',
        });
        setFiles([]);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || t('claims.submissionFailed');
      toastRef.current?.show({
        severity: 'error',
        summary: t('common.error'),
        detail: errorMsg,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toastRef} />
      {referenceNumber && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724',
        }}>
          <strong>✓ {t('claims.referenceNumber')}: {referenceNumber}</strong>
          <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>{t('claims.saveNumber')}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-fluid">
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="firstname">{t('claims.firstName')} *</label>
          <InputText
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="lastname">{t('claims.lastName')} *</label>
          <InputText
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">{t('claims.email')} *</label>
          <InputText
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="phone">{t('claims.phone')} *</label>
          <InputText
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="nin">{t('claims.nin')} *</label>
          <InputText
            id="nin"
            name="nin"
            value={formData.nin}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="address">{t('claims.address')} *</label>
          <InputText
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <Divider />

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="content">{t('claims.content')} *</label>
          <InputTextarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={6}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>{t('claims.files')}</label>
          <FileUpload
            name="files[]"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            customUpload
            uploadHandler={(e) => handleFileSelect(e)}
            auto={false}
            chooseLabel={t('claims.chooseFiles')}
            uploadLabel={t('claims.upload')}
            cancelLabel={t('common.cancel')}
          />
          {files.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4>{t('claims.files')}</h4>
              <ul>
                {files.map((file, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    {file.name}
                    <Button
                      type="button"
                      icon="pi pi-times"
                      className="p-button-rounded p-button-danger p-button-sm"
                      onClick={() => removeFile(index)}
                      style={{ marginLeft: '1rem' }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Button
          type="submit"
          label={t('claims.submit')}
          loading={loading}
          style={{ marginTop: '1rem' }}
        />
      </form>
    </>
  );
};

export default CitizenClaimForm;
