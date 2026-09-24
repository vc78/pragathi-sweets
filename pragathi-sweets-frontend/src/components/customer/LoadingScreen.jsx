import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const LOADING_STEPS = [
  'Woven with Certified Pure Silk...',
  'Hand-embroidering Zardozi & Moti...',
  'Sculpting Bespoke Silhouettes...',
  'Curating Atelier Edits...',
  'Welcome to AGVIA Boutique',
]

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [stepText, setStepText] = useState(LOADING_STEPS[0])
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    // Shorter, snappier loading if user already loaded in session
    const hasLoaded = sessionStorage.getItem('agvia_app_loaded')
    const totalDuration = hasLoaded ? 800 : 1500
    const intervalTime = 20
    const totalTicks = totalDuration / intervalTime
    const increment = 100 / totalTicks

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        
        // Update stage text based on progress
        const stepIndex = Math.min(
          Math.floor((next / 100) * LOADING_STEPS.length),
          LOADING_STEPS.length - 1
        )
        setStepText(LOADING_STEPS[stepIndex])

        if (next >= 100) {
          clearInterval(timer)
          sessionStorage.setItem('agvia_app_loaded', 'true')
          setTimeout(() => {
            setIsDone(true)
            if (onComplete) onComplete()
          }, 200)
          return 100
        }
        return next
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.02,
            transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#1A0B10] text-[#FAF7F2] select-none overflow-hidden font-body"
        >
          {/* Ambient Royal Gold & Burgundy Lighting Orbs */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#5A1020]/30 filter blur-[100px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#C9A45C]/25 filter blur-[100px] pointer-events-none animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#E8C7C3]/10 filter blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            {/* Logo Mark */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-24 h-24 mb-6 flex items-center justify-center"
            >
              {/* Outer spinning dashed ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-[#C9A45C]/40"
              />

              {/* Counter-spinning solid accent ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
                className="absolute inset-2 rounded-full border border-[#DFBE79]/30"
              />

              {/* Center Monogram / Logo */}
              <div className="w-16 h-16 rounded-full bg-[#2E050E] border border-[#C9A45C]/60 flex items-center justify-center shadow-[0_0_25px_rgba(201,164,92,0.35)] overflow-hidden p-2">
                <img src="/images/agvia-logo.png" alt="AGVIA" className="w-full h-full object-contain brightness-110" />
              </div>
            </motion.div>

            {/* Brand Title */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="space-y-1 mb-7"
            >
              <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.25em] uppercase font-bold text-[#FAF7F2]">
                AGVIA
              </h1>
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#C9A45C] font-semibold">
                Women's Wear Boutique · Jubilee Hills
              </p>
            </motion.div>

            {/* Progress Bar Container */}
            <div className="w-56 h-[3px] bg-white/10 rounded-full overflow-hidden p-[0.5px] border border-[#C9A45C]/30 relative mb-3">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#5A1020] via-[#C9A45C] to-[#E8C7C3] shadow-[0_0_10px_#C9A45C]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Live Progress Stage and Percentage */}
            <div className="flex items-center justify-between w-56 text-[10px] font-sans tracking-wider text-white/60 mb-2">
              <span className="truncate pr-2 text-[#C9A45C]">{stepText}</span>
              <span className="font-mono text-[#C9A45C] font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
