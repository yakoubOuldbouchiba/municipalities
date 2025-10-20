import React, { useState } from 'react'
import { Card } from 'primereact/card'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'
import './media-card.css'

interface MediaCardProps {
  title: string
  fileUrl: string
  description?: string
}

const MediaCard: React.FC<MediaCardProps> = ({ title, fileUrl, description }) => {
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()

  const detectFileType = (): 'image' | 'pdf' | 'youtube' => {
    if (fileUrl.endsWith('.pdf')) return 'pdf'
    if (fileUrl.includes('youtube.com') || fileUrl.includes('youtu.be')) return 'youtube'
    return 'image'
  }

  const fileType = detectFileType()

  const renderMedia = () => {
    switch (fileType) {
      case 'image':
        return (
          <img
            src={fileUrl}
            alt={title}
            className="media-card-image"
            onError={(e) =>
              ((e.target as HTMLImageElement).src =
                'https://via.placeholder.com/400x250?text=No+Image')
            }
          />
        )
      case 'pdf':
        return (
          <iframe
            src={fileUrl}
            title={title}
            className="media-card-iframe"
            style={{ border: 'none' }}
          />
        )
      case 'youtube':
        const embedUrl = fileUrl.includes('embed')
          ? fileUrl
          : fileUrl.replace('watch?v=', 'embed/')
        return (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="media-card-iframe"
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <Card
        className="media-card shadow-2 hover:shadow-4 transition-all cursor-pointer"
        onClick={() => setVisible(true)}
      >
        <div className="media-card-content">
          <div className="media-card-left">{renderMedia()}</div>
          <div className="media-card-text">
            <h3>{title}</h3>
            {description && <p>{description}</p>}
            <Button
              icon="pi pi-eye"
              label={t('preview')}
              className="p-button-text p-button-sm mt-2"
              onClick={(e) => {
                e.stopPropagation()
                setVisible(true)
              }}
            />
          </div>
        </div>
      </Card>

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
