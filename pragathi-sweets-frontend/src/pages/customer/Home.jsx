import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowRight, Star, Flame, Gift, ShieldCheck, Clock, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import SweetCard from '../../components/customer/SweetCard'
import { productService } from '../../services/productService'
import { useCart } from '../../hooks/useCart'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ProductGridSkeleton } from '../../components/common/SkeletonLoaders'

// ── Hero Slides ────────────────────────────────────────────
const HERO_SLIDES = [
  {
    image: '/images/pexels-divigraphy-8624624.jpg',
    tag: 'Signature Collection',
    title: 'Kaju Katli',
    subtitle: 'Diamond-cut cashew fudge, dusted in silver varq',
    cta: '/products?category=Dry+Fruit+Sweets',
    accent: '#B8860B',
  },
  {
    image: '/images/pexels-divigraphy-14467844.jpg',
    tag: 'Bestseller',
    title: 'Gulab Jamun',
    subtitle: 'Rose-scented milk dumplings, fried golden',
    cta: '/products?category=Milk+Sweets',
    accent: '#8B0000',
  },
  {
    image: '/images/pexels-gaurav-kumar-1281378-18488310.jpg',
    tag: 'Artisanal',
    title: 'Rasgulla',
    subtitle: 'Spongy chhena spheres in light cardamom syrup',
    cta: '/products?category=Bengali+Sweets',
    accent: '#2D1B69',
  },
  {
    image: '/images/pexels-towfiqu-barbhuiya-3440682-11484120.jpg',
    tag: 'Gift Ready',
    title: 'Festival Hampers',
    subtitle: 'Six-sweet heritage curation in a keepsake box',
    cta: '/products?category=Festival+Hampers',
    accent: '#B8860B',
  },
]

// ── Trust Badges ───────────────────────────────────────────
const TRUST = [
  { icon: ShieldCheck, label: 'No Preservatives', sub: 'Pure & Natural' },
  { icon: Flame, label: 'Desi Ghee Only', sub: 'Authentic Taste' },
  { icon: Clock, label: 'Made Fresh Daily', sub: 'Morning Batches' },
  { icon: Gift, label: 'Gift Packaging', sub: 'Complimentary' },
]

// ── Testimonials ───────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Ananya Rao', city: 'Hyderabad', rating: 5,
    quote: "Best kaju katli I've ever had outside Rajasthan. The silver varq finish is exquisite.",
    avatar: '/images/pexels-yankrukov-8819577.jpg',
  },
  {
    name: 'Sneha Iyer', city: 'Bengaluru', rating: 5,
    quote: "Their Diwali hampers are simply stunning. Every sweet inside is layered with genuine craftsmanship.",
    avatar: '/images/pexels-shanks-emperor-1524379304-28769884.jpg',
  },
  {
    name: 'Vikram Singh', city: 'Mumbai', rating: 5,
    quote: "I send Pragathi boxes as corporate gifts. The presentation and quality always impress every client.",
    avatar: '/images/pexels-kailashkumarphotography-11887844.jpg',
  },
]

// ── Section Header ─────────────────────────────────────────
function SectionHeader({ tag, title, subtitle }) {
  return (
    <div className="text-center mb-14">
      <span className="inline-block text-[10px] tracking-[0.35em] font-semibold uppercase text-[#B8860B] mb-3 font-body">
        ✦ {tag} ✦
      </span>
      <h2 className="font-display text-3xl md:text-5xl text-[#8B0000] font-bold leading-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-sm text-[#3A2D23]/60 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default function Home() {
  const [bestsellers, setBestsellers] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [giftHampers, setGiftHampers] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  // Hero state
  const [heroIdx, setHeroIdx] = useState(0)
  const [heroDir, setHeroDir] = useState(1)
  const heroTimer = useRef(null)


  // Scroll parallax
  const { scrollY } = useScroll()
  const yText = useTransform(scrollY, [0, 500], [0, 80])
  const yBg = useTransform(scrollY, [0, 600], [0, 120])

  useEffect(() => {
    setLoading(true)
    productService.getAll().then((list) => {
      const best = list.filter(p => p.bestseller)
      setBestsellers(best.length > 0 ? best.slice(0, 4) : list.slice(0, 4))
      setAllProducts(list.slice(0, 8))
      const hampers = list.filter(p => p.category === 'Festival Hampers')
      setGiftHampers(hampers.length > 0 ? hampers : list.slice(0, 3))
    }).catch(() => {})
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
    <div className="min-h-screen bg-[#FFFDF8] overflow-x-hidden">
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative h-[90vh] md:h-screen overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <motion.div
          style={{ y: yText }}
          className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 xl:px-32"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIdx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-2xl"
            >
              <span className="inline-block font-body text-[9px] tracking-[0.5em] uppercase font-bold text-[#E6C687] mb-5 border border-[#E6C687]/40 px-4 py-1.5 rounded-full">
                ✦ {slide.tag}
              </span>
              <h1 className="font-display text-5xl sm:text-7xl xl:text-8xl font-bold text-white leading-[0.95] mb-5">
                {slide.title}
              </h1>
              <p className="font-body text-sm md:text-base text-white/70 tracking-wider mb-10 max-w-lg leading-relaxed">
                {slide.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={slide.cta} className="inline-flex items-center gap-2.5 bg-[#8B0000] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#a01010] transition-all duration-300 text-xs tracking-widest uppercase shadow-xl hover:shadow-red-900/30">
                  Shop Now <ArrowRight size={14} />
                </Link>
                <Link to="/products" className="inline-flex items-center gap-2.5 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-full hover:border-[#E6C687] hover:text-[#E6C687] transition-all duration-300 text-xs tracking-widest uppercase backdrop-blur-sm">
                  All Products
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Arrows */}
        <button onClick={prevSlide} className="absolute left-5 md:left-10 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/25 hover:scale-110 transition-all flex items-center justify-center backdrop-blur-sm">
          <ChevronLeft size={18} />
        </button>
        <button onClick={nextSlide} className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/25 hover:scale-110 transition-all flex items-center justify-center backdrop-blur-sm">
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => gotoSlide(i)} className={`transition-all duration-400 rounded-full ${i === heroIdx ? 'w-8 h-2 bg-[#E6C687]' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`} />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute bottom-8 right-10 z-20 font-display text-white/30 text-xs tracking-widest">
          {String(heroIdx + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
        </div>
      </section>

      {/* ══ TRUST STRIP ═══════════════════════════════════════════ */}
      <section className="bg-[#8B0000] text-white py-5 border-y border-[#B8860B]/20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
          {TRUST.map(({ icon: Icon, label, sub }, i) => (
            <div key={i} className={`flex items-center gap-3 ${i < 3 ? 'md:border-r md:border-white/10 md:pr-6 md:mr-6' : ''}`}>
              <div className="w-9 h-9 rounded-full border border-[#E6C687]/30 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-[#E6C687]" />
              </div>
              <div>
                <p className="font-display text-xs font-bold text-white tracking-wider">{label}</p>
                <p className="font-body text-[10px] text-white/50 tracking-wider mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ BESTSELLERS ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <SectionHeader
          tag="Our Craft"
          title="Bestselling Sweets"
          subtitle="Handcrafted in small batches each morning. Every piece tells a story of heritage and devotion."
        />
        {loading && bestsellers.length === 0 ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bestsellers.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <SweetCard product={p} onAdd={() => handleAdd(p)} />
              </motion.div>
            ))}
          </div>
        )}
        <div className="text-center mt-14">
          <Link to="/products" className="btn-outline">
            View Full Collection <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ══ STORY BAND ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#3A1F0F] py-24 px-6 md:px-20">
        <div className="absolute inset-0">
          <img src="/images/pexels-towfiqu-barbhuiya-3440682-11484120.jpg" alt="Sweets story" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-[#3A1F0F]/80" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[9px] tracking-[0.5em] font-semibold text-[#E6C687] uppercase font-body block mb-5">✦ Est. 1994 — Hyderabad</span>
            <h2 className="font-display text-4xl md:text-6xl text-white font-bold leading-[0.95] mb-6">
              Tradition Tastes<br /><em className="italic text-[#E6C687]">Like This.</em>
            </h2>
            <p className="font-body text-sm text-white/60 leading-relaxed mb-8 max-w-md">
              Three decades. One family. Recipes passed down through whispering kitchens and countless festive seasons. Every sweet we make carries that weight — and that sweetness.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2.5 text-xs font-bold tracking-widest uppercase text-[#E6C687] border-b-2 border-[#E6C687]/30 pb-1 hover:border-[#E6C687] transition-colors">
              Discover Our Story <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: '30+', label: 'Years of Tradition' },
              { num: '50+', label: 'Heritage Recipes' },
              { num: '10K+', label: 'Happy Families' },
              { num: '100%', label: 'Pure Desi Ghee' },
            ].map(({ num, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
                <p className="font-display text-3xl md:text-4xl font-bold text-[#E6C687] mb-2">{num}</p>
                <p className="font-body text-[10px] text-white/50 tracking-widest uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ALL PRODUCTS ══════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <SectionHeader
          tag="Full Collection"
          title="Every Sweet, Perfected"
          subtitle="From everyday indulgence to grand occasion gifting — every product is an art form."
        />
        {allProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {allProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
              >
                <SweetCard product={p} onAdd={() => handleAdd(p)} />
              </motion.div>
            ))}
          </div>
        )}
        <div className="text-center mt-14">
          <Link to="/products" className="btn-primary">
            Shop All Products <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ══ GIFT HAMPERS PROMO ════════════════════════════════════ */}
      <section className="mx-6 md:mx-12 xl:mx-20 mb-24 rounded-3xl overflow-hidden relative">
        <img
          src="/images/pexels-jonathanborba-19863265.jpg"
          alt="Festival Hampers"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000]/90 via-[#8B0000]/70 to-transparent" />
        <div className="relative z-10 p-12 md:p-20 max-w-xl">
          <span className="text-[9px] tracking-[0.5em] font-semibold text-[#E6C687] uppercase font-body block mb-5">✦ Gift Curation</span>
          <h2 className="font-display text-4xl md:text-5xl text-white font-bold leading-tight mb-4">
            Festival Hampers,<br />Elevated.
          </h2>
          <p className="font-body text-sm text-white/70 mb-8 leading-relaxed">
            Six handpicked sweets in a handcrafted keepsake box. A gift as memorable as the occasion itself.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/products?category=Festival+Hampers" className="inline-flex items-center gap-2 bg-[#E6C687] text-[#3A1F0F] font-bold px-7 py-3.5 rounded-full text-xs tracking-widest uppercase hover:bg-white transition-colors">
              Explore Hampers <Gift size={14} />
            </Link>
            <Link to="/products" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-full text-xs tracking-widest uppercase hover:border-[#E6C687] hover:text-[#E6C687] transition-all">
              Custom Orders
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <SectionHeader
          tag="Happy Customers"
          title="Voices of Delight"
          subtitle="From families to corporates — the taste of Pragathi stays with you."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white border border-[#B8860B]/15 rounded-3xl p-8 hover:shadow-[0_12px_48px_rgba(184,134,11,0.1)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex gap-1 mb-5">
                {[...Array(t.rating)].map((_, s) => (
                  <Star key={s} size={13} className="text-[#B8860B] fill-[#B8860B]" />
                ))}
              </div>
              <p className="font-body text-sm text-[#3A2D23]/70 leading-relaxed italic mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-5 border-t border-[#B8860B]/10">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-[#B8860B]/20" />
                <div>
                  <p className="font-display text-sm font-bold text-[#8B0000]">{t.name}</p>
                  <p className="font-body text-[10px] text-[#3A2D23]/40 tracking-wider">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ NEWSLETTER ════════════════════════════════════════════ */}
      <section className="mx-6 md:mx-12 xl:mx-20 mb-24 rounded-3xl bg-[#8B0000] overflow-hidden relative py-16 px-8 md:px-16">
        <div className="absolute inset-0 opacity-5 bg-[url('/images/pexels-gaurav-kumar-1281378-18488298.jpg')] bg-cover bg-center" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8860B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="text-[9px] tracking-[0.5em] font-semibold text-[#E6C687]/70 uppercase font-body block mb-4">✦ Exclusive Access</span>
          <h2 className="font-display text-3xl md:text-4xl text-white font-bold mb-4">Join the Pragathi Circle</h2>
          <p className="font-body text-sm text-white/60 mb-8">
            First access to festive drops, heritage recipes, and private gifting offers.
          </p>
          <form onSubmit={e => { e.preventDefault(); toast.success('Welcome to the Pragathi Circle! 🎉') }} className="flex max-w-md mx-auto">
            <input type="email" required placeholder="Your email address" className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/30 text-xs tracking-wider font-body px-5 py-4 rounded-l-full focus:outline-none focus:border-[#E6C687] transition-colors" />
            <button type="submit" className="bg-[#E6C687] text-[#3A1F0F] font-bold px-7 py-4 rounded-r-full text-xs tracking-widest uppercase hover:bg-white transition-colors shrink-0">
              Join
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
