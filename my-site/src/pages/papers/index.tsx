import React from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './papers-page.css'

const PapersPage: React.FC = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const sections = [
    {
      id: 'identity',
      title: t('papers.identity.title'),
      description: t('papers.identity.description'),
    },
    {
      id: 'driving',
      title: t('papers.driving.title'),
      description: t('papers.driving.description'),
    },
    {
      id: 'housing',
      title: t('papers.housing.title'),
      description: t('papers.housing.description'),
    },
    {
      id: 'family',
      title: t('papers.family.title'),
      description: t('papers.family.description'),
    },
  ]

  return (
    <div
      className="papers-page p-6"
      style={{ direction: isRtl ? 'rtl' : 'ltr', textAlign: isRtl ? 'right' : 'left' }}
    >
      <h2 className="papers-title">{t('papers.title')}</h2>
      <div className="papers-grid">
        {sections.map((section) => (
          <Card key={section.id} className="papers-card shadow-3">
            <h3>{section.title}</h3>
            <p>{section.description}</p>
            <Button
              label={t('papers.viewDetails')}
              icon={isRtl ? 'pi pi-arrow-left' : 'pi pi-arrow-right'}
              className="p-button-success"
              onClick={() => navigate(`/papers/${section.id}`)}
            />
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PapersPage
