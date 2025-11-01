import React, { useEffect, useState } from 'react'
import { Carousel } from 'primereact/carousel'
import { Button } from 'primereact/button'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import HistoryGeo from '../../components/history-geo/HistoryGeo'
import './Home.css'
import axios from 'axios'

const Home: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [images, setImages] = useState<Array<{ url: string; caption: string }>>([])
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  useEffect(() => {
  axios
    .get(`http://localhost:8000/api/home-images?lang=${i18n.language}`)
    .then((res) => setImages(res.data))
    .catch((err) => console.error('Error fetching home images:', err))
  }, [i18n.language])

  

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
