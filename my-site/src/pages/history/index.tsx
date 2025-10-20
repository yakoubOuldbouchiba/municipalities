
import { Timeline } from 'primereact/timeline'
import { Card } from 'primereact/card'
import { useTranslation } from 'react-i18next'

const History: React.FC = () => {
  const {t} = useTranslation();
  const events = [
    {
      status: 'Foundation',
      date: '18th Century',
      description:
        'Zemmouri was established as a coastal town known for fishing and trade along the Mediterranean Sea.',
      icon: 'pi pi-flag',
      color: '#16a34a',
    },
    {
      status: 'Colonial Era',
      date: '1830 - 1962',
      description:
        'During the French colonization, Zemmouri became a strategic port and saw major urban expansion.',
      icon: 'pi pi-building',
      color: '#16a34a',
    },
    {
      status: 'Independence',
      date: '1962',
      description:
        'After Algeria’s independence, Zemmouri embraced new development and modernization projects.',
      icon: 'pi pi-star',
      color: '#16a34a',
    },
    {
      status: 'Modern Growth',
      date: '2000 - Present',
      description:
        'Zemmouri continues to grow sustainably, focusing on tourism, environment, and digital governance.',
      icon: 'pi pi-globe',
      color: '#16a34a',
    },
  ]

  const customizedMarker = (item: any) => {
    return (
      <span
        className="flex w-3rem h-3rem align-items-center justify-content-center text-white border-circle shadow-2"
        style={{ backgroundColor: item.color }}
      >
        <i className={`${item.icon} text-xl`}></i>
      </span>
    )
  }

  const customizedContent = (item: any) => {
    return (
      <Card title={item.status} subTitle={item.date} className="border-green-500">
        <p className="m-0 text-gray-700">{item.description}</p>
      </Card>
    )
  }

  return (
    <div className="p-6 page-container">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        {t('history', 'History of Zemmouri')}
      </h1>
      <Timeline
        value={events}
        align="alternate"
        marker={customizedMarker}
        content={customizedContent}
      />
    </div>
  )
}

export default History
