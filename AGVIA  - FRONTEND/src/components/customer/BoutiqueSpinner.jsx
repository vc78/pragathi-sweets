import { motion } from 'framer-motion'

export default function BoutiqueSpinner() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center bg-[#FFFDF8] text-[#3A2D23] select-none">
      <div className="relative flex flex-col items-center">
        {/* Spinner ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-2 border-[#B8860B]/20 border-t-[#8B0000] relative mb-4"
        />
        <span className="font-display text-[9px] tracking-[0.3em] font-bold text-[#B8860B] uppercase">✦ Loading Boutique ✦</span>
      </div>
    </div>
  )
}
