import React, { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import PageLayout from '../../components/layout/PageLayout'
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
    <PageLayout>
      <div
        className="papers-page"
        style={{ direction: isRtl ? 'rtl' : 'ltr' }}
      >
        <div className="papers-grid">
          {papers.map(section => (
            <Card key={section.id} className="papers-card">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <i className="pi pi-file-pdf" style={{ fontSize: '1.5rem', color: '#dc2626', marginRight: '0.75rem' }}></i>
                <h3 style={{ margin: 0, color: '#1f2937' }}>{section.title}</h3>
              </div>
              <p style={{ color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.6' }}>{section.description}</p>
              <Button
                label={t('papers.viewDetails')}
                icon={isRtl ? 'pi pi-arrow-left' : 'pi pi-arrow-right'}
                onClick={() => navigate(`/papers/${section.slug}`)}
                style={{ width: '100%' }}
              />
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

export default PapersPage
