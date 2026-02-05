import React, { useEffect, useState } from 'react'
import './potentials.css'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import PageLayout from '../../components/layout/PageLayout'

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
    api
      .get('/potentials', { params: { lang: i18n.language } })
      .then(res => setSections(res.data))
      .catch(err => console.error('Error fetching potentials:', err))
  }, [i18n.language])

  return (
    <PageLayout>
      <div className="potentials-page">
        <div className="sections-container">
          {sections.map((section) => (
            <div key={section.id} className="potential-section">
              <h2 className="section-title">{section.title}</h2>
              <p className="section-desc">{section.description}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

export default Potentials
