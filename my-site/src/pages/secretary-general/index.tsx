import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ProgressSpinner } from 'primereact/progressspinner'
import api from '../../lib/api'
import PersonWord from '../../components/person-word/PersonWord'
import PersonHistory from '../../components/person-history/PersonHistory'
import PageLayout from '../../components/layout/PageLayout'

const SecretaryGeneral: React.FC = () => {
  const { i18n, t } = useTranslation()
  const [current, setCurrent] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .get('/persons', { params: { type: 'secretary_general', lang: i18n.language } })
      .then(res => {
        const data = res.data
        setCurrent(data.find((p: any) => p.is_current))
        setHistory(data.filter((p: any) => !p.is_current))
      })
      .catch(console.error)
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

  if (!current) {
    return (
      <PageLayout>
        <p style={{ textAlign: 'center', color: '#64748b' }}>{t('loading')}</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <PersonWord
          name={current.name}
          image={current.image_url}
          message={current.message}
          title={t('secretary_general_page.word_title')}
        />
        {history.length > 0 && (
          <PersonHistory
            title={t('secretary_general_page.history_title')}
            history={history.map(h => ({
              name: h.name,
              image: h.image_url,
              period: h.period ?? '',
              achievements: h.achievements,
            }))}
          />
        )}
      </div>
    </PageLayout>
  )
}

export default SecretaryGeneral
