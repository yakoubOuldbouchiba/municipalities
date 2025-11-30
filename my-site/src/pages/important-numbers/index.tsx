import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import './important-numbers.css'
import api from '../../lib/api'

interface ImportantNumber {
  id: number
  label: string
  value: string
}

const ImportantNumbers: React.FC = () => {
  const { i18n, t } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [numbers, setNumbers] = useState<ImportantNumber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .get('/important-numbers', { params: { lang: i18n.language } })
      .then((res) => setNumbers(res.data || []))
      .catch((err) => {
        console.error('Error fetching important numbers:', err)
        setNumbers([])
      })
      .finally(() => setLoading(false))
  }, [i18n.language])

  const valueBodyTemplate = (rowData: ImportantNumber) => (
    <a href={`tel:${rowData.value}`} className="text-blue-600 hover:underline font-semibold">
      {rowData.value}
    </a>
  )

  return (
    <div className="important-numbers-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <h1 className="page-title">{t('importantNumbersPage.title', 'Important Numbers')}</h1>

      {loading && <div className="text-center py-8">{t('common.loading', 'Loading...')}</div>}

      {!loading && numbers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {t('importantNumbersPage.empty', 'No important numbers found')}
        </div>
      )}

      {!loading && numbers.length > 0 && (
        <div className="table-container">
          <DataTable value={numbers} responsiveLayout="scroll" stripedRows>
            <Column field="label" header={t('importantNumbers.table.label', 'Label')} />
            <Column header={t('importantNumbers.table.value', 'Number')} body={valueBodyTemplate} />
          </DataTable>
        </div>
      )}
    </div>
  )
}

export default ImportantNumbers
