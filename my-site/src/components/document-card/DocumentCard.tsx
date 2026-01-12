import React, { useState } from 'react'
import { Card } from 'primereact/card'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface DocumentCardProps {
  id?: string
  title: string
  fileUrl: string
  type?: 'image' | 'pdf'
}

const DocumentCard: React.FC<DocumentCardProps> = ({ title, fileUrl, type }) => {
  const [visible, setVisible] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [imageError, setImageError] = useState(false)
  const [pdfError, setPdfError] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

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

  const isPDF = type === 'pdf' || fileUrl.toLowerCase().endsWith('.pdf')

  // Handle iframe load timeout
  const handleIframeTimeout = () => {
    const timeout = setTimeout(() => {
      console.warn('PDF iframe failed to load within timeout')
      setPdfError(true)
    }, 8000) // 8 second timeout
    return () => clearTimeout(timeout)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(
      `/share?title=${encodeURIComponent(title)}&fileUrl=${encodeURIComponent(fileUrl)}&type=${type}`
    )
  }

  const header = (
    <div className="flex justify-between items-center">
      <span className="font-semibold">{title}</span>
      <div className="flex gap-2">
        <Button
          icon="pi pi-share-alt"
          className="p-button-rounded p-button-success p-button-sm"
          tooltip={t('share')}
          onClick={handleShare}
        />
        {/* <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-text p-button-sm"
          tooltip={t('preview')}
          onClick={(e) => {
            e.stopPropagation()
            setVisible(true)
          }}
        /> */}
      </div>
    </div>
  )

  // ✅ fallback image constant
  const fallbackImage = 'https://via.placeholder.com/200x150?text=' + encodeURIComponent(t('noImage'))

  // ✅ Fallback placeholder component
  const FallbackPlaceholder = ({ icon, message }: { icon: string; message: string }) => (
    <div className="flex flex-col items-center justify-center h-40 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 gap-2 rounded-lg">
      <div className="text-3xl">{icon}</div>
      <p className="text-sm font-medium">{message}</p>
    </div>
  )

  return (
    <>
      <Card
        title={header}
        className="shadow-md hover:shadow-lg transition-all w-full cursor-pointer"
        onClick={() => setVisible(true)}
      >
        {isPDF ? (
          !isOnline || pdfError ? (
            <FallbackPlaceholder
              icon="📄"
              message={!isOnline ? t('common.offline', 'You are offline') : t('common.loadError', 'Failed to load PDF')}
            />
          ) : (
            <iframe
              src={fileUrl}
              title={title}
              className="w-full"
              style={{ height: '150px', border: 'none' }}
              onError={() => setPdfError(true)}
              onLoad={handleIframeTimeout() as any}
              sandbox="allow-same-origin"
            />
          )
        ) : imageError ? (
          <FallbackPlaceholder
            icon="🖼️"
            message={t('common.imageLoadError', 'Failed to load image')}
          />
        ) : (
          <img
            src={fileUrl || fallbackImage}
            alt={title}
            className="h-40 w-full object-cover rounded-lg"
            onError={() => setImageError(true)}
          />
        )}
      </Card>

      <Dialog
        header={title}
        visible={visible}
        style={{ width: isPDF ? '70vw' : '50vw' }}
        modal
        draggable={false}
        onHide={() => setVisible(false)}
      >
        {isPDF ? (
          !isOnline || pdfError ? (
            <FallbackPlaceholder
              icon="📄"
              message={!isOnline ? t('common.offline', 'You are offline') : t('common.loadError', 'Failed to load PDF')}
            />
          ) : (
            <iframe
              src={fileUrl}
              title={title}
              className="w-full"
              style={{ height: '80vh', border: 'none' }}
              onError={() => setPdfError(true)}
              onLoad={handleIframeTimeout() as any}
              sandbox="allow-same-origin"
            />
          )
        ) : imageError ? (
          <FallbackPlaceholder
            icon="🖼️"
            message={t('common.imageLoadError', 'Failed to load image')}
          />
        ) : (
          <img
            src={fileUrl || fallbackImage}
            alt={title}
            className="w-full object-contain rounded-lg"
            style={{ maxHeight: '80vh' }}
            onError={() => setImageError(true)}
          />
        )}
      </Dialog>
    </>
  )
}

export default DocumentCard
