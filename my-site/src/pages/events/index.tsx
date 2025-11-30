import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './events.css'
import api from '../../lib/api'

interface Event {
  id: number
  status: string
  date: string
  description: string
  icon: string
  color: string
}

const Events: React.FC = () => {
  const { i18n, t } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .get('/events', { params: { lang: i18n.language } })
      .then((res) => setEvents(res.data || []))
      .catch((err) => {
        console.error('Error fetching events:', err)
        setEvents([])
      })
      .finally(() => setLoading(false))
  }, [i18n.language])

  return (
    <div className="events-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <h1 className="page-title">{t('eventsPage.title', 'Events')}</h1>
      
      {loading && <div className="text-center py-8">{t('common.loading', 'Loading...')}</div>}
      
      {!loading && events.length === 0 && (
        <div className="text-center py-8 text-gray-500">{t('eventsPage.empty', 'No events found')}</div>
      )}

      {!loading && events.length > 0 && (
        <div className="events-timeline">
          {events.map((event, index) => (
            <div key={event.id} className="event-item">
              <div className="event-marker" style={{ backgroundColor: event.color }}>
                <i className={event.icon}></i>
              </div>
              <div className="event-content">
                <div className="event-date">{event.date}</div>
                <h3 className="event-status">{event.status}</h3>
                <p className="event-description">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Events
