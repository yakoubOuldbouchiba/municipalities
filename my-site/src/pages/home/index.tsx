import React, { useState } from 'react'
import { Carousel } from 'primereact/carousel'
import { Button } from 'primereact/button'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import HistoryGeo from '../../components/history-geo/HistoryGeo'
import './Home.css'

const Home: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const images = [
    {
      id: 1,
      url: 'https://d3mc2wqt0g7xc3.cloudfront.net/media-test/point26588.jpg',
      caption: t('homePage.carousel.caption1'),
    },
    {
      id: 2,
      url: 'https://statics.getnofilter.com/photos/small/bf42f00d-7d0b-42b7-86a8-53d98b3b4c6c.webp',
      caption: t('homePage.carousel.caption2'),
    },
    {
      id: 3,
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/DZ_35_Zemmouri.svg/2560px-DZ_35_Zemmouri.svg.png',
      caption: t('homePage.carousel.caption3'),
    },
  ]

  const imageTemplate = (item: any) => (
    <div className="carousel-image-container">
      <img src={item.url} alt={item.caption} className="carousel-image" />
      <motion.div
        className={`overlay ${isRtl ? 'overlay-right' : 'overlay-left'}`}
        initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="welcome-text">{t('homePage.welcome')}</h1>
        <p className="caption-text">{item.caption}</p>
        <Button
          label={t('homePage.discover')}
          className="p-button-rounded p-button-success explore-btn"
          onClick={() => setVisible(true)}
        />
      </motion.div>
    </div>
  )

  return (
    <div className="homePage" dir={isRtl ? 'rtl' : 'ltr'}>
      <Carousel
        key={i18n.language + (isRtl ? '-rtl' : '-ltr')}
        dir="ltr" // ✅ Force internal LTR for PrimeReact carousel rendering
        value={images}
        itemTemplate={imageTemplate}
        numVisible={1}
        numScroll={1}
        autoplayInterval={5000}
        circular
        showIndicators={false}
      />

      <HistoryGeo visible={visible} onHide={() => setVisible(false)} />
    </div>
  )
}

export default Home
