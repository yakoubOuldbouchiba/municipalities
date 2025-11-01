import React, { useEffect, useState } from 'react'
import './potentials.css'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

interface Section {
  id: number
  slug: string
  title: string
  description: string
}

const Potentials: React.FC = () => {
  const { i18n, t } = useTranslation()
  const [sections, setSections] = useState<Section[]>([])

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/potentials?lang=${i18n.language}`)
      .then(res => setSections(res.data))
      .catch(err => console.error('Error fetching potentials:', err))
  }, [i18n.language])

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
