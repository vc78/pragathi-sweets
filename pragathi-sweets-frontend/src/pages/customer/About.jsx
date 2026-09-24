import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award,
  Sparkles,
  ShieldCheck,
  Heart,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle,
  Gem,
  Coffee,
  Users
} from 'lucide-react'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import ReliableImage from '../../components/common/ReliableImage'

const ABOUT_SLIDES = [
  {
    id: 1,
    year: 'Est. 1994',
    tagline: '✦ THREE DECADES OF DEVOTION ✦',
    title: 'The Sacred Kitchens of Hyderabad',
    subtitle: 'From a single brass kadhai in 1994 to Hyderabad’s most cherished luxury confectionery boutique, our family recipes have remained untouched by time.',
    image: '/images/pexels-divigraphy-8624624.jpg',
    stat: '30+ Years',
    statDesc: 'Handcrafted Heritage'
  },
  {
    id: 2,
    year: 'Purity Standards',
    tagline: '✦ GOLD-STANDARD INGREDIENTS ✦',
    title: 'Unadulterated A2 Desi Cow Ghee',
    subtitle: 'We source organic golden A2 cow ghee, blanched California almonds, and hand-plucked Kashmiri saffron. Zero preservatives, zero chemical stabilizers.',
    image: '/images/pexels-gaurav-kumar-1281378-18488298.jpg',
    stat: '100% Pure',
    statDesc: 'Zero Artificial Additives'
  },
  {
    id: 3,
    year: 'Artisan Pride',
    tagline: '✦ MASTERY PASSED THROUGH HANDS ✦',
    title: 'Small Batches Simmered Every Morning',
    subtitle: 'Our master halwais wake before dawn. Every batch of khoya is caramelized slowly, every diamond of kaju katli is hand-cut, and every rasgulla is shaped with love.',
    image: '/images/pexels-divigraphy-14467844.jpg',
    stat: '50+ Recipes',
    statDesc: 'Handed Down Generations'
  }
]

const TIMELINE_MILESTONES = [
  {
    year: '1994',
    title: 'The Brass Kadhai Begins',
    description: 'Our founder opened the first small confectionery workshop in Hyderabad, hand-making 15 kilograms of Motichoor Ladoos each festive morning using pure country ghee.',
    icon: Flame
  },
  {
    year: '2004',
    title: 'The Royal Bengali Chhena Line',
    description: 'Master artisans from Kolkata joined our family, introducing fresh spongy Rasgullas and saffron-soaked Angoori Rasmalai made from organic cottage cheese.',
    icon: Award
  },
  {
    year: '2016',
    title: 'Insulated Aroma-Lock Innovation',
    description: 'Pioneered zero-chemical preservation with sterile nitrogen and chilled gel packaging, allowing families across India to experience morning-fresh sweet textures.',
    icon: ShieldCheck
  },
  {
    year: '2024 & Beyond',
    title: 'The Modern Heritage Boutique',
    description: 'Blending three decades of culinary artistry with seamless online ordering, same-day delivery across Hyderabad, and curated royal festival gift hampers.',
    icon: Sparkles
  }
]

const PILLARS_OF_PURITY = [
  {
    icon: Gem,
    title: 'Desi Cow Ghee Only',
    desc: 'Slow-simmered whole milk fat with high smoke point and authentic nutty aroma that lingers gracefully.'
  },
  {
    icon: ShieldCheck,
    title: 'Zero Chemical Additives',
    desc: 'No artificial preservatives, no artificial coloring agents, and strictly sulfur-free cane sugar.'
  },
  {
    icon: Sparkles,
    title: 'Kashmiri Mogra Saffron',
    desc: 'Deep crimson stigmata infused in warm milk for genuine golden hues and soothing floral aroma.'
  },
  {
    icon: Clock,
    title: 'Daily Sunrise Batches',
    desc: 'We never inventory old stock. Every sweet delivered today was in a kadhai just hours before dispatch.'
  }
]

export default function About() {
  const [slideIdx, setSlideIdx] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!isAutoPlay) return
    timerRef.current = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % ABOUT_SLIDES.length)
    }, 6000)
    return () => clearInterval(timerRef.current)
  }, [isAutoPlay])

  const nextSlide = () => {
    setSlideIdx((prev) => (prev + 1) % ABOUT_SLIDES.length)
  }

  const prevSlide = () => {
    setSlideIdx((prev) => (prev - 1 + ABOUT_SLIDES.length) % ABOUT_SLIDES.length)
  }

  const currentSlide = ABOUT_SLIDES[slideIdx]

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body selection:bg-[#B8860B]/20">
      <Navbar />

      {/* ══ 1. LANDING SLIDESHOW HERO ══════════════════════════════ */}
      <section
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
        className="relative min-h-[580px] md:min-h-[660px] bg-[#1E0B04] text-white overflow-hidden flex items-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <ReliableImage
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover opacity-25 filter blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E0B04] via-[#1E0B04]/85 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Animated Text Content */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              key={`tag-${currentSlide.id}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6C687]/15 border border-[#E6C687]/30 text-[#E6C687] text-[10px] font-bold uppercase tracking-[0.25em]"
            >
              <Sparkles size={11} />
              {currentSlide.tagline}
            </motion.div>

            <motion.h1
              key={`title-${currentSlide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight"
            >
              {currentSlide.title}
            </motion.h1>

            <motion.p
              key={`sub-${currentSlide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xs md:text-sm text-white/80 max-w-xl leading-relaxed font-body"
            >
              {currentSlide.subtitle}
            </motion.p>

            {/* Slide Action & Stat Badge */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Link
                to="/products"
                className="bg-[#E6C687] hover:bg-white text-[#1E0B04] font-body text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-black/30 hover:scale-105"
              >
                Explore Boutique Sweets <ArrowRight size={14} />
              </Link>

              <div className="border-l border-white/20 pl-6 py-1">
                <span className="font-display text-2xl font-bold text-[#E6C687] block leading-none">
                  {currentSlide.stat}
                </span>
                <span className="text-[10px] text-white/60 tracking-widest uppercase font-semibold">
                  {currentSlide.statDesc}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Slide Controller & Preview */}
          <div className="lg:col-span-4 flex flex-col justify-end items-start lg:items-end space-y-6">
            
            {/* Slide indicator dots */}
            <div className="flex items-center gap-2.5">
              {ABOUT_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setSlideIdx(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    slideIdx === idx
                      ? 'w-10 h-2 bg-[#E6C687]'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Left/Right Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevSlide}
                className="w-11 h-11 rounded-full border border-white/20 bg-white/5 hover:bg-[#E6C687] hover:text-[#1E0B04] hover:border-[#E6C687] text-white flex items-center justify-center transition-all shadow-md"
                aria-label="Previous slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextSlide}
                className="w-11 h-11 rounded-full border border-white/20 bg-white/5 hover:bg-[#E6C687] hover:text-[#1E0B04] hover:border-[#E6C687] text-white flex items-center justify-center transition-all shadow-md"
                aria-label="Next slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* Ambient bottom golden divider */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E6C687]/40 to-transparent" />
      </section>

      {/* ══ 2. THREE DECADES TIMELINE ══════════════════════════════ */}
      <section className="py-20 md:py-28 max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.3em] font-bold text-[#B8860B] uppercase block mb-2">
            ✦ Generational Legacy ✦
          </span>
          <h2 className="font-display text-3xl md:text-5xl text-[#8B0000] font-bold leading-tight">
            How Passion Became Tradition
          </h2>
          <p className="text-xs text-[#3A2D23]/60 mt-3 leading-relaxed">
            Every chapter of our journey is rooted in an obsessive refusal to cut corners, honoring the age-old methods of Indian artisanal confectionery.
          </p>
        </div>

        {/* Vertical/Grid Milestones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIMELINE_MILESTONES.map((milestone, idx) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="bg-white border border-[#B8860B]/15 hover:border-[#B8860B]/40 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-2xl font-bold text-[#8B0000]">
                    {milestone.year}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#8B0000]/10 text-[#8B0000] flex items-center justify-center">
                    <milestone.icon size={16} />
                  </div>
                </div>

                <h3 className="font-display font-bold text-base text-[#3A2D23] mb-2 leading-snug">
                  {milestone.title}
                </h3>
                <p className="text-xs text-[#3A2D23]/70 leading-relaxed font-body">
                  {milestone.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#B8860B]/10 flex items-center gap-1.5 text-[9px] text-[#B8860B] font-bold uppercase tracking-wider">
                <CheckCircle size={10} /> Verified Milestone
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ 3. THE 4 PILLARS OF ARTISANAL PURITY ════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-[#F5E6C8]/30 to-[#FFFDF8] border-y border-[#B8860B]/15">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[10px] tracking-[0.3em] font-bold text-[#B8860B] uppercase block mb-2">
              ✦ The Pragathi Creed ✦
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-[#8B0000] font-bold leading-tight">
              Pillars of Confectionery Integrity
            </h2>
            <p className="text-xs text-[#3A2D23]/60 mt-2">
              No shortcuts. No industrial fillers. Just pure ingredients treated with deep reverence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS_OF_PURITY.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="bg-white/80 backdrop-blur-sm border border-[#B8860B]/20 rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#8B0000] text-[#FFFDF8] flex items-center justify-center mx-auto mb-4 shadow-md shadow-red-950/20">
                  <pillar.icon size={20} className="text-[#E6C687]" />
                </div>
                <h3 className="font-display font-bold text-sm text-[#8B0000] mb-2 uppercase tracking-wide">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#3A2D23]/70 leading-relaxed font-body">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. CALL TO ACTION ══════════════════════════════════════ */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#8B0000] to-[#5C0000] text-white rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#E6C687]/15 filter blur-[60px]" />
          
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#E6C687] uppercase block mb-3">
            ✦ Taste the Difference ✦
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4">
            Bring the Royal Tradition Home
          </h2>
          <p className="text-xs md:text-sm text-white/80 max-w-md mx-auto leading-relaxed mb-8 font-body">
            Every box is prepared fresh for you on the day of dispatch, sealed in vacuum-tight insulated packs.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-[#E6C687] hover:bg-white text-[#240F06] font-body text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full transition-all shadow-lg hover:scale-105"
          >
            Order Artisanal Sweets Today <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
