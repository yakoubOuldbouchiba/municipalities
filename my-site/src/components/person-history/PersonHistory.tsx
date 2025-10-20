import React from 'react'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Image } from 'primereact/image'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import './person-history.css'

interface HistoryItem {
  name: string
  image: string
  period: string
  achievements: string
}

interface PersonHistoryProps {
  title?: string
  history: HistoryItem[]
}

const PersonHistory: React.FC<PersonHistoryProps> = ({ title, history }) => {
  const { t } = useTranslation()

  const imageTemplate = (rowData: HistoryItem) => (
    <Image
      src={rowData.image}
      alt={rowData.name}
      width="60"
      height="60"
      preview
      className="person-history-image"
    />
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Card className="person-history-card">
        <h3 className="person-history-title">
          {title || t('mayors.historyTitle')}
        </h3>
        <DataTable
          value={history}
          stripedRows
          paginator
          rows={5}
          responsiveLayout="scroll"
          className="person-history-table"
        >
          <Column header={t('mayors.photo')} body={imageTemplate}></Column>
          <Column field="name" header={t('mayors.name')}></Column>
          <Column field="period" header={t('mayors.period')}></Column>
          <Column field="achievements" header={t('mayors.achievements')}></Column>
        </DataTable>
      </Card>
    </motion.div>
  )
}


export default PersonHistory
