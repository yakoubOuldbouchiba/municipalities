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

const DocumentCard: React.FC<DocumentCardProps> = ({ id, title, fileUrl, type }) => {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const isPDF = type === 'pdf' || fileUrl.endsWith('.pdf')

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/share?title=${encodeURIComponent(title)}&fileUrl=${encodeURIComponent(fileUrl)}&type=${type}`)
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
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-text p-button-sm"
          tooltip={t('preview')}
          onClick={(e) => {
            e.stopPropagation()
            setVisible(true)
          }}
        />
      </div>
    </div>
  )

  return (
    <>
      <Card
        title={header}
        className="shadow-md hover:shadow-lg transition-all w-48 cursor-pointer"
        onClick={() => setVisible(true)}
      >
        {isPDF ? (
          <div className="flex flex-col items-center justify-center h-40 bg-gray-100 text-gray-600">
            <i className="pi pi-file-pdf text-5xl mb-2" />
            <span>{t('pdfDocument')}</span>
          </div>
        ) : (
          <img
            src={fileUrl}
            alt={title}
            className="h-40 w-full object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=' + t('noImage')
            }}
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
          <iframe src={fileUrl} title={title} className="w-full" style={{ height: '80vh', border: 'none' }} />
        ) : (
          <img src={fileUrl} alt={title} className="w-full object-contain rounded-lg" style={{ maxHeight: '80vh' }} />
        )}
      </Dialog>
    </>
  )
}

export default DocumentCard
