import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import ReliableImage from '../common/ReliableImage'

// 10 Curated Boutique Collection Items matching user's design reference exactly
const BOUTIQUE_COLLECTIONS = [
  {
    id: 'sarees',
    name: 'Sarees',
    subtitle: 'Timeless Drapes',
    image: '/images/classic_silk_saree.jpg',
    link: '/products?category=Sarees',
    tag: 'Handloom Pure Silk',
  },
  {
    id: 'lehengas',
    name: 'Lehengas',
    subtitle: 'Bridal & Festive',
    image: '/images/wedding_lehenga.jpg',
    link: '/products?category=Lehengas',
    tag: 'Artisanal Zardozi',
  },
  {
    id: 'anarkalis-kurtas',
    name: 'Anarkalis & Kurtas',
    subtitle: 'Graceful Silhouettes',
    image: '/images/anarkali_set.jpg',
    link: '/products?category=Anarkalis & Kurtas',
    tag: 'Flared Couture',
  },
  {
    id: 'dresses-gowns',
    name: 'Dresses & Gowns',
    subtitle: 'Contemporary Chic',
    image: '/images/evening_gown.jpg',
    link: '/products?category=Dresses & Gowns',
    tag: 'Modern Soirée',
  },
  {
    id: 'wedding-festive-edit',
    name: 'Wedding & Festive Edit',
    subtitle: 'Curated Ensembles',
    image: '/images/festive_lehenga_set.jpg',
    link: '/wedding-orders',
    tag: 'Trousseau Bespoke',
  },
  {
    id: 'zardozi-kurtas',
    name: 'Zardozi Kurtas',
    subtitle: 'Signature Craft',
    image: '/images/everyday_kurta_set.jpg',
    link: '/products?category=Kurtis',
    tag: 'Intricate Needlework',
  },
  {
    id: 'cocktail-gowns',
    name: 'Cocktail Gowns',
    subtitle: 'Modern Evenings',
    image: '/images/pexels-ron-lach-8386651.jpg',
    link: '/products?category=Dresses & Gowns',
    tag: 'Midnight Shimmer',
  },
  {
    id: 'organza-sarees',
    name: 'Organza Sarees',
    subtitle: 'Light & Elegant',
    image: '/images/floral_organza_saree.jpg',
    link: '/products?category=Sarees',
    tag: 'Delicate Floral',
  },
  {
    id: 'chanderi-suits',
    name: 'Chanderi Suits',
    subtitle: 'Everyday Luxury',
    image: '/images/festive_kurti.jpg',
    link: '/products?category=Kurtis',
    tag: 'Pure Cotton-Silk',
  },
  {
    id: 'heritage-dupattas',
    name: 'Heritage Dupattas',
    subtitle: 'Regal Weaves',
    image: '/images/bridal_dupatta.jpg',
    link: '/products?category=Dupattas',
    tag: 'Embellished Borders',
  },
]

export default function InteractiveItemsReel({ items }) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollerRef = useRef(null)

  // Drag-to-scroll state
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftPos = useRef(0)
  const hasMoved = useRef(false)

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < maxScroll - 10)
    setScrollProgress(maxScroll > 0 ? (el.scrollLeft / maxScroll) * 100 : 0)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    updateScrollState()
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [updateScrollState])

  const scrollByAmount = (direction) => {
    const el = scrollerRef.current
    if (!el) return
    const scrollOffset = direction * (el.clientWidth * 0.75)
    el.scrollBy({ left: scrollOffset, behavior: 'smooth' })
  }

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (!scrollerRef.current) return
    isDragging.current = true
    hasMoved.current = false
    startX.current = e.pageX - scrollerRef.current.offsetLeft
    scrollLeftPos.current = scrollerRef.current.scrollLeft
    scrollerRef.current.style.cursor = 'grabbing'
    scrollerRef.current.style.userSelect = 'none'
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current || !scrollerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollerRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    if (Math.abs(walk) > 5) hasMoved.current = true
    scrollerRef.current.scrollLeft = scrollLeftPos.current - walk
  }

  const handleMouseUp = () => {
    isDragging.current = false
    if (scrollerRef.current) {
      scrollerRef.current.style.cursor = 'grab'
      scrollerRef.current.style.removeProperty('user-select')
    }
  }

  return (
    <section className="relative py-12 md:py-16 bg-[#FAF7F2] overflow-hidden border-y border-[#E6C687]/25 select-none">
      {/* Ambient background lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A45C]/06 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#8B0000]/04 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ══ HEADER (MATCHING EXACT REFERENCE DESIGN) ═══════════════ */}
        <div className="relative mb-8 md:mb-12">
          {/* Top category sub-badge */}
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-3">
              <span className="w-8 md:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C9A45C]" />
              <span
                style={{ fontFamily: "'Lato', 'Inter', sans-serif" }}
                className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.35em] text-[#C9A45C]"
              >
                ✦ EXPLORE OUR BOUTIQUE ✦
              </span>
              <span className="w-8 md:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C9A45C]" />
            </div>
          </div>

          {/* 3-Column Header Grid: Left Accent | Center Title | Right Script */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 md:gap-6">
            {/* Left Column: Lotus Emblem & Tradition meets modern style */}
            <div className="hidden md:flex items-center gap-3.5 pl-2">
              <div className="w-10 h-10 flex items-center justify-center shrink-0 text-[#C9A45C]">
                {/* Elegant Lotus Outline SVG */}
                <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-9 h-9">
                  <path d="M22 6C19 14 14 20 10 24C6 28 7 32 11 34C15 35 18 31 22 24C26 31 29 35 33 34C37 32 38 28 34 24C30 20 25 14 22 6Z" fill="#C9A45C" fillOpacity="0.08" />
                  <path d="M22 17C16 22 12 26 13 30C14 33 18 34 22 34C26 34 30 33 31 30C32 26 28 22 22 17Z" stroke="#C9A45C" strokeWidth="1.2" />
                  <path d="M22 26V36" stroke="#C9A45C" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="h-9 w-[1px] bg-[#C9A45C]/30 shrink-0" />
              <div>
                <p
                  style={{ fontFamily: "'Lato', 'Inter', sans-serif" }}
                  className="text-[9px] uppercase tracking-[0.25em] text-[#5A1020]/75 font-semibold leading-tight"
                >
                  Tradition
                </p>
                <p
                  style={{ fontFamily: "'Lato', 'Inter', sans-serif" }}
                  className="text-[9px] uppercase tracking-[0.25em] text-[#C9A45C] font-semibold leading-tight my-0.5"
                >
                  Meets
                </p>
                <p
                  style={{ fontFamily: "'Lato', 'Inter', sans-serif" }}
                  className="text-[9px] uppercase tracking-[0.25em] text-[#5A1020]/75 font-semibold leading-tight"
                >
                  Modern Style
                </p>
              </div>
            </div>

            {/* Center Column: Main Title & Subtitle */}
            <div className="text-center">
              <h2
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-[#211D1E] tracking-tight leading-tight"
              >
                Shop by{' '}
                <span
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  className="italic font-normal text-[#8B0000]"
                >
                  Collection
                </span>
              </h2>
              <p
                style={{ fontFamily: "'Lato', 'Inter', sans-serif" }}
                className="text-xs sm:text-sm text-[#211D1E]/65 mt-2 max-w-md mx-auto leading-relaxed"
              >
                Discover thoughtfully curated silhouettes for every occasion.
              </p>
            </div>

            {/* Right Column: Elegance in Every Detail in Calligraphy Script */}
            <div className="hidden md:flex justify-end pr-2">
              <p
                style={{ fontFamily: "'Alex Brush', 'Cormorant Garamond', cursive" }}
                className="text-3xl lg:text-[2.2rem] text-[#C9A45C] tracking-wide transform -rotate-3 select-none"
              >
                Elegance in Every Detail
              </p>
            </div>
          </div>
        </div>

        {/* ══ SCROLLER CAROUSEL WITH ARCHED CARDS ════════════════════ */}
        <div className="relative group/carousel">
          {/* Left Arrow Button */}
          <button
            onClick={() => scrollByAmount(-1)}
            disabled={!canScrollLeft}
            aria-label="Previous collection"
            className={`absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 border border-[#E6C687]/50 shadow-[0_6px_20px_rgba(90,16,32,0.15)] backdrop-blur-sm flex items-center justify-center text-[#8B0000] transition-all duration-300 hover:scale-110 hover:bg-[#8B0000] hover:text-white hover:border-[#8B0000] ${
              canScrollLeft
                ? 'opacity-90 hover:opacity-100 cursor-pointer'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scrollByAmount(1)}
            disabled={!canScrollRight}
            aria-label="Next collection"
            className={`absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 border border-[#E6C687]/50 shadow-[0_6px_20px_rgba(90,16,32,0.15)] backdrop-blur-sm flex items-center justify-center text-[#8B0000] transition-all duration-300 hover:scale-110 hover:bg-[#8B0000] hover:text-white hover:border-[#8B0000] ${
              canScrollRight
                ? 'opacity-90 hover:opacity-100 cursor-pointer'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronRight size={22} />
          </button>

          {/* Left & Right subtle edge fade masks */}
          <div
            className={`absolute left-0 top-0 bottom-6 w-12 z-20 bg-gradient-to-r from-[#FAF7F2] to-transparent pointer-events-none transition-opacity duration-300 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            className={`absolute right-0 top-0 bottom-6 w-12 z-20 bg-gradient-to-l from-[#FAF7F2] to-transparent pointer-events-none transition-opacity duration-300 ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Scrolling Row */}
          <div
            ref={scrollerRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-4 pt-2 px-1 snap-x snap-mandatory scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              cursor: 'grab',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {BOUTIQUE_COLLECTIONS.map((col, idx) => (
              <motion.div
                key={col.id}
                className="snap-start shrink-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
              >
                <Link
                  to={col.link}
                  onClick={(e) => {
                    // Prevent navigation if user was dragging
                    if (hasMoved.current) {
                      e.preventDefault()
                    }
                  }}
                  className="group block w-[190px] sm:w-[215px] md:w-[235px] transition-all duration-300 hover:-translate-y-2 select-none"
                >
                  {/* Card Container with Arched Top */}
                  <div className="bg-white rounded-t-[72px] sm:rounded-t-[84px] rounded-b-2xl overflow-hidden border border-[#E6C687]/35 shadow-[0_8px_24px_rgba(90,16,32,0.06)] group-hover:shadow-[0_18px_40px_rgba(90,16,32,0.16)] group-hover:border-[#C9A45C] transition-all duration-500 flex flex-col">
                    {/* Arched Image Container */}
                    <div className="relative aspect-[3/4.2] overflow-hidden rounded-t-[72px] sm:rounded-t-[84px] bg-[#EFE8DD]">
                      <ReliableImage
                        src={col.image}
                        alt={col.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />

                      {/* Soft luxury shadow gradient at the base */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                      {/* Subtle Tag Overlay */}
                      {col.tag && (
                        <div className="absolute bottom-2.5 left-3 right-3 text-center">
                          <span
                            style={{ fontFamily: "'Lato', sans-serif" }}
                            className="text-[9px] uppercase tracking-[0.18em] text-white/90 font-medium bg-black/30 backdrop-blur-xs px-2.5 py-0.5 rounded-full"
                          >
                            {col.tag}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Card Info with Title, Subtitle, and Circular Arrow Button */}
                    <div className="p-3.5 sm:p-4 bg-white flex items-center justify-between gap-2.5 border-t border-[#E6C687]/20">
                      <div className="min-w-0 flex-1">
                        <h3
                          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                          className="text-[15px] sm:text-[16px] font-bold text-[#211D1E] group-hover:text-[#8B0000] transition-colors leading-tight truncate"
                        >
                          {col.name}
                        </h3>
                        <p
                          style={{ fontFamily: "'Lato', 'Inter', sans-serif" }}
                          className="text-[11px] text-[#8B0000]/70 font-medium tracking-wide leading-tight mt-1 truncate"
                        >
                          {col.subtitle}
                        </p>
                      </div>

                      {/* Circular Navigation Arrow */}
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#C9A45C]/40 bg-[#FAF7F2] flex items-center justify-center text-[#8B0000] group-hover:bg-[#8B0000] group-hover:text-white group-hover:border-[#8B0000] transition-all duration-300 shrink-0 shadow-xs">
                        <ArrowRight size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Scroll progress indicator line */}
          <div className="mt-4 max-w-xs mx-auto h-[2.5px] bg-[#E6C687]/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8B0000] to-[#C9A45C] rounded-full transition-all duration-150"
              style={{ width: `${Math.max(scrollProgress, 10)}%` }}
            />
          </div>
        </div>

        {/* ══ MOBILE ACCENT SCRIPT ═══════════════════════════════════ */}
        <div className="mt-4 flex md:hidden items-center justify-between px-1">
          <p
            style={{ fontFamily: "'Lato', sans-serif" }}
            className="text-[10px] uppercase tracking-widest text-[#211D1E]/40"
          >
            10 Exclusive Silhouettes
          </p>
          <p
            style={{ fontFamily: "'Alex Brush', cursive" }}
            className="text-xl text-[#C9A45C]"
          >
            Elegance in Every Detail
          </p>
        </div>
      </div>
    </section>
  )
}
