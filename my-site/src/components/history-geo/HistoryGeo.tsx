import React from 'react'
import { Dialog } from 'primereact/dialog'
import { useTranslation } from 'react-i18next'
import './HistoryGeo.css'

interface HistoryGeoProps {
  visible: boolean
  onHide: () => void
}

const HistoryGeo: React.FC<HistoryGeoProps> = ({ visible, onHide }) => {
  const { t } = useTranslation()

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={t('historyGeo.title')}
      className="history-geo-dialog"
      headerClassName="history-geo-dialog-header"
      style={{ width: '90vw', maxWidth: '900px' }}
      position="top"
      modal
      blockScroll
    >
      <div className="history-geo-content">
        <div className="history-geo-section">
          <h2 className="history-geo-section-title">{t('historyGeo.historyTitle')}</h2>
          <p className="history-geo-section-text">
            {t('historyGeo.historyText')}
          </p>
        </div>

        <div className="history-geo-divider" />

        <div className="history-geo-section">
          <h3 className="history-geo-section-title">{t('historyGeo.geographyTitle')}</h3>
          <p className="history-geo-section-text">
            {t('historyGeo.geographyText')}
          </p>
        </div>
      </div>
    </Dialog>
  )
}

export default HistoryGeo
