import React from 'react'
import './HistoryGeo.css'

interface HistoryGeoProps {
  visible: boolean
  onHide: () => void
}

const HistoryGeo: React.FC<HistoryGeoProps> = ({ visible, onHide }) => {
  if (!visible) return null
  return (
    <div className="history-geo-modal-overlay" onClick={onHide}>
      <div className="history-geo-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="history-geo-modal-header">
          <h1>History & Geography of Zemmouri</h1>
          <button className="history-geo-close-btn" onClick={onHide}>✕</button>
        </div>
        <div className="history-geo-modal-body">
      <div className="history-geo-content">
        <h2>📜 History</h2>
        <p>
          Zemmouri, a beautiful coastal town in Boumerdès Province, has a rich
          history rooted in Amazigh and Andalusian culture. Historically known
          for its strategic maritime position, it played a key role in trade and
          defense during various periods.
        </p>

        <h3>🌍 Geography</h3>
        <p>
          Located on the Mediterranean coast, Zemmouri enjoys a mild climate,
          scenic beaches, and fertile lands. It’s bordered by the sea to the
          north and lush hills to the south, making it one of the most charming
          towns in northern Algeria.
        </p>
        </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryGeo
