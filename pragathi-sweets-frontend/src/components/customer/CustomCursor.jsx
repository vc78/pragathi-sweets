import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false)
  const [hidden, setHidden] = useState(true)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Spring settings for organic trailing effect
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - (hovered ? 24 : 8))
      cursorY.set(e.clientY - (hovered ? 24 : 8))
      if (hidden) setHidden(false)
    }

    const handleMouseLeave = () => setHidden(true)
    const handleMouseEnter = () => setHidden(false)

    window.addEventListener('mousemove', moveCursor)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // Select elements to change cursor size on hover
    const addHoverEvents = () => {
      const interactives = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"], .interactive-cursor'
      )
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => setHovered(true))
        el.addEventListener('mouseleave', () => setHovered(false))
      })
    }

    // Call initially and on DOM mutations (page transitions, new elements)
    addHoverEvents()
    const observer = new MutationObserver(addHoverEvents)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      observer.disconnect()
    }
  }, [hovered, cursorX, cursorY, hidden])

  if (hidden) return null

  return (
    <motion.div
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      className={`fixed top-0 left-0 z-50 pointer-events-none rounded-full border border-gold mix-blend-difference ${
        hovered 
          ? 'w-12 h-12 bg-gold/15 backdrop-blur-[1px] scale-100 transition-all duration-300' 
          : 'w-4 h-4 bg-gold scale-75'
      }`}
      animate={{
        scale: hovered ? 1.2 : 0.8,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    />
  )
}
