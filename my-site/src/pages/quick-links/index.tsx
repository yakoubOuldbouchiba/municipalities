import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import './quick-links.css'
import api from '../../lib/api'
import PageLayout from '../../components/layout/PageLayout'

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

  if (loading) {
    return (
      <PageLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          <ProgressSpinner />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="quick-links-page" dir={isRtl ? 'rtl' : 'ltr'}>
        {links.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            {t('quickLinksPage.empty', 'No quick links found')}
          </div>
        )}

        {links.length > 0 && (
          <div className="quick-links-grid">
            {links.map((link) => (
              <Card key={link.id} className="quick-link-card">
                <h3 className="link-label">{link.label}</h3>
                <p className="link-url">{link.url}</p>
                <Button
                  label={t('quickLinksPage.visit', 'Visit')}
                  icon={isRtl ? 'pi pi-arrow-left' : 'pi pi-arrow-right'}
                  onClick={() => window.open(link.url, '_blank')}
                  style={{ width: '100%' }}
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default QuickLinks
