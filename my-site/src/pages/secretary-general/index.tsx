import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import PersonWord from '../../components/person-word/PersonWord'
import PersonHistory from '../../components/person-history/PersonHistory'

const SecretaryGeneral: React.FC = () => {
  const { i18n, t } = useTranslation()
  const [current, setCurrent] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    api
      .get('/persons', { params: { type: 'secretary_general', lang: i18n.language } })
      .then(res => {
        const data = res.data
        setCurrent(data.find((p: any) => p.is_current))
        setHistory(data.filter((p: any) => !p.is_current))
      })
      .catch(console.error)
  }, [i18n.language])

  if (!current) return <p>{t('loading')}</p>

  return (
    <div className="p-6 space-y-6">
      <PersonWord
        name={current.name}
        image={current.image_url}
        message={current.message}
        title={t('secretary_general_page.word_title')}
      />
      <PersonHistory
        title={t('secretary_general_page.history_title')}
        history={history.map(h => ({
          name: h.name,
          image: h.image_url,
          period: h.period ?? '',
          achievements: h.achievements,
        }))}
      />
    </div>
  )
}

export default SecretaryGeneral
