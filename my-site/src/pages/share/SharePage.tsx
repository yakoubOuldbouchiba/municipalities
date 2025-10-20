import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Dialog } from 'primereact/dialog'
import QRCode from 'react-qr-code'
import { useTranslation } from 'react-i18next'

const SharePage: React.FC = () => {
  const [params] = useSearchParams()
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const title = params.get('title') || t('sharePage.defaultTitle')
  const fileUrl = params.get('fileUrl') || ''
  const type = params.get('type') || 'image'

  const [qrVisible, setQrVisible] = useState(false)
  const shareUrl = window.location.href

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    alert(t('sharePage.linkCopied'))
  }

  return (
    <div
      className="flex flex-col items-center p-6 gap-4 bg-gray-50 min-h-screen"
      style={{ direction: isRtl ? 'rtl' : 'ltr', textAlign: isRtl ? 'right' : 'left' }}
    >
      <Card title={title} className="w-full md:w-2/3 shadow-lg">
        {type === 'pdf' ? (
          <iframe
            src={fileUrl}
            title={title}
            className="w-full"
            style={{ height: '70vh', border: 'none' }}
          />
        ) : (
          <img src={fileUrl} alt={title} className="w-full object-contain rounded-lg" />
        )}

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <Button
            icon="pi pi-copy"
            label={t('sharePage.copyLink')}
            onClick={handleCopy}
            className="p-button-success"
          />
          <Button
            icon="pi pi-qrcode"
            label={t('sharePage.qrCode')}
            className="p-button-info"
            onClick={() => setQrVisible(true)}
          />
        </div>
      </Card>

      {/* QR Code Dialog */}
      <Dialog
        header={t('sharePage.qrHeader')}
        visible={qrVisible}
        style={{ width: '400px' }}
        modal
        onHide={() => setQrVisible(false)}
      >
        <div className="flex flex-col items-center gap-4">
          <QRCode value={shareUrl} size={200} />
          <p className="text-gray-700 text-center">{t('sharePage.scanText')}</p>
        </div>
      </Dialog>
    </div>
  )
}

export default SharePage
