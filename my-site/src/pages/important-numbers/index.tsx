import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ProgressSpinner } from 'primereact/progressspinner'
import './important-numbers.css'
import api from '../../lib/api'
import PageLayout from '../../components/layout/PageLayout'

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
    <a 
      href={`tel:${rowData.value}`} 
      style={{ color: '#1a7f37', fontWeight: '600', textDecoration: 'none' }}
      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
    >
      {rowData.value}
    </a>
  )

  if (loading) {
    return (
      <PageLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          <ProgressSpinner />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="important-numbers-page" dir={isRtl ? 'rtl' : 'ltr'}>
        {numbers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            {t('importantNumbersPage.empty', 'No important numbers found')}
          </div>
        )}

        {numbers.length > 0 && (
          <div className="table-container">
            <DataTable value={numbers} responsiveLayout="scroll" stripedRows>
              <Column field="label" header={t('importantNumbers.table.label', 'Label')} />
              <Column header={t('importantNumbers.table.value', 'Number')} body={valueBodyTemplate} />
            </DataTable>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default ImportantNumbers
