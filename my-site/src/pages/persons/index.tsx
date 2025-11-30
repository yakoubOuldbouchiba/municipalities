import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from 'primereact/card'
import './persons.css'
import api from '../../lib/api'

interface Person {
  id: number
  type: string
  name: string
  message: string | null
  achievements: string | null
  image_url: string | null
  period: string | null
  is_current: boolean
}

const Persons: React.FC = () => {
  const { i18n, t } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .get('/persons', { params: { lang: i18n.language } })
      .then((res) => setPersons(res.data || []))
      .catch((err) => {
        console.error('Error fetching persons:', err)
        setPersons([])
      })
      .finally(() => setLoading(false))
  }, [i18n.language])

  const getTypeLabel = (type: string) => {
    return type === 'mayor' ? t('persons.types.mayor', 'Mayor') : t('persons.types.secretary_general', 'Secretary General')
  }

  const groupedPersons = persons.reduce((acc, person) => {
    if (!acc[person.type]) {
      acc[person.type] = []
    }
    acc[person.type].push(person)
    return acc
  }, {} as Record<string, Person[]>)

  return (
    <div className="persons-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <h1 className="page-title">{t('personsPage.title', 'Leadership')}</h1>

      {loading && <div className="text-center py-8">{t('common.loading', 'Loading...')}</div>}

      {!loading && persons.length === 0 && (
        <div className="text-center py-8 text-gray-500">{t('personsPage.empty', 'No persons found')}</div>
      )}

      {!loading && persons.length > 0 && (
        <div className="persons-sections">
          {Object.entries(groupedPersons).map(([type, typePersons]) => (
            <div key={type} className="persons-section">
              <h2 className="section-title">{getTypeLabel(type)}</h2>
              <div className="persons-grid">
                {typePersons.map((person) => (
                  <Card key={person.id} className="person-card shadow-3">
                    {person.image_url && (
                      <div className="person-image-wrapper">
                        <img src={person.image_url} alt={person.name} className="person-image" />
                      </div>
                    )}
                    <h3 className="person-name">{person.name}</h3>
                    {person.period && <div className="person-period">{person.period}</div>}
                    {person.is_current && <div className="current-badge">{t('personsPage.current', 'Current')}</div>}
                    {person.message && <p className="person-message">{person.message}</p>}
                    {person.achievements && <p className="person-achievements">{person.achievements}</p>}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Persons
