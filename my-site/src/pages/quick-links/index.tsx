import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import './quick-links.css'
import api from '../../lib/api'

interface QuickLink {
  id: number
  label: string
  url: string
}

const QuickLinks: React.FC = () => {
  const { i18n, t } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [links, setLinks] = useState<QuickLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .get('/quick-links', { params: { lang: i18n.language } })
      .then((res) => setLinks(res.data || []))
      .catch((err) => {
        console.error('Error fetching quick links:', err)
        setLinks([])
      })
      .finally(() => setLoading(false))
  }, [i18n.language])

  return (
    <div className="quick-links-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <h1 className="page-title">{t('quickLinksPage.title', 'Quick Links')}</h1>

      {loading && <div className="text-center py-8">{t('common.loading', 'Loading...')}</div>}

      {!loading && links.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {t('quickLinksPage.empty', 'No quick links found')}
        </div>
      )}

      {!loading && links.length > 0 && (
        <div className="quick-links-grid">
          {links.map((link) => (
            <Card key={link.id} className="quick-link-card shadow-2">
              <h3 className="link-label">{link.label}</h3>
              <p className="link-url">{link.url}</p>
              <Button
                label={t('quickLinksPage.visit', 'Visit')}
                icon={isRtl ? 'pi pi-arrow-left' : 'pi pi-arrow-right'}
                className="p-button-primary w-full mt-3"
                onClick={() => window.open(link.url, '_blank')}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuickLinks
