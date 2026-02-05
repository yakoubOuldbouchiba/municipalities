import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { motion } from 'framer-motion'
import './scroll-top-button.css'

const ScrollTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
      transition={{ duration: 0.3 }}
      className="scroll-top-button-container"
    >
      <Button
        icon="pi pi-arrow-up"
        className="scroll-top-button"
        onClick={scrollToTop}
        tooltip="Back to top"
        tooltipPosition="left"
      />
    </motion.div>
  )
}

export default ScrollTopButton
