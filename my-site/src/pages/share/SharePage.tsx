import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Dialog } from 'primereact/dialog'
import QRCode from 'react-qr-code'
import { useTranslation } from 'react-i18next'
import PageLayout from '../../components/layout/PageLayout'

const SharePage: React.FC = () => {
  const [params] = useSearchParams()
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const title = params.get('title') || t('sharePage.defaultTitle')
  const fileUrl = params.get('fileUrl') || ''
  const type = params.get('type') || 'image'

  const [qrVisible, setQrVisible] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [iframeError, setIframeError] = useState(false)
  const shareUrl = window.location.href

  // Monitor online/offline status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Handle iframe load timeout
  const handleIframeTimeout = () => {
    const timeout = setTimeout(() => {
      console.warn('Share PDF iframe failed to load within timeout')
      setIframeError(true)
    }, 8000) // 8 second timeout
    return () => clearTimeout(timeout)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    alert(t('sharePage.linkCopied'))
  }

  return (
    <PageLayout>
      <div
        style={{ direction: isRtl ? 'rtl' : 'ltr', textAlign: isRtl ? 'right' : 'left' }}
      >
        <Card title={title} className="share-card">
          {type === 'pdf' ? (
            !isOnline || iframeError ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', backgroundColor: '#f3f4f6', color: '#64748b', gap: '1rem', borderRadius: '8px' }}>
                <i className="pi pi-file-pdf" style={{ fontSize: '3rem', color: '#dc2626' }}></i>
                <p style={{ fontWeight: '500' }}>{!isOnline ? t('common.offline', 'You are offline') : t('common.loadError', 'Failed to load PDF')}</p>
              </div>
            ) : (
              <iframe
                src={fileUrl}
                title={title}
                style={{ width: '100%', height: '600px', border: 'none', borderRadius: '8px' }}
                onError={() => setIframeError(true)}
                onLoad={handleIframeTimeout() as any}
                sandbox="allow-same-origin"
              />
            )
          ) : (
            <img src={fileUrl} alt={title} style={{ width: '100%', maxHeight: '600px', objectFit: 'contain', borderRadius: '8px' }} />
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            <Button
              icon="pi pi-copy"
              label={t('sharePage.copyLink')}
              onClick={handleCopy}
              style={{ width: '100%', maxWidth: '200px' }}
            />
            <Button
              icon="pi pi-qrcode"
              label={t('sharePage.qrCode')}
              onClick={() => setQrVisible(true)}
              style={{ width: '100%', maxWidth: '200px' }}
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <QRCode value={shareUrl} size={200} />
            <p style={{ color: '#64748b', textAlign: 'center' }}>{t('sharePage.scanText')}</p>
          </div>
        </Dialog>
      </div>
    </PageLayout>
  )
}

export default SharePage
