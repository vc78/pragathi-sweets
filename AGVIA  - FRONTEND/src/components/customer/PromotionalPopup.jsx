import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  X, Sparkles, Copy, Check, ArrowRight,
  ShieldCheck, Flame, Gift, Star, Truck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

// ── Floating sparkle particles ────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  size: Math.random() * 5 + 3,
  x: Math.random() * 100,
  delay: Math.random() * 3,
  duration: Math.random() * 4 + 4,
  color: i % 3 === 0 ? '#E6C687' : i % 3 === 1 ? '#ffffff' : '#FFD700',
}))

// ── Trust pillars ─────────────────────────────────────────────────────────────
const TRUST = [
  { icon: ShieldCheck, label: 'Pure Handloom Silk',  sub: 'Silk Mark Certified' },
  { icon: Sparkles,    label: 'Zardozi Handcraft',   sub: 'Master Embroidered' },
  { icon: Gift,        label: 'Luxury Keepsake Box', sub: 'Trousseau Wrap' },
  { icon: Truck,       label: 'Express Courier',     sub: 'Orders ≥ ₹999' },
]

// ── Offer data ─────────────────────────────────────────────────────────────────
const OFFER = {
  code:       'CIRCLE15',
  discount:   '15% OFF',
  headline:   'Haute Circle Welcome',
  subline:    'On Handcrafted Sarees, Lehengas & Couture Ensembles',
  validity:   'Valid on orders above ₹499 · First Purchase',
}

export default function PromotionalPopup() {
  const [isOpen,  setIsOpen]  = useState(false)
  const [copied,  setCopied]  = useState(false)
  const [hovered, setHovered] = useState(false)
  const prefersReducedMotion  = useReducedMotion()
  const timerRef              = useRef(null)

  /* ── show once per session ── */
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('agvia_promo_seen')
    if (!hasSeen) {
      timerRef.current = setTimeout(() => setIsOpen(true), 1400)
    }
    return () => clearTimeout(timerRef.current)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem('agvia_promo_seen', 'true')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(OFFER.code).catch(() => {})
    setCopied(true)
    toast.success(`Code ${OFFER.code} copied! 🎉`, {
      style: {
        background:   '#3A2D23',
        color:        '#FFFDF8',
        border:       '1px solid #B8860B',
        borderRadius: '14px',
        fontWeight:   'bold',
        fontSize:     '13px',
      },
      icon: '🪄',
      duration: 3000,
    })
    setTimeout(() => setCopied(false), 2800)
  }

  /* ── animation variants ── */
  const backdropV = {
    hidden: { opacity: 0 },
    show:   { opacity: 1 },
    exit:   { opacity: 0, transition: { duration: 0.25 } },
  }
  const cardV = {
    hidden: { scale: 0.88, opacity: 0, y: 32 },
    show: {
      scale:   1,
      opacity: 1,
      y:       0,
      transition: { type: 'spring', damping: 22, stiffness: 280, delay: 0.05 },
    },
    exit: {
      scale:   0.92,
      opacity: 0,
      y:       24,
      transition: { duration: 0.22, ease: 'easeIn' },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none">

          {/* ── Backdrop ── */}
          <motion.div
            variants={backdropV}
            initial="hidden" animate="show" exit="exit"
            onClick={handleClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-[6px]"
          />

          {/* ── Modal Card ── */}
          <motion.div
            variants={cardV}
            initial="hidden" animate="show" exit="exit"
            className="relative w-full max-w-md z-10 rounded-[28px] overflow-hidden
                       shadow-[0_32px_80px_-8px_rgba(0,0,0,0.55)]
                       border border-[#B8860B]/25"
            style={{ background: 'linear-gradient(160deg, #1a0a00 0%, #2D0A0A 45%, #1B1228 100%)' }}
          >

            {/* ── Close ── */}
            <button
              onClick={handleClose}
              className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full
                         bg-white/10 hover:bg-white/20 text-white/70 hover:text-white
                         flex items-center justify-center transition-all duration-200
                         border border-white/10 hover:border-white/25"
              aria-label="Close promotion"
            >
              <X size={15} />
            </button>

            {/* ── Floating particles ── */}
            {!prefersReducedMotion && PARTICLES.map(p => (
              <motion.div
                key={p.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width:  p.size,
                  height: p.size,
                  left:   `${p.x}%`,
                  top:    '-8px',
                  background: p.color,
                  filter: 'blur(0.5px)',
                  boxShadow: `0 0 ${p.size * 2}px ${p.color}88`,
                }}
                animate={{
                  y:       ['0%', '120%'],
                  opacity: [0, 0.9, 0.6, 0],
                  rotate:  [0, 360],
                }}
                transition={{
                  duration: p.duration,
                  delay:    p.delay,
                  repeat:   Infinity,
                  ease:     'linear',
                }}
              />
            ))}

            {/* ── Header Banner ── */}
            <div
              className="relative px-8 pt-9 pb-8 text-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #8B0000 0%, #4a0810 40%, #1e0750 100%)',
              }}
            >
              {/* shimmer sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,215,100,0.10) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.5 }}
              />

              {/* badge */}
              <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.35em] font-bold
                               uppercase text-[#E6C687] bg-white/10 px-3.5 py-1 rounded-full
                               border border-[#E6C687]/30 mb-4 backdrop-blur-sm">
                <Sparkles size={10} />
                Boutique Welcome Perk
              </span>

              {/* big discount */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25, type: 'spring', stiffness: 260 }}
                className="font-display text-6xl font-extrabold leading-none mb-2"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #E6C687 40%, #FFF8DC 60%, #B8860B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 18px rgba(232,196,120,0.5))',
                }}
              >
                {OFFER.discount}
              </motion.div>

              <p className="font-display text-white/90 text-sm font-medium tracking-wide">
                {OFFER.headline}
              </p>
              <p className="font-body text-white/55 text-[11px] mt-1 tracking-wide leading-snug">
                {OFFER.subline}
              </p>
            </div>

            {/* ── Body ── */}
            <div className="px-6 py-6 space-y-5">

              {/* Trust grid */}
              <div className="grid grid-cols-4 gap-2">
                {TRUST.map(({ icon: Icon, label, sub }) => (
                  <motion.div
                    key={label}
                    whileHover={{ y: -3, scale: 1.04 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="flex flex-col items-center text-center p-2 rounded-2xl
                               bg-white/5 border border-white/8 hover:border-[#B8860B]/40
                               hover:bg-[#B8860B]/10 transition-colors duration-200 cursor-default"
                  >
                    <Icon size={15} className="text-[#E6C687] mb-1.5" />
                    <span className="text-[9px] font-bold text-white/80 leading-tight block">{label}</span>
                    <span className="text-[8px] text-white/40 leading-tight mt-0.5">{sub}</span>
                  </motion.div>
                ))}
              </div>

              {/* Star rating bar */}
              <div className="flex items-center justify-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-[#E6C687] text-[#E6C687]" />
                  ))}
                </div>
                <span className="text-[10px] text-white/50 font-body">
                  4.9 · 1,200+ Happy Customers
                </span>
              </div>

              {/* Coupon box */}
              <motion.div
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                whileHover={{ scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="relative flex items-center justify-between p-4 rounded-2xl
                           border-2 border-dashed border-[#B8860B]/50
                           bg-gradient-to-r from-[#2D1B00]/60 to-[#1a0a0a]/60
                           hover:border-[#B8860B]/80 transition-colors duration-200 overflow-hidden"
              >
                {/* animated glow when hovered */}
                <AnimatePresence>
                  {hovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(184,134,11,0.12) 0%, transparent 70%)' }}
                    />
                  )}
                </AnimatePresence>

                <div className="relative">
                  <span className="text-[8px] uppercase tracking-[0.25em] text-[#B8860B] font-bold block mb-0.5">
                    Use at Checkout
                  </span>
                  <span className="font-mono text-2xl font-black text-[#E6C687] tracking-widest">
                    {OFFER.code}
                  </span>
                </div>

                <motion.button
                  onClick={handleCopy}
                  whileTap={{ scale: 0.93 }}
                  className="relative flex items-center gap-2 font-bold text-[11px] uppercase
                             tracking-wider px-5 py-2.5 rounded-xl transition-all duration-200
                             shadow-lg overflow-hidden"
                  style={{
                    background: copied
                      ? 'linear-gradient(135deg, #166534, #14532d)'
                      : 'linear-gradient(135deg, #8B0000, #a61515)',
                    color: '#fff',
                  }}
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-green-300" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy Code
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Validity note */}
              <p className="text-center text-[9px] text-white/35 font-body tracking-wide">
                ⏳ {OFFER.validity}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-1">
                <Link
                  to="/products"
                  onClick={handleClose}
                  className="flex-1 inline-flex items-center justify-center gap-2
                             font-bold text-[11px] uppercase tracking-[0.12em]
                             py-3.5 rounded-full transition-all duration-300
                             hover:opacity-90 active:scale-[0.97] shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #8B0000 0%, #B8000A 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 20px rgba(139,0,0,0.45)',
                  }}
                >
                  Shop Now <ArrowRight size={13} />
                </Link>
                <button
                  onClick={handleClose}
                  className="sm:w-auto text-[11px] text-white/40 hover:text-white/70
                             font-medium py-2 px-4 transition-colors duration-200
                             rounded-full hover:bg-white/5"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
