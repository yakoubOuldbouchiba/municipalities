import React from 'react'
import { useParams } from 'react-router-dom'
import { Card } from 'primereact/card'
import './paper-details.css'
import QRCode from 'react-qr-code'

const data = {
    identity: {
        title: 'Identity Documents',
        items: [
            'Birth certificate (original)',
            '2 recent photos (passport size)',
            'Proof of residence',
            'Old ID card (if renewal)',
        ],
    },
    driving: {
        title: 'Driving & Vehicles',
        items: [
            'Medical certificate',
            '2 recent photos',
            'Copy of ID card',
            'Proof of residence',
            'Driving test registration form',
        ],
    },
}

const PaperDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const section = data[id as keyof typeof data]

    if (!section) {
        return <p className="text-center">Section not found.</p>
    }

    const currentUrl = window.location.href


    return (
        <div className="paper-details p-6">
            <Card title={section.title} className="shadow-3">
                <ul className="paper-list">
                    {section.items.map((item, index) => (
                        <li key={index}>📄 {item}</li>
                    ))}
                </ul>
                <div className="qr-container">
                    <p>Share this procedure:</p>
                    <QRCode value={currentUrl} size={128} />
                </div>
            </Card>

        </div>
    )
}

export default PaperDetails
