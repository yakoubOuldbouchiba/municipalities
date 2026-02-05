import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './HistoryGeo.css'

interface HistoryGeoProps {
  visible: boolean
  onHide: () => void
}

const HistoryGeo: React.FC<HistoryGeoProps> = ({ visible, onHide }) => {
  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className="history-geo-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onHide}
          />
          <motion.div
            className="history-geo-modal-wrapper"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="history-geo-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="history-geo-modal-header">
                <h1 className="history-geo-modal-title">History & Geography</h1>
                <button
                  className="history-geo-close-btn"
                  onClick={onHide}
                  aria-label="Close modal"
                >
                  <i className="pi pi-times"></i>
                </button>
              </div>
              <div className="history-geo-modal-body">
                <div className="history-geo-content">
                  <div className="history-geo-section">
                    <h2 className="history-geo-section-title">📜 History</h2>
                    <p className="history-geo-section-text">
                      Zemmouri, a beautiful coastal town in Boumerdès Province, has a rich
                      history rooted in Amazigh and Andalusian culture. Historically known
                      for its strategic maritime position, it played a key role in trade and
                      defense during various periods.
                    </p>
                  </div>

                  <div className="history-geo-divider" />

                  <div className="history-geo-section">
                    <h3 className="history-geo-section-title">🌍 Geography</h3>
                    <p className="history-geo-section-text">
                      Located on the Mediterranean coast, Zemmouri enjoys a mild climate,
                      scenic beaches, and fertile lands. It's bordered by the sea to the
                      north and lush hills to the south, making it one of the most charming
                      towns in northern Algeria.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default HistoryGeo
