import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowRight,
  Star,
  Gift,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  Sparkles,
  Ticket,
  Calendar,
  Zap,
  BookOpen,
  Crown,
} from 'lucide-react'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import SweetCard from '../../components/customer/SweetCard'
import InteractiveItemsReel from '../../components/customer/InteractiveItemsReel'
import { productService } from '../../services/productService'
import api from '../../services/api'
import { useCart } from '../../hooks/useCart'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ProductGridSkeleton } from '../../components/common/SkeletonLoaders'

// ── Hero Slides ────────────────────────────────────────────
const HERO_SLIDES = [
  {
    image: '/images/hero_banner.jpg',
    tag: 'Elegance, Made for Every Occasion',
    title: 'AGVIA Luxury Boutique',
    subtitle: 'Discover sarees, kurtas, lehengas and dresses designed for your special moments.',
    cta: '/products',
    accent: '#C9A45C',
  },
  {
    image: '/images/classic_silk_saree.jpg',
    tag: 'The Signature Silk Edit',
    title: 'Classic Silk & Organza',
    subtitle: 'Heirloom drapes woven with subtle gold zari borders for festive celebrations.',
    cta: '/products?category=Sarees',
    accent: '#C9A45C',
  },
  {
    image: '/images/wedding_lehenga.jpg',
    tag: 'Bridal Couture',
    title: 'Royal Wedding Lehengas',
    subtitle: 'Exquisite bridal lehengas adorned with hand-stitched zardozi and double dupattas.',
    cta: '/products?category=Lehengas',
    accent: '#5A1020',
  },
  {
    image: '/images/anarkali_set.jpg',
    tag: 'Festive Occasion Wear',
    title: 'Embroidered Anarkalis',
    subtitle: 'Flowing regal kalis adorned with fine mirror-work and delicate thread embroidery.',
    cta: '/products?category=Anarkalis+%26+Kurtas',
    accent: '#7A1F32',
  },
]

// ── Realistic Trust Badge SVG Icons ────────────────────────
function IconSilk() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5" aria-hidden="true">
      <path d="M6 26 Q16 4 26 26" stroke="#E6C687" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M10 20 Q16 10 22 20" stroke="#E6C687" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
      <circle cx="16" cy="27" r="2" fill="#E6C687" opacity="0.8"/>
      <path d="M13 14 Q16 8 19 14" stroke="#E6C687" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4"/>
    </svg>
  )
}
function IconNeedle() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5" aria-hidden="true">
      <line x1="8" y1="24" x2="24" y2="8" stroke="#E6C687" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="22" cy="10" rx="3" ry="1.5" transform="rotate(-45 22 10)" stroke="#E6C687" strokeWidth="1.5" fill="none"/>
      <path d="M8 24 Q6 28 10 26 Z" fill="#E6C687" opacity="0.8"/>
      <path d="M14 18 Q17 13 20 16" stroke="#E6C687" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M11 21 Q14 16 17 19" stroke="#E6C687" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4"/>
    </svg>
  )
}
function IconTape() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5" aria-hidden="true">
      <rect x="4" y="13" width="24" height="6" rx="3" stroke="#E6C687" strokeWidth="1.5" fill="none"/>
      <line x1="8" y1="13" x2="8" y2="19" stroke="#E6C687" strokeWidth="1"/>
      <line x1="12" y1="13" x2="12" y2="19" stroke="#E6C687" strokeWidth="1"/>
      <line x1="16" y1="13" x2="16" y2="19" stroke="#E6C687" strokeWidth="1"/>
      <line x1="20" y1="13" x2="20" y2="19" stroke="#E6C687" strokeWidth="1"/>
      <line x1="24" y1="13" x2="24" y2="19" stroke="#E6C687" strokeWidth="1"/>
      <path d="M10 10 Q16 7 22 10" stroke="#E6C687" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6"/>
    </svg>
  )
}
function IconBox() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5" aria-hidden="true">
      <rect x="6" y="14" width="20" height="14" rx="1.5" stroke="#E6C687" strokeWidth="1.5" fill="none"/>
      <path d="M6 14 L16 9 L26 14" stroke="#E6C687" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <line x1="16" y1="9" x2="16" y2="28" stroke="#E6C687" strokeWidth="1" opacity="0.5"/>
      <path d="M12 11 Q16 7 20 11" stroke="#E6C687" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="16" cy="10" r="1.5" fill="#E6C687" opacity="0.9"/>
    </svg>
  )
}

// ── Trust Badges ───────────────────────────────────────────
const TRUST = [
  { Icon: IconSilk, label: 'Pure Handloom Silk', sub: 'Silk Mark Certified' },
  { Icon: IconNeedle, label: 'Zardozi Handcraft', sub: 'Master Atelier Embroidery' },
  { Icon: IconTape, label: 'Made-to-Measure', sub: 'Bespoke Custom Fitting' },
  { Icon: IconBox, label: 'Luxury Keepsake Box', sub: 'Complimentary Trousseau Wrap' },
]

// ── Testimonials ───────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Radhika Reddy', city: 'Hyderabad', rating: 5,
    quote: "My wedding reception lehenga from AGVIA drew endless compliments. The zardozi intricacy and bespoke drape were completely unmatched.",
    avatar: '/images/wedding_lehenga.jpg',
  },
  {
    name: 'Meera Nambiar', city: 'Bengaluru', rating: 5,
    quote: "The pure silk saree I received feels like an heirloom. The weight of the silk and real gold zari border are extraordinary.",
    avatar: '/images/classic_silk_saree.jpg',
  },
  {
    name: 'Pooja Singhania', city: 'Mumbai', rating: 5,
    quote: "AGVIA's concierge team assisted me with made-to-measure styling and dispatch. The velvet keepsake packaging was royal.",
    avatar: '/images/anarkali_set.jpg',
  },
]

// ── Section Header with Strict Spacing Hierarchy ───────────
function SectionHeader({ tag, title, subtitle }) {
  return (
    <div className="section-header">
      <span className="section-eyebrow">
        ✦ {tag} ✦
      </span>
      <h2 className="section-title">
        {title}
      </h2>
      {subtitle && (
        <p className="section-description">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default function Home() {
  const [bestsellers, setBestsellers] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  // Pragathi Circle Subscription state
  const [emailInput, setEmailInput] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [circleMember, setCircleMember] = useState(() => {
    try {
      const saved = localStorage.getItem('ps_circle_member')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [copiedCode, setCopiedCode] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!emailInput || !emailInput.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }

    setSubscribing(true)
    try {
      const { data } = await api.post('/newsletter/subscribe', { email: emailInput })
      if (data?.success && data?.data) {
        const memberData = data.data
        setCircleMember(memberData)
        localStorage.setItem('ps_circle_member', JSON.stringify(memberData))
        toast.success(data.message || 'Welcome to the Pragathi Circle! 🎉', {
          icon: '👑',
          style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '14px' }
        })
      }
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Could not process subscription. Please try again.')
    } finally {
      setSubscribing(false)
    }
  }

  const handleCopyCode = () => {
    const code = circleMember?.couponCode || 'CIRCLE15'
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    toast.success(`Coupon code ${code} copied! Ready to use at checkout.`, {
      icon: '✨',
      style: { background: '#5C1A2B', color: '#FBF3E7', borderRadius: '12px' }
    })
    setTimeout(() => setCopiedCode(false), 2500)
  }

  // Hero state
  const [heroIdx, setHeroIdx] = useState(0)
  const [heroDir, setHeroDir] = useState(1)
  const heroTimer = useRef(null)

  // Scroll parallax
  const { scrollY } = useScroll()
  const yText = useTransform(scrollY, [0, 400], [0, 50])
  const yBg = useTransform(scrollY, [0, 400], [0, 70])

  useEffect(() => {
    setLoading(true)
    productService.getAll().then((list) => {
      const safeList = Array.isArray(list) ? list : []
      const best = safeList.filter(p => p.bestseller)
      setBestsellers(best.length > 0 ? best.slice(0, 4) : safeList.slice(0, 4))
      setAllProducts(safeList.slice(0, 8))
    }).catch((err) => {
      console.warn('Could not load products:', err)
      setBestsellers([])
      setAllProducts([])
    })
    .finally(() => setLoading(false))
  }, [])

  const startHeroTimer = () => {
    clearInterval(heroTimer.current)
    heroTimer.current = setInterval(() => {
      setHeroDir(1)
      setHeroIdx(i => (i + 1) % HERO_SLIDES.length)
    }, 5500)
  }

  useEffect(() => {
    startHeroTimer()
    return () => clearInterval(heroTimer.current)
  }, [])

  const gotoSlide = (idx) => {
    setHeroDir(idx > heroIdx ? 1 : -1)
    setHeroIdx(idx)
    startHeroTimer()
  }
  const prevSlide = () => { setHeroDir(-1); setHeroIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length); startHeroTimer() }
  const nextSlide = () => { setHeroDir(1); setHeroIdx(i => (i + 1) % HERO_SLIDES.length); startHeroTimer() }

  const handleAdd = (product) => {
    addToCart(product)
    toast.success(`${product.name} added to cart!`, { style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' } })
  }

  const slide = HERO_SLIDES[heroIdx]

  return (
    <div className="min-h-full bg-[#FFFDF8] overflow-x-hidden">
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[500px] md:min-h-[580px] lg:min-h-[640px] max-h-[760px] flex items-center overflow-hidden">
        {/* BG Image */}
        <AnimatePresence mode="sync">
          <motion.div
            key={heroIdx}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04, x: heroDir * 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.97, x: -heroDir * 40 }}
            transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          >
            <motion.img
              src={slide.image}
              alt={slide.title}
              loading={heroIdx === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ y: yBg }}
            />
            {/* Layered overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <motion.div
          style={{ y: yText }}
          className="relative z-10 w-full container-luxury py-14 md:py-18"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIdx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-2xl"
            >
              <span className="inline-block font-body text-[9px] tracking-[0.45em] uppercase font-bold text-[#E6C687] mb-3.5 border border-[#E6C687]/40 px-3.5 py-1 rounded-full backdrop-blur-sm">
                ✦ {slide.tag}
              </span>
              <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-bold text-white leading-[1.02] mb-3.5">
                {slide.title}
              </h1>
              <p className="font-body text-xs sm:text-sm md:text-base text-white/80 tracking-wide mb-6 max-w-lg leading-relaxed">
                {slide.subtitle}
              </p>
              <div className="flex flex-wrap gap-3.5">
                <Link to={slide.cta} className="btn-primary">
                  Shop Now <ArrowRight size={14} />
                </Link>
                <Link to="/products" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3 rounded-full hover:border-[#E6C687] hover:text-[#E6C687] transition-all text-xs tracking-widest uppercase backdrop-blur-sm">
                  All Products
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Arrows */}
        <button onClick={prevSlide} aria-label="Previous Slide" className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/25 hover:scale-105 transition-all flex items-center justify-center backdrop-blur-sm">
          <ChevronLeft size={18} />
        </button>
        <button onClick={nextSlide} aria-label="Next Slide" className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/25 hover:scale-105 transition-all flex items-center justify-center backdrop-blur-sm">
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => gotoSlide(i)} aria-label={`Slide ${i + 1}`} className={`transition-all duration-300 rounded-full ${i === heroIdx ? 'w-7 h-1.5 bg-[#E6C687]' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute bottom-6 right-8 z-20 font-display text-white/40 text-[11px] tracking-widest">
          {String(heroIdx + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
        </div>
      </section>

      {/* ══ TRUST STRIP ═══════════════════════════════════════════ */}
      <section className="bg-[#8B0000] text-white py-5 md:py-6 border-y border-[#B8860B]/20">
        <div className="container-luxury grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-0">
          {TRUST.map(({ Icon, label, sub }, i) => (
            <div key={i} className={`flex items-center gap-3.5 ${i < 3 ? 'md:border-r md:border-white/10 md:pr-8 md:mr-4' : ''}`}>
              <div className="w-10 h-10 rounded-full border border-[#E6C687]/40 bg-white/5 flex items-center justify-center shrink-0 shadow-inner">
                <Icon />
              </div>
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }} className="text-[13px] font-bold text-white tracking-wide leading-tight">{label}</p>
                <p style={{ fontFamily: "'Lato', 'Inter', sans-serif" }} className="text-[10px] text-[#E6C687]/75 tracking-widest uppercase mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ INTERACTIVE COLLECTION SCROLLER ══════════════════════ */}
      <InteractiveItemsReel items={allProducts} />

      {/* ══ BESTSELLERS (OUR CRAFT) ══════════════════════════════ */}
      <section className="section">
        <div className="container-luxury">
          <SectionHeader
            tag="The Signature Edit"
            title="Bestselling Silhouettes"
            subtitle="Each silhouette is hand-loomed and embroidered by master artisans. Certified pure silks and bespoke couture."
          />
          {loading && bestsellers.length === 0 ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {bestsellers.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <SweetCard key={p.id} product={p} onAdd={() => handleAdd(p)} />
                </motion.div>
              ))}
            </div>
          )}
          <div className="section-cta">
            <Link to="/products" className="btn-outline">
              View Full Collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>


      {/* ══ ALL PRODUCTS ══════════════════════════════════════════ */}
      <section className="section">
        <div className="container-luxury">
          <SectionHeader
            tag="The Atelier Edit"
            title="Every Drape, Perfected"
            subtitle="From heirloom bridal drapes to contemporary soirée gowns — crafted for moments that endure."
          />
          {allProducts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {allProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                >
                  <SweetCard key={p.id} product={p} onAdd={() => handleAdd(p)} />
                </motion.div>
              ))}
            </div>
          )}
          {/* Shop All Products CTA button */}
          <div className="section-cta">
            <Link to="/products" className="btn-primary">
              Shop All Silhouettes <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ BRIDAL TROUSSEAU PROMO ════════════════════════════════ */}
      <section className="container-luxury my-6 md:my-8">
        <div className="rounded-3xl overflow-hidden relative shadow-xl min-h-[400px] md:min-h-[460px] flex items-center bg-[#5A1020]">
          <img
            src="/images/wedding_lehenga.jpg"
            alt="Bridal Trousseau Curation"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
          />
          {/* Gradient overlay on left half so text is readable while image shines on right half */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5A1020] via-[#5A1020]/80 sm:via-[#5A1020]/50 to-transparent sm:w-3/4" />
          
          <div className="relative z-10 p-8 sm:p-12 md:p-16 max-w-xl">
            <span className="section-eyebrow text-[#C9A45C]">✦ Bespoke Trousseau Curation</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight mb-4">
              Bridal Trousseau,<br />Elevated.
            </h2>
            <p className="font-sans text-xs md:text-sm text-white/90 mb-7 leading-relaxed max-w-md">
              Handpicked heirloom silks and hand-embroidered zardozi ensembles delivered in a bespoke keepsake presentation. Includes complimentary made-to-measure tailoring.
            </p>
            <div className="flex gap-3.5 flex-wrap">
              <Link to="/products?category=Lehengas" className="inline-flex items-center gap-2 bg-[#C9A45C] hover:bg-white text-[#211D1E] font-bold px-7 py-3 rounded-full text-xs tracking-widest uppercase transition-all shadow-md active:scale-95">
                Explore Trousseau <Crown size={14} />
              </Link>
              <Link to="/products?category=Sarees" className="inline-flex items-center gap-2 border-2 border-white/50 hover:border-[#C9A45C] text-white hover:text-[#C9A45C] font-semibold px-7 py-3 rounded-full text-xs tracking-widest uppercase transition-all backdrop-blur-sm">
                Heirloom Sarees
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS (PATRON EXPERIENCES) ═════════════════════ */}
      <section className="section">
        <div className="container-luxury">
          <SectionHeader
            tag="Patron Experiences"
            title="Voices of Elegance"
            subtitle="From royal wedding galas to intimate soirees — draped in timeless AGVIA grace."
          />
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-white border border-[#C9A45C]/20 rounded-3xl p-6 md:p-7 hover:shadow-[0_12px_40px_rgba(201,164,92,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-3.5">
                    {[...Array(t.rating)].map((_, s) => (
                      <Star key={s} size={13} className="text-[#C9A45C] fill-[#C9A45C]" />
                    ))}
                  </div>
                  <p className="font-sans text-xs md:text-sm text-[#211D1E]/80 leading-relaxed italic mb-5">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-[#C9A45C]/15">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-[#C9A45C]/30 shrink-0" />
                  <div>
                    <p className="font-serif text-xs md:text-sm font-bold text-[#5A1020]">{t.name}</p>
                    <p className="font-sans text-[10px] text-[#211D1E]/60 tracking-wider">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ AGVIA ATELIER CIRCLE & VIP PRIVILEGES ════════════════════════ */}
      <section className="container-luxury my-4 md:my-6 mb-12 md:mb-16">
        <div className="rounded-3xl bg-[#5A1020] overflow-hidden relative py-10 md:py-14 px-6 md:px-12 shadow-2xl border border-[#C9A45C]/30">
          <div className="absolute inset-0 opacity-15 bg-[url('/images/hero_banner.jpg')] bg-cover bg-center" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A45C]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C9A45C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <span className="section-eyebrow text-[#C9A45C]">
              ✦ VIP ATELIER PRIVILEGES ✦
            </span>

            {!circleMember ? (
              <div>
                <h2 className="font-serif text-2xl md:text-4xl text-white font-bold mb-2.5 tracking-tight">
                  Join the AGVIA Atelier Circle
                </h2>
                <p className="font-sans text-xs md:text-sm text-white/80 mb-6 max-w-lg mx-auto leading-relaxed">
                  First access to seasonal bridal drops, bespoke made-to-measure previews, and private concierge styling privileges.
                </p>

                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row max-w-md mx-auto shadow-xl rounded-full bg-white/10 p-1 border border-white/20 backdrop-blur-md">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 bg-transparent text-white placeholder-white/50 text-xs md:text-sm tracking-wide font-sans px-5 py-3 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="bg-[#C9A45C] hover:bg-white text-[#211D1E] font-bold px-7 py-3 rounded-full text-xs tracking-widest uppercase transition-all duration-300 shrink-0 shadow-md active:scale-95 disabled:opacity-70 mt-2 sm:mt-0 flex items-center justify-center gap-2"
                  >
                    {subscribing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#211D1E] border-t-transparent rounded-full animate-spin" />
                        <span>Joining...</span>
                      </>
                    ) : (
                      <span>JOIN</span>
                    )}
                  </button>
                </form>
                <p className="text-[10px] text-[#C9A45C]/80 mt-3 tracking-wide">
                  Instant 15% Welcome Couture Privilege Credit unlocked immediately upon enrollment.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A45C]/15 border border-[#C9A45C]/40 text-[#C9A45C] text-xs font-semibold tracking-wider uppercase">
                  <Sparkles size={13} className="text-[#C9A45C]" />
                  <span>AGVIA Atelier VIP Member</span>
                </div>

                <h2 className="font-serif text-2xl md:text-3xl text-white font-bold tracking-tight">
                  Welcome to the AGVIA Atelier
                </h2>

                <p className="text-xs text-white/85 max-w-lg mx-auto">
                  Privileges activated for <span className="font-bold text-[#C9A45C]">{circleMember.email}</span>. Use your personal promo code below for your next couture purchase.
                </p>

                {/* Special Voucher Card */}
                <div className="bg-gradient-to-r from-[#2A0810] via-[#4A0D1A] to-[#2A0810] border-2 border-dashed border-[#C9A45C]/60 rounded-2xl p-5 max-w-md mx-auto shadow-2xl relative overflow-hidden text-left">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <span className="text-[9px] text-[#C9A45C] tracking-[0.2em] uppercase font-bold block mb-0.5">
                        VIP WELCOME VOUCHER
                      </span>
                      <span className="font-mono text-xl md:text-2xl font-bold text-white tracking-widest">
                        {circleMember.couponCode || 'AGVIA15'}
                      </span>
                    </div>

                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C9A45C] hover:bg-white text-[#211D1E] font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 shrink-0"
                    >
                      {copiedCode ? <Check size={13} className="text-green-700" /> : <Copy size={13} />}
                      <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <div className="pt-2.5 flex items-center justify-between text-[10px] text-white/70">
                    <span className="flex items-center gap-1 text-[#C9A45C]">
                      <Calendar size={12} />
                      {circleMember.validTill
                        ? new Date(circleMember.validTill).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Active for 30 Days'}
                    </span>
                    <span>Min spend ₹{circleMember.minOrderAmount || 1999}</span>
                  </div>
                </div>

                {/* Unlocked Exclusive Perks */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left pt-1">
                  {[
                    { icon: Ticket, title: '15% First Privilege', desc: 'On orders over ₹1,999' },
                    { icon: Gift, title: 'Keepsake Box', desc: 'Complimentary luxury wrap' },
                    { icon: Zap, title: 'Express Dispatch', desc: 'White-glove courier delivery' },
                    { icon: BookOpen, title: 'Atelier Styling', desc: 'Complimentary consultation' },
                  ].map((perk, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/15 p-3 rounded-xl">
                      <perk.icon size={15} className="text-[#C9A45C] mb-1.5" />
                      <h4 className="font-serif font-bold text-[11px] text-white leading-tight mb-0.5">{perk.title}</h4>
                      <p className="text-[10px] text-white/60 leading-tight">{perk.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Action Bar */}
                <div className="pt-2 flex items-center justify-center gap-4">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C9A45C] hover:bg-white text-[#211D1E] font-bold text-xs tracking-widest uppercase transition-all shadow-md active:scale-95"
                  >
                    <span>Shop & Redeem 15%</span>
                    <ArrowRight size={13} />
                  </Link>

                  <button
                    onClick={() => {
                      localStorage.removeItem('ps_circle_member')
                      setCircleMember(null)
                      setEmailInput('')
                    }}
                    className="text-white/60 hover:text-white text-xs underline transition-colors"
                  >
                    Enroll another email
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
