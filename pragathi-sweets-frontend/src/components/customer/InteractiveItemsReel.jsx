import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Plus, Check, ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import ReliableImage from '../common/ReliableImage'
import { useCart } from '../../hooks/useCart'
import toast from 'react-hot-toast'

const FEATURED_CONFECTIONS = [
  {
    id: 1,
    name: 'Kanjeevaram Gold Zari Saree',
    category: 'Sarees',
    badge: 'Pure Mulberry Silk',
    tag: 'Hand-loomed with Real Gold Zari',
    price: 14500,
    unit: 'piece',
    rating: 4.9,
    reviews: 45,
    image: '/images/pexels-gaurav-kumar-1281378-18488298.jpg'
  },
  {
    id: 2,
    name: 'Heritage Crimson Bridal Lehenga',
    category: 'Lehengas',
    badge: 'Masterpiece',
    tag: 'Intricate Zardozi & Dabka',
    price: 38500,
    unit: 'set',
    rating: 5.0,
    reviews: 52,
    image: '/images/pexels-shanks-emperor-1524379304-28769884.jpg'
  },
  {
    id: 3,
    name: 'Handcrafted Raw Silk Anarkali',
    category: 'Anarkalis & Kurtas',
    badge: 'Atelier Exclusive',
    tag: 'Fine Gota Patti & Cutdana',
    price: 9800,
    unit: 'set',
    rating: 4.9,
    reviews: 38,
    image: '/images/pexels-divigraphy-8624624.jpg'
  },
  {
    id: 4,
    name: 'Draped Emerald Evening Gown',
    category: 'Dresses & Gowns',
    badge: 'Runway Edit',
    tag: 'Sculpted Georgette Silhouette',
    price: 12500,
    unit: 'piece',
    rating: 4.8,
    reviews: 29,
    image: '/images/pexels-divigraphy-14467844.jpg'
  },
  {
    id: 5,
    name: 'Banarasi Organza Tissue Saree',
    category: 'Sarees',
    badge: 'Handwoven',
    tag: 'Antique Floral Kadwa Weave',
    price: 11200,
    unit: 'piece',
    rating: 4.9,
    reviews: 22,
    image: '/images/pexels-gaurav-kumar-1281378-18488310.jpg'
  },
  {
    id: 6,
    name: 'Pastel Velvet Trousseau Kurta Set',
    category: 'Anarkalis & Kurtas',
    badge: 'Festive Edit',
    tag: 'Micro-pearl & Resham Work',
    price: 8400,
    unit: 'set',
    rating: 4.8,
    reviews: 31,
    image: '/images/pexels-towfiqu-barbhuiya-3440682-11484120.jpg'
  },
  {
    id: 7,
    name: 'Bespoke Royal Velvet Cape Set',
    category: 'Wedding Edit',
    badge: 'Boutique Edition',
    tag: 'Hand-appliquéd Borders',
    price: 16900,
    unit: 'set',
    rating: 4.9,
    reviews: 19,
    image: '/images/pexels-mehranb-86649.jpg'
  },
  {
    id: 8,
    name: 'Champagne Sequin Cocktail Gown',
    category: 'Dresses & Gowns',
    badge: 'Couture Edit',
    tag: 'Ombré Hand-beaded Tulle',
    price: 15800,
    unit: 'piece',
    rating: 4.8,
    reviews: 39,
    image: '/images/pexels-jonathanborba-19863265.jpg'
  }
]

export default function InteractiveItemsReel({ items }) {
  const displayItems = items && items.length >= 4 ? items : FEATURED_CONFECTIONS
  const reelItems = [...displayItems, ...displayItems] // seamless loop
  const { addToCart } = useCart()
  const [addedMap, setAddedMap] = useState({})
  const [isPaused, setIsPaused] = useState(false)
  const scrollerRef = useRef(null)

  const handleAdd = (item, e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(item)
    setAddedMap((prev) => ({ ...prev, [item.id]: true }))
    toast.success(`${item.name} added to cart!`, {
      style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
    })
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.id]: false }))
    }, 1200)
  }

  const scrollLeft = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-[#2A0810] via-[#3D0C17] to-[#1F040A] text-white">
      {/* Ambient decorative glowing accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#C9A45C]/15 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#5A1020]/30 filter blur-[120px] pointer-events-none" />
      
      {/* Decorative top and bottom gold border shimmer */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C9A45C]/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C9A45C]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-[#C9A45C] text-[10px] font-bold uppercase tracking-[0.25em] mb-3 backdrop-blur-sm font-sans">
              <Sparkles size={11} className="text-[#C9A45C]" />
              Haute Couture Showcase in Motion
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight">
              Curated Couture <span className="italic font-normal text-[#C9A45C]">Live Reel</span>
            </h2>
            <p className="font-sans text-xs md:text-sm text-white/70 mt-2 max-w-lg leading-relaxed">
              Continuous showcase of handcrafted sarees, bridal lehengas, and evening gowns from the AGVIA atelier. Hover over any silhouette to pause motion.
            </p>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[11px] font-bold tracking-wider uppercase transition-all backdrop-blur-sm font-sans"
              title="Toggle Auto Scroll"
            >
              {isPaused ? '▶ Resume Motion' : '⏸ Pause Motion'}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-[#C9A45C] hover:text-[#211D1E] hover:border-[#C9A45C] text-white flex items-center justify-center transition-all shadow-sm"
                aria-label="Scroll previous"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={scrollRight}
                className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-[#C9A45C] hover:text-[#211D1E] hover:border-[#C9A45C] text-white flex items-center justify-center transition-all shadow-sm"
                aria-label="Scroll next"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Scrolling Track */}
      <div
        ref={scrollerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="overflow-x-auto scrollbar-none py-4 px-6 select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div
          className={`flex gap-6 w-max transition-transform ${isPaused ? '' : 'animate-reel'}`}
          style={{
            animation: isPaused ? 'none' : 'reel-glide 42s linear infinite',
          }}
        >
          {reelItems.map((sweet, index) => {
            const isAdded = addedMap[sweet.id]
            const img = sweet.image || sweet.imageUrl
            const badge = sweet.badge || (sweet.bestseller ? 'Bestseller' : 'Handcrafted')

            return (
              <motion.div
                key={`${sweet.id}-${index}`}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="w-[280px] sm:w-[310px] shrink-0 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-[#E6C687]/60 rounded-3xl overflow-hidden backdrop-blur-md transition-all duration-300 shadow-[0_16px_36px_rgba(0,0,0,0.35)] flex flex-col group"
              >
                {/* Visual Area */}
                <div className="relative aspect-[4/3] overflow-hidden bg-black/30">
                  <Link to={`/products/${sweet.id}`} className="block w-full h-full">
                    <ReliableImage
                      src={img}
                      alt={sweet.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 bg-[#8B0000]/90 text-white text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg border border-red-400/30 backdrop-blur-sm">
                    <ShieldCheck size={10} className="text-[#E6C687]" />
                    {badge}
                  </div>

                  {/* Category Pill */}
                  <span className="absolute bottom-3 left-3.5 z-10 text-[9px] font-bold uppercase tracking-[0.25em] text-[#E6C687] bg-black/40 px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                    {sweet.categoryName || sweet.category}
                  </span>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/products/${sweet.id}`}>
                      <h3 className="font-display text-base font-bold text-white group-hover:text-[#E6C687] transition-colors leading-snug line-clamp-1">
                        {sweet.name}
                      </h3>
                    </Link>

                    {/* Rating row */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex text-[#E6C687]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} fill="#E6C687" className="text-[#E6C687]" />
                        ))}
                      </div>
                      <span className="text-[10px] text-white/60 font-body font-semibold">
                        {sweet.rating || sweet.avgRating || 4.8} · ({sweet.numReviews || sweet.reviews || 24})
                      </span>
                    </div>

                    <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed mt-2 font-body">
                      {sweet.tag || sweet.description || 'Prepared fresh with pure desi ghee and hand-selected dry fruits.'}
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-white/10">
                    <div>
                      <span className="font-display text-lg font-bold text-[#E6C687]">₹{sweet.price}</span>
                      <span className="text-[10px] text-white/50 ml-1 font-body">/{sweet.unit || 'kg'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/products/${sweet.id}`}
                        className="text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors px-2 py-1"
                      >
                        Details
                      </Link>
                      <button
                        onClick={(e) => handleAdd(sweet, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#E6C687] hover:bg-white text-[#240F06] shadow-sm hover:scale-105'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={11} /> Added
                          </>
                        ) : (
                          <>
                            <Plus size={11} /> Quick Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Inline styles for seamless infinite scroll animation */}
      <style>{`
        @keyframes reel-glide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}
