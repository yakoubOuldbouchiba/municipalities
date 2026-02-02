import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from 'primereact/card'
import QRCode from 'react-qr-code'
import api from '../../../lib/api'
import { useTranslation } from 'react-i18next'
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

  if (loading) return <p>Loading...</p>
  if (!paper) return <p className="text-center">Paper not found.</p>

  const title = paper.title[currentLang] || paper.title['en']
  const description = paper.description[currentLang] || paper.description['en']

  return (
    <div className="paper-details p-6">
      <Card title={title} className="shadow-3">
        <p>{description}</p>
        <div className="qr-container">
          <p>Share this procedure:</p>
          <QRCode value={currentUrl} size={128} />
        </div>
      </Card>
    </div>
  )
}

export default PaperDetails
