import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { motion } from 'framer-motion'

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
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
      }}
    >
      <Button
        icon="pi pi-arrow-up"
        className="p-button-rounded p-button-success shadow-3"
        style={{
          backgroundColor: '#16a34a',
          borderColor: '#16a34a',
          width: '3rem',
          height: '3rem',
        }}
        onClick={scrollToTop}
      />
    </motion.div>
  )
}

export default ScrollTopButton
