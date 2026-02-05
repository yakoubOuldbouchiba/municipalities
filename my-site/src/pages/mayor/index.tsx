import React, { useEffect, useState } from 'react'
import api from '../../lib/api'
import { useTranslation } from 'react-i18next'
import PersonWord from '../../components/person-word/PersonWord'
import PersonHistory from '../../components/person-history/PersonHistory'
import PageLayout from '../../components/layout/PageLayout'
import './mayor.css'

interface Person {
  id: number
  name: string
  image_url: string
  message?: string
  achievements?: string
  period?: string
  is_current: boolean
}

const Mayor: React.FC = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const [currentMayor, setCurrentMayor] = useState<Person | null>(null)
  const [mayorHistory, setMayorHistory] = useState<Person[]>([])

  useEffect(() => {
    api
      .get('/persons', { params: { type: 'mayor', lang: i18n.language } })
      .then((res) => {
        const persons: Person[] = res.data
        const current = persons.find((p) => p.is_current)
        const history = persons.filter((p) => !p.is_current)
        setCurrentMayor(current || null)
        setMayorHistory(history)
      })
      .catch((err) => {
        console.error('Error loading mayor data:', err)
      })
  }, [i18n.language])

  return (
    <PageLayout>
      <div className="mayor-page" dir={isRtl ? 'rtl' : 'ltr'}>
        {currentMayor && (
          <div className="mayor-section">
            <PersonWord
              name={currentMayor.name}
              image={currentMayor.image_url}
              message={currentMayor.message || ''}
              title={t('mayorPage.wordTitle')}
            />
          </div>
        )}

        {mayorHistory.length > 0 && (
          <div className="mayor-section">
            <PersonHistory
              title={t('mayorPage.historyTitle')}
              history={mayorHistory.map((m) => ({
                name: m.name,
                image: m.image_url,
                period: m.period,
                achievements: m.achievements,
              }))}
            />
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default Mayor
