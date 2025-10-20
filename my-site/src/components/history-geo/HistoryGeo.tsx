import React from 'react'
import { Dialog } from 'primereact/dialog'
import './HistoryGeo.css'

interface HistoryGeoProps {
  visible: boolean
  onHide: () => void
}

const HistoryGeo: React.FC<HistoryGeoProps> = ({ visible, onHide }) => {
  return (
    <Dialog
      header="History & Geography of Zemmouri"
      visible={visible}
      onHide={onHide}
      className="history-geo-dialog"
      maximized
      modal
    >
      <div className="history-geo">
        <h3>📜 History</h3>
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
    </Dialog>
  )
}

export default HistoryGeo
