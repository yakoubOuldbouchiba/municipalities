import React, { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import './papers-page.css'

interface Paper {
  id: number
  slug: string
  title: string
  description: string
}

const PapersPage: React.FC = () => {
  const navigate = useNavigate()
  const { i18n, t } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [papers, setPapers] = useState<Paper[]>([])

  useEffect(() => {
    api
      .get('/papers', { params: { lang: i18n.language } })
      .then(res => setPapers(res.data))
      .catch(console.error)
  }, [i18n.language])

  return (
    <div
      className="papers-page p-6"
      style={{ direction: isRtl ? 'rtl' : 'ltr', textAlign: isRtl ? 'right' : 'left' }}
    >
      <h2 className="papers-title">{t('papers.title')}</h2>
      <div className="papers-grid">
        {papers.map(section => (
          <Card key={section.id} className="papers-card shadow-3">
            <h3>{section.title}</h3>
            <p>{section.description}</p>
            <Button
              label={t('papers.viewDetails')}
              icon={isRtl ? 'pi pi-arrow-left' : 'pi pi-arrow-right'}
              className="p-button-success"
              onClick={() => navigate(`/papers/${section.slug}`)}
            />
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PapersPage
