import React from 'react'
import { useTranslation } from 'react-i18next'
import PersonWord from '../../components/person-word/PersonWord'
import PersonHistory from '../../components/person-history/PersonHistory'

const SecretaryGeneral: React.FC = () => {
  const { t } = useTranslation()

  const currentSecretary = {
    name: t('secretary_general.current.name'),
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
    message: t('secretary_general_page.current.message'),
  }

  const secretaryHistory = [
    {
      name: 'Samir Khellaf',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
      period: '2015 - 2022',
      achievements: t('secretary_general_page.history.samir'),
    },
    {
      name: 'Nadia Mansour',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
      period: '2008 - 2015',
      achievements: t('secretary_general_page.history.nadia'),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <PersonWord
        name={currentSecretary.name}
        image={currentSecretary.image}
        message={currentSecretary.message}
        title={t('secretary_general_page.word_title')}
      />
      <PersonHistory
        title={t('secretary_general_page.history_title')}
        history={secretaryHistory}
      />
    </div>
  )
}

export default SecretaryGeneral
