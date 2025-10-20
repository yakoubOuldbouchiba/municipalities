import React from 'react'
import { useTranslation } from 'react-i18next'
import PersonWord from '../../components/person-word/PersonWord'
import PersonHistory from '../../components/person-history/PersonHistory'
import './mayor.css'

const Mayor: React.FC = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const currentMayor = {
    name: t('mayor.current.name'),
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
    message: t('mayorPage.current.message'),
  }

  const mayorHistory = [
    {
      name: 'Ali Bouzid',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
      period: '2010 - 2020',
      achievements: t('mayorPage.history.ali'),
    },
    {
      name: 'Mourad Djelloul',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
      period: '2000 - 2010',
      achievements: t('mayorPage.history.mourad'),
    },
  ]

  return (
    <div className="mayor-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mayor-section">
        <PersonWord
          name={currentMayor.name}
          image={currentMayor.image}
          message={currentMayor.message}
          title={t('mayorPage.wordTitle')}
        />
      </div>

      <div className="mayor-section">
        <PersonHistory title={t('mayorPage.historyTitle')} history={mayorHistory} />
      </div>
    </div>
  )
}

export default Mayor
