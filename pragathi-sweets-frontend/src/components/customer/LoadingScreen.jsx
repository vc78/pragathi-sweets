import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    const duration = 2000 // 2 seconds loader
    const intervalTime = 20
    const step = 100 / (duration / intervalTime)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step
        if (next >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setIsDone(true)
            if (onComplete) onComplete()
          }, 300)
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
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-chocolate text-cream select-none"
        >
          {/* Subtle slow glowing background spots */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-maroon/20 filter blur-[80px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/10 filter blur-[80px] animate-pulse" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Spinning Gold Sweet Outline */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 },
                rotate: { repeat: Infinity, duration: 8, ease: 'linear' },
              }}
              className="w-24 h-24 mb-8 flex items-center justify-center rounded-full border border-gold/45 relative"
            >
              <div className="absolute inset-2 rounded-full border border-dashed border-accent/40" />
              <div className="w-4 h-4 bg-accent rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
            </motion.div>

            {/* Premium Logo / Title */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center"
            >
              <h1 className="font-display text-3xl tracking-[0.25em] text-accent uppercase font-light">
                Pragathi
              </h1>
              <p className="font-body text-[10px] tracking-[0.4em] uppercase text-gold/60 mt-1">
                Sweets & Savouries
              </p>
            </motion.div>

            {/* Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 text-sm font-display font-light text-accent/80 tracking-widest"
            >
              {Math.round(progress)}%
            </motion.div>

            {/* Progress line */}
            <div className="w-40 h-[1px] bg-gold/20 mt-4 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
