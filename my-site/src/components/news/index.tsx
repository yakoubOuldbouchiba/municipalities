import React from 'react'
import { Carousel } from 'primereact/carousel'
import { useTranslation } from 'react-i18next'
import MediaCard from '../media-card'
import './News.css'

const News: React.FC = () => {
  const { t } = useTranslation()

  const newsItems = [
    {
      id: 1,
      title: t('news.digitalServicesTitle'),
      description: t('news.digitalServicesDesc'),
      fileUrl: 'https://unej.dz/savedIMG//images/pages/l4qrj2s6SRRMULLS1RS.jpeg'
    },
    {
      id: 2,
      title: t('news.infrastructureTitle'),
      description: t('news.infrastructureDesc'),
      fileUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4'
    },
    {
      id: 3,
      title: t('news.budgetTitle'),
      description: t('news.budgetDesc'),
      fileUrl: 'https://unej.dz/savedIMG//images/pages/l4qrj2s6SRRMULLS1RS.jpeg'
    }
  ]

  const responsiveOptions = [
    { breakpoint: '1200px', numVisible: 1, numScroll: 1 },
    { breakpoint: '991px', numVisible: 1, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ]

  const itemTemplate = (item: typeof newsItems[number]) => (
    <MediaCard
      key={item.id}
      title={item.title}
      fileUrl={item.fileUrl}
      description={item.description}
    />
  )

  return (
    <section className="news-section">
      <h2 className="news-title">{t('news.latest')}</h2>
      <Carousel
        value={newsItems}
        numVisible={1}
        numScroll={1}
        circular
        autoplayInterval={6000}
        responsiveOptions={responsiveOptions}
        itemTemplate={itemTemplate}
        showIndicators
        showNavigators
        className="news-carousel"
      />
    </section>
  )
}

export default News
