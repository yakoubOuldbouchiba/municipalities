import React, { useEffect, useState } from 'react'
import { Timeline } from 'primereact/timeline'
import { Card } from 'primereact/card'
import { useTranslation } from 'react-i18next'
import { ProgressSpinner } from 'primereact/progressspinner'
import PageLayout from '../../components/layout/PageLayout'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000/api'

interface EventItem {
  id: number
  status: string
  date: string
  description: string
  icon: string
  color: string
}

const History: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${API_BASE}/events?lang=${i18n.language}`
        )
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [i18n.language])

  const customizedMarker = (item: EventItem) => (
    <span
      className="flex w-3rem h-3rem align-items-center justify-content-center text-white border-circle shadow-2"
      style={{ backgroundColor: item.color || '#1a7f37' }}
    >
      <i className={`${item.icon} text-xl`}></i>
    </span>
  )

  const customizedContent = (item: EventItem) => (
    <Card
      title={item.status}
      subTitle={item.date}
      className="timeline-card"
      style={{ borderLeft: '4px solid #1a7f37' }}
    >
      <p style={{ margin: 0, color: '#64748b', lineHeight: '1.6' }}>{item.description}</p>
    </Card>
  )

  if (loading) {
    return (
      <PageLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20rem' }}>
          <ProgressSpinner />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div>
        {events.length > 0 ? (
          <Timeline
            value={events}
            align="alternate"
            marker={customizedMarker}
            content={customizedContent}
          />
        ) : (
          <p style={{ textAlign: 'center', color: '#64748b' }}>{t('noEvents', 'No events found')}</p>
        )}
      </div>
    </PageLayout>
  )
}

export default History
