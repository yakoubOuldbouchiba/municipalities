// src/pages/Contact.tsx
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import PageLayout from '../components/layout/PageLayout'

const Contact: React.FC = () => {
  const { t } = useTranslation()
  const toast = useRef<Toast>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast.current?.show({
        severity: 'warn',
        summary: t('common.warning'),
        detail: t('common.fillAllFields') || 'Please fill all fields',
      })
      return
    }

    // Handle form submission
    console.log('Form submitted:', formData)
    toast.current?.show({
      severity: 'success',
      summary: t('common.success'),
      detail: t('common.messageSent') || 'Message sent successfully',
    })
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <PageLayout>
      <Toast ref={toast} position="top-right" />
      <div style={{ maxWidth: 700 }}>
        <div className="p-fluid">
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="name">{t('common.name')}</label>
            <InputText
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('common.name')}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="email">{t('common.email')}</label>
            <InputText
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('common.email')}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="message">{t('common.message')}</label>
            <textarea
              id="message"
              name="message"
              className="p-inputtext p-component"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t('common.message')}
              style={{ fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          <div>
            <Button
              label={t('common.submit')}
              onClick={handleSubmit}
              icon="pi pi-send"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Contact
