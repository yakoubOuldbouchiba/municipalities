import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from 'primereact/card'
import { ProgressSpinner } from 'primereact/progressspinner'
import QRCode from 'react-qr-code'
import api from '../../../lib/api'
import { useTranslation } from 'react-i18next'
import PageLayout from '../../../components/layout/PageLayout'
import './paper-details.css'

interface Paper {
  slug: string
  title: { [key: string]: string }
  description: { [key: string]: string }
}

const PaperDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [paper, setPaper] = useState<Paper | null>(null)
  const [loading, setLoading] = useState(true)
  const { i18n } = useTranslation()
  const currentLang = i18n.language
  const currentUrl = window.location.href

  useEffect(() => {
    if (!id) return
    api
      .get(`/papers/slug/${id}`)
      .then((res) => setPaper(res.data))
      .catch(() => setPaper(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <PageLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          <ProgressSpinner />
        </div>
      </PageLayout>
    )
  }

  if (!paper) {
    return (
      <PageLayout>
        <p style={{ textAlign: 'center', color: '#64748b' }}>Paper not found.</p>
      </PageLayout>
    )
  }

  const title = paper.title[currentLang] || paper.title['en']
  const description = paper.description[currentLang] || paper.description['en']

  return (
    <PageLayout>
      <div className="paper-details">
        <Card title={title} className="paper-detail-card">
          <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '2rem' }}>{description}</p>
          <div className="qr-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.95rem', fontWeight: '500', color: '#1f2937' }}>Share this procedure:</p>
            <QRCode value={currentUrl} size={128} />
          </div>
        </Card>
      </div>
    </PageLayout>
  )
}

export default PaperDetails
