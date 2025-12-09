import React, { useEffect, useState } from 'react'
import { Carousel } from 'primereact/carousel'
import { useTranslation } from 'react-i18next'
import MediaCard from '../media-card'
import api from '../../lib/api'
import './news.css'

interface NewsItem {
  id: number
  title: string | { [key: string]: string }
  description: string | { [key: string]: string }
  fileUrl: string
}

const News: React.FC = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  const responsiveOptions = [
    { breakpoint: '1200px', numVisible: 1, numScroll: 1 },
    { breakpoint: '991px', numVisible: 1, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ]

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await api.get('/news', { params: { lang: i18n.language || 'en' } })
        setNewsItems(response.data || [])
      } catch (error) {
        console.error('Failed to fetch news:', error)
        setNewsItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [i18n.language])

  const itemTemplate = (item: NewsItem) => {
    // ✅ Handle multilingual title and description
    let title = ''
    let description = ''

    if (typeof item.title === 'object' && item.title !== null) {
      title = item.title[i18n.language] || item.title['en'] || ''
    } else {
      title = item.title
    }

    if (typeof item.description === 'object' && item.description !== null) {
      description = item.description[i18n.language] || item.description['en'] || ''
    } else {
      description = item.description
    }

    return (
      <MediaCard
        key={item.id}
        title={title}
        fileUrl={item.fileUrl}
        description={description}
      />
    )
  }

  if (loading) {
    return (
      <section className="news-section">
        <p>{t('common.loading', 'Loading...')}</p>
      </section>
    )
  }

  if (!newsItems || newsItems.length === 0) {
    return null
  }

  return (
    <section className="news-section" dir={isRtl ? 'rtl' : 'ltr'}>
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
        dir="ltr"
        key={i18n.language + (isRtl ? '-rtl' : '-ltr')}
      />
    </section>
  )
}

export default News
