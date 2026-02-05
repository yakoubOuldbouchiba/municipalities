import React, { useState } from 'react'
import { Card } from 'primereact/card'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import './media-card.css'

interface MediaCardProps {
  title: string
  fileUrl: string
  description?: string
}

const MediaCard: React.FC<MediaCardProps> = ({ title, fileUrl, description }) => {
  const [visible, setVisible] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [iframeError, setIframeError] = useState(false)
  const [imageError, setImageError] = useState(false)
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

  // Handle iframe load timeout
  const handleIframeLoad = (type: 'pdf' | 'youtube') => {
    const timeout = setTimeout(() => {
      console.warn(`Iframe ${type} failed to load within timeout`)
      setIframeError(true)
    }, 8000) // 8 second timeout

    return () => clearTimeout(timeout)
  }

  const detectFileType = (): 'image' | 'pdf' | 'youtube' => {
    if (fileUrl.endsWith('.pdf')) return 'pdf'
    if (fileUrl.includes('youtube.com') || fileUrl.includes('youtu.be')) return 'youtube'
    return 'image'
  }

  const fileType = detectFileType()

  const renderMedia = () => {
    // Show offline message for iframes when no internet
    if (!isOnline && (fileType === 'pdf' || fileType === 'youtube')) {
      return (
        <div className="media-offline-placeholder">
          <div className="offline-icon">📡</div>
          <p>{t('common.offline', 'You are offline')}</p>
          <small>{fileType === 'pdf' ? t('common.pdfOffline', 'PDF cannot be loaded offline') : t('common.youtubeOffline', 'YouTube cannot be loaded offline')}</small>
        </div>
      )
    }

    switch (fileType) {
      case 'image':
        return imageError ? (
          <div className="media-offline-placeholder">
            <div className="offline-icon"><i className="pi pi-image"></i></div>
            <p>{t('common.imageLoadError', 'Failed to load image')}</p>
          </div>
        ) : (
          <img
            src={fileUrl}
            alt={title}
            className="media-card-image"
            onError={() => {
              setImageError(true)
            }}
          />
        )
      case 'pdf':
        return iframeError ? (
          <div className="media-offline-placeholder">
            <div className="offline-icon"><i className="pi pi-file-pdf"></i></div>
            <p>{t('common.loadError', 'Failed to load PDF')}</p>
          </div>
        ) : (
          <iframe
            src={fileUrl}
            title={title}
            className="media-card-iframe"
            style={{ border: 'none' }}
            onError={() => setIframeError(true)}
            onLoad={handleIframeLoad('pdf') as any}
            sandbox="allow-same-origin"
          />
        )
      case 'youtube':
        const embedUrl = fileUrl.includes('embed')
          ? fileUrl
          : fileUrl.replace('watch?v=', 'embed/')
        return iframeError ? (
          <div className="media-offline-placeholder">
            <div className="offline-icon"><i className="pi pi-play"></i></div>
            <p>{t('common.loadError', 'Failed to load video')}</p>
          </div>
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="media-card-iframe"
            onError={() => setIframeError(true)}
            onLoad={handleIframeLoad('youtube') as any}
            sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -4 }}
      >
        <Card
          className="media-card"
          onClick={() => setVisible(true)}
        >
          <div className="media-card-type-badge">
            {fileType === 'image' && <><i className="pi pi-image" style={{ marginRight: '0.25rem' }}></i>Image</>}
            {fileType === 'pdf' && <><i className="pi pi-file-pdf" style={{ marginRight: '0.25rem' }}></i>PDF</>}
            {fileType === 'youtube' && <><i className="pi pi-play" style={{ marginRight: '0.25rem' }}></i>Video</>}
          </div>
          <div className="media-card-content">
            <div className="media-card-left">{renderMedia()}</div>
            <div className="media-card-text">
              <h3 className="media-card-title">{title}</h3>
              {description && <p className="media-card-description">{description}</p>}
              <Button
                icon="pi pi-eye"
                label={t('preview')}
                className="media-card-preview-btn p-button-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setVisible(true)
                }}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      <Dialog
        header={title}
        visible={visible}
        style={{ width: '80vw', maxWidth: '1000px' }}
        onHide={() => setVisible(false)}
        modal
        draggable={false}
        resizable={false}
      >
        {renderMedia()}
      </Dialog>
    </>
  )
}

export default MediaCard
