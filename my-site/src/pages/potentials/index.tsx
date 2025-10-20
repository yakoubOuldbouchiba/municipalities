import React from 'react'
import './potentials.css'
import { useTranslation } from 'react-i18next'

interface Section {
  id: number
  title: string
  description: string
}

const Potentials: React.FC = () => {
  const { t } = useTranslation()

  const sections: Section[] = [
    {
      id: 1,
      title: t('potentialsPage.tourism.title'),
      description: t('potentialsPage.tourism.description'),
    },
    {
      id: 2,
      title: t('potentialsPage.agriculture.title'),
      description: t('potentialsPage.agriculture.description'),
    },
    {
      id: 3,
      title: t('potentialsPage.urban.title'),
      description: t('potentialsPage.urban.description'),
    },
    {
      id: 4,
      title: t('potentialsPage.education.title'),
      description: t('potentialsPage.education.description'),
    },
    {
      id: 5,
      title: t('potentialsPage.environment.title'),
      description: t('potentialsPage.environment.description'),
    },
  ]

  return (
    <div className="potentials-page">
      <h1 className="page-title">{t('potentialsPage.title')}</h1>
      <div className="sections-container">
        {sections.map((section) => (
          <div key={section.id} className="potential-section">
            <h2 className="section-title">{section.title}</h2>
            <p className="section-desc">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Potentials
