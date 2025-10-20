import React from 'react'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { Image } from 'primereact/image'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import './person-word.css'

interface PersonWordProps {
  name: string
  image: string
  message: string
  title?: string
}

const PersonWord: React.FC<PersonWordProps> = ({ name, image, message, title }) => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Card
        className="person-word-card"
        style={{ direction: isRtl ? 'rtl' : 'ltr', textAlign: isRtl ? 'right' : 'left' }}
      >
        <div className="person-word-bg" />
        <h2 className="person-word-title">
          {title || t('wordTitle')}
        </h2>
        <div className="person-word-content">
          <Image
            src={image}
            alt={name}
            width="150"
            height="150"
            className="person-word-image"
          />
          <div className="person-word-text">
            <h3 className="person-word-name">{name}</h3>
            <Divider className="person-word-divider" />
            <p className="person-word-message">{message}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default PersonWord
