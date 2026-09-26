import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Crown,
} from 'lucide-react'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import SweetCard from '../../components/customer/SweetCard'
import InteractiveItemsReel from '../../components/customer/InteractiveItemsReel'
import BestsellerCurvedCarousel from '../../components/customer/BestsellerCurvedCarousel'
import { productService } from '../../services/productService'
import { useCart } from '../../hooks/useCart'
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
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
      setBestsellers(best.length > 0 ? best.slice(0, 10) : safeList.slice(0, 10))
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
    <div className="relative min-h-full bg-[#FFFDF8] overflow-x-hidden pb-14 sm:pb-0">
      {/* ══ GLOBAL LUXURY BOUTIQUE BACKGROUND TEXTURE (STATIC & OPTIMIZED) ══ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center bg-fixed opacity-[0.16] mix-blend-multiply"
          style={{
            backgroundImage: "url('/images/boutique_luxury_bg.jpg')",
            filter: 'contrast(1.04) saturate(1.08)',
          }}
        />
        {/* Soft luxury ivory gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF8]/40 via-transparent to-[#FFFDF8]/70 pointer-events-none" />
      </div>

      {/* ══ AMBIENT GLOW SPOTLIGHT (STATIC SOFT ACCENT) ══ */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#C9A45C]/08 via-[#8B0000]/03 to-transparent rounded-full blur-2xl pointer-events-none z-0" />

      {/* Floating Botanical / Lotus Accents */}
      <div className="fixed top-1/4 left-6 w-32 h-32 opacity-15 pointer-events-none hidden xl:block text-[#C9A45C] z-0">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
          <circle cx="50" cy="50" r="1.5" fill="currentColor" />
          <path d="M50 15 C42 32 25 42 15 50 C25 58 42 68 50 85 C58 68 75 58 85 50 C75 42 58 32 50 15 Z" />
        </svg>
      </div>

      <div className="fixed bottom-1/4 right-8 w-36 h-36 opacity-15 pointer-events-none hidden xl:block text-[#C9A45C] z-0">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
          <circle cx="50" cy="50" r="2" fill="currentColor" />
          <path d="M50 18 C44 32 30 42 20 48 C30 54 44 64 50 78 C56 64 70 54 80 48 C70 42 56 32 50 18 Z" />
        </svg>
      </div>

      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[460px] sm:min-h-[520px] md:min-h-[580px] lg:h-[calc(100vh-172px)] lg:min-h-[620px] lg:max-h-[760px] xl:min-h-[660px] xl:max-h-[820px] 2xl:min-h-[700px] flex items-center overflow-hidden bg-[#240B13]">
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
              className="absolute -top-8 -bottom-8 w-full h-[calc(100%+64px)] object-cover object-center"
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
          className="relative z-10 w-full container-luxury py-8 sm:py-10 md:py-12"
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
              <span className="inline-block font-body text-[8.5px] tracking-[0.35em] uppercase font-bold text-[#E6C687] mb-2 border border-[#E6C687]/40 px-3 py-0.5 rounded-full backdrop-blur-sm">
                ✦ {slide.tag}
              </span>
              <h1 className="font-display text-3xl sm:text-5xl xl:text-6xl font-bold text-white leading-[1.05] mb-2.5">
                {slide.title}
              </h1>
              <p className="font-body text-xs sm:text-sm text-white/80 tracking-wide mb-4 max-w-lg leading-relaxed">
                {slide.subtitle}
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link to={slide.cta} className="btn-primary">
                  Shop Now <ArrowRight size={14} />
                </Link>
                <Link to="/products" className="inline-flex items-center gap-1.5 border border-white/40 text-white font-semibold px-5 py-2.5 rounded-full hover:border-[#E6C687] hover:text-[#E6C687] transition-all text-xs tracking-wider uppercase backdrop-blur-sm">
                  All Products
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Arrows */}
        <button onClick={prevSlide} aria-label="Previous Slide" className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/25 hover:scale-105 transition-all flex items-center justify-center backdrop-blur-sm">
          <ChevronLeft size={16} />
        </button>
        <button onClick={nextSlide} aria-label="Next Slide" className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/25 hover:scale-105 transition-all flex items-center justify-center backdrop-blur-sm">
          <ChevronRight size={16} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => gotoSlide(i)} aria-label={`Slide ${i + 1}`} className={`transition-all duration-300 rounded-full ${i === heroIdx ? 'w-6 h-1.5 bg-[#E6C687]' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute bottom-4 right-6 z-20 font-display text-white/40 text-[10px] tracking-widest">
          {String(heroIdx + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
        </div>
      </section>

      {/* ══ TRUST STRIP ═══════════════════════════════════════════ */}
      <section className="bg-[#8B0000] text-white py-3.5 sm:py-4 border-y border-[#B8860B]/20">
        <div className="container-luxury grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          {TRUST.map(({ Icon, label, sub }, i) => (
            <div key={i} className={`flex items-center gap-2.5 sm:gap-3 ${i < 3 ? 'md:border-r md:border-white/10 md:pr-6 md:mr-4' : ''}`}>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#E6C687]/40 bg-white/5 flex items-center justify-center shrink-0 shadow-inner">
                <Icon />
              </div>
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }} className="text-xs sm:text-[13px] font-bold text-white tracking-wide leading-tight">{label}</p>
                <p style={{ fontFamily: "'Lato', 'Inter', sans-serif" }} className="text-[9.5px] text-[#E6C687]/75 tracking-wider uppercase mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ INTERACTIVE COLLECTION SCROLLER ══════════════════════ */}
      <InteractiveItemsReel items={allProducts} />

      {/* ══ BESTSELLERS (THE SIGNATURE EDIT) - 3D CURVED CAROUSEL ══ */}
      <BestsellerCurvedCarousel bestsellers={bestsellers} onAdd={handleAdd} />


      {/* ══ ALL PRODUCTS ══════════════════════════════════════════ */}
      <section className="section relative z-10">
        <div className="container-luxury">
          <SectionHeader
            tag="The Atelier Edit"
            title="Every Drape, Perfected"
            subtitle="From heirloom bridal drapes to contemporary soirée gowns — crafted for moments that endure."
          />
          {allProducts.length > 0 && (
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5 lg:gap-4">
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
      <section className="container-luxury my-4 md:my-6 relative z-10">
        <div className="rounded-2xl overflow-hidden relative shadow-lg min-h-[320px] md:min-h-[380px] flex items-center bg-[#5A1020]">
          <img
            src="/images/wedding_lehenga.jpg"
            alt="Bridal Trousseau Curation"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
          />
          {/* Gradient overlay on left half so text is readable while image shines on right half */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5A1020] via-[#5A1020]/80 sm:via-[#5A1020]/50 to-transparent sm:w-3/4" />
          
          <div className="relative z-10 p-5 sm:p-8 md:p-10 max-w-xl">
            <span className="section-eyebrow text-[#C9A45C]">✦ Bespoke Trousseau Curation</span>
            <h2 className="font-serif text-2xl md:text-4xl text-white font-bold leading-tight mb-2.5">
              Bridal Trousseau,<br />Elevated.
            </h2>
            <p className="font-sans text-xs md:text-sm text-white/90 mb-4 leading-normal max-w-md">
              Handpicked heirloom silks and hand-embroidered zardozi ensembles delivered in a bespoke keepsake presentation. Includes complimentary made-to-measure tailoring.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <Link to="/products?category=Lehengas" className="inline-flex items-center gap-1.5 bg-[#C9A45C] hover:bg-white text-[#211D1E] font-bold px-5 py-2.5 rounded-full text-xs tracking-wider uppercase transition-all shadow-md active:scale-95">
                Explore Trousseau <Crown size={14} />
              </Link>
              <Link to="/products?category=Sarees" className="inline-flex items-center gap-1.5 border border-white/50 hover:border-[#C9A45C] text-white hover:text-[#C9A45C] font-semibold px-5 py-2.5 rounded-full text-xs tracking-wider uppercase transition-all backdrop-blur-sm">
                Heirloom Sarees
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS (PATRON EXPERIENCES) ═════════════════════ */}
      <section className="section relative z-10">
        <div className="container-luxury">
          <SectionHeader
            tag="Patron Experiences"
            title="Voices of Elegance"
            subtitle="From royal wedding galas to intimate soirees — draped in timeless AGVIA grace."
          />
          <div className="grid md:grid-cols-3 gap-3.5 sm:gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-white border border-[#C9A45C]/20 rounded-2xl p-4 sm:p-5 hover:shadow-[0_12px_40px_rgba(201,164,92,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-2.5">
                    {[...Array(t.rating)].map((_, s) => (
                      <Star key={s} size={12} className="text-[#C9A45C] fill-[#C9A45C]" />
                    ))}
                  </div>
                  <p className="font-sans text-xs sm:text-[13px] text-[#211D1E]/80 leading-normal italic mb-3">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-2.5 pt-3 border-t border-[#C9A45C]/15">
                  <img src={t.avatar} alt={t.name} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-[#C9A45C]/30 shrink-0" />
                  <div>
                    <p className="font-serif text-xs sm:text-sm font-bold text-[#5A1020]">{t.name}</p>
                    <p className="font-sans text-[9.5px] text-[#211D1E]/60 tracking-wider">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
