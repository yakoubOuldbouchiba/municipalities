// src/components/advertisements/index.tsx
import React from 'react'
import { Carousel } from 'primereact/carousel'
import { useTranslation } from 'react-i18next'
import DocumentCard from '../document-card/DocumentCard'
import './advertisements.css'

interface AdsItem {
  title: string | { [key: string]: string }
  link: string
  fileType?: 'image' | 'pdf'
}

interface AdsProps {
  ads: AdsItem[]
}

const Advertisements: React.FC<AdsProps> = ({ ads }) => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const responsiveOptions = [
    { breakpoint: '1199px', numVisible: 2, numScroll: 1 },
    { breakpoint: '991px', numVisible: 2, numScroll: 1 },
    { breakpoint: '767px', numVisible: 1, numScroll: 1 }
  ]

  const adsTemplate = (item: AdsItem) => {
    // ✅ Handle multilingual title
    let title = ''
    if (typeof item.title === 'object' && item.title !== null) {
      title = item.title[i18n.language] || item.title['en'] || ''
    } else {
      title = item.title
    }

    return (
      <DocumentCard
        title={title}
        fileUrl={item.link}
        type={item.fileType || 'image'}
      />
    )
  }

  return (
    <section className="ads" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="ads-header">
        <h2 className="ads-title">
          <i
            className={`pi pi-bullhorn ${isRtl ? 'rtl-icon' : ''}`}
            style={{ marginInlineEnd: '0.5rem' }}
          ></i>
          {t('latestAds')}
        </h2>
        <div className="ads-line"></div>
      </div>

      <Carousel
        value={ads}
        numVisible={2}
        numScroll={1}
        circular
        autoplayInterval={4000}
        responsiveOptions={responsiveOptions}
        itemTemplate={adsTemplate}
        showIndicators
        className={`ads-carousel ${isRtl ? 'rtl' : 'ltr'}`}
        key={i18n.language + (isRtl ? '-rtl' : '-ltr')}
      />
    </section>
  )
}

export default Advertisements
