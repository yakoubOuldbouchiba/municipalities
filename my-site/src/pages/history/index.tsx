import React, { useEffect, useState } from 'react'
import { Timeline } from 'primereact/timeline'
import { Card } from 'primereact/card'
import { useTranslation } from 'react-i18next'
import { ProgressSpinner } from 'primereact/progressspinner'

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
          `http://127.0.0.1:8000/api/events?lang=${i18n.language}`
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
      style={{ backgroundColor: item.color }}
    >
      <i className={`${item.icon} text-xl`}></i>
    </span>
  )

  const customizedContent = (item: EventItem) => (
    <Card title={item.status} subTitle={item.date} className="border-green-500">
      <p className="m-0 text-gray-700">{item.description}</p>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center h-20rem">
        <ProgressSpinner />
      </div>
    )
  }

  return (
    <div className="p-6 page-container">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        {t('history', 'History of Zemmouri')}
      </h1>

      {events.length > 0 ? (
        <Timeline
          value={events}
          align="alternate"
          marker={customizedMarker}
          content={customizedContent}
        />
      ) : (
        <p className="text-center text-gray-600">{t('noEvents', 'No events found')}</p>
      )}
    </div>
  )
}

export default History
