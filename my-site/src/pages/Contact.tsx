// src/pages/Contact.tsx
import React from 'react'
import { useTranslation } from 'react-i18next'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

const Contact: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div style={{ maxWidth:700 }}>
      <h2>{t('navigation.contact')}</h2>
      <div className="p-fluid">
        <label>{t('common.name')}</label>
        <InputText />
        <label>{t('common.email')}</label>
        <InputText />
        <label>{t('common.message')}</label>
        <textarea className="p-inputtext p-component" rows={5} />
        <div style={{ marginTop:12 }}>
          <Button label={t('common.submit')} />
        </div>
      </div>
    </div>
  )
}

export default Contact
