import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const LOADING_STEPS = [
  'Simmering Pure Desi Ghee...',
  'Infusing Iranian Saffron & Cardamom...',
  'Draping Delicate Silver Varq...',
  'Handcrafting Artisanal Delights...',
  'Welcome to Pragathi Sweets',
]

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [stepText, setStepText] = useState(LOADING_STEPS[0])
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    // Shorter, snappier loading if user already loaded in session
    const hasLoaded = sessionStorage.getItem('ps_app_loaded')
    const totalDuration = hasLoaded ? 900 : 1800
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
          sessionStorage.setItem('ps_app_loaded', 'true')
          setTimeout(() => {
            setIsDone(true)
            if (onComplete) onComplete()
          }, 250)
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
            transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#1A0A0A] text-[#FFFDF8] select-none overflow-hidden"
        >
          {/* Ambient Royal Gold & Crimson Lighting Orbs */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#8B0000]/30 filter blur-[100px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#B8860B]/25 filter blur-[100px] pointer-events-none animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#E6C687]/10 filter blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            {/* Royal Gold Emblem */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative w-28 h-28 mb-8 flex items-center justify-center"
            >
              {/* Outer spinning dashed ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-[#B8860B]/40"
              />

              {/* Counter-spinning solid accent ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                className="absolute inset-2 rounded-full border border-[#E6C687]/30"
              />

              {/* Center Royal Icon / Monogram */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B0000] to-[#3A0505] border border-[#B8860B]/60 flex items-center justify-center shadow-[0_0_25px_rgba(184,134,11,0.4)]">
                <Sparkles size={26} className="text-[#FFD700] animate-pulse" />
              </div>
            </motion.div>

            {/* Brand Title */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-1.5 mb-8"
            >
              <h1 className="font-display text-3xl sm:text-4xl tracking-[0.22em] uppercase font-medium bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#E6C687] bg-clip-text text-transparent">
                PRAGATHI
              </h1>
              <p className="font-body text-[10px] tracking-[0.45em] uppercase text-[#E6C687]/75 font-semibold">
                Royal Confectionery · Est. 1984
              </p>
            </motion.div>

            {/* Progress Bar Container */}
            <div className="w-56 h-[3px] bg-white/10 rounded-full overflow-hidden p-[0.5px] border border-[#B8860B]/30 relative mb-4">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#FFF8DC] shadow-[0_0_10px_#FFD700]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Live Progress Stage and Percentage */}
            <div className="flex items-center justify-between w-56 text-[10px] font-body tracking-wider text-white/50 mb-2">
              <span className="truncate pr-2 text-[#E6C687]/80">{stepText}</span>
              <span className="font-mono text-[#FFD700] font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
