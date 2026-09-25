import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Menu, X, User, Search, Heart, ShoppingBag, LogOut,
  ArrowRight, ChevronDown, Sparkles, Truck, Gift,
  Crown, Flower2, Gem, Scissors, Feather, Layers
} from 'lucide-react'
import { loggedOut } from '../../store/authSlice'
import { useCart } from '../../hooks/useCart'
import { motion, AnimatePresence } from 'framer-motion'
import ReliableImage from '../common/ReliableImage'

// ── Luxury Boutique Categories ──────────────────────────────────────
const NAV_CATEGORIES = {
  COLLECTIONS: {
    label: 'COLLECTIONS',
    path: '/products',
    items: [
      { name: 'Bridal Couture', path: '/products?category=Lehengas', desc: 'Regal bridal sets & trousseau edits', img: '/images/wedding_lehenga.jpg' },
      { name: 'Festive Celebrations', path: '/products?category=Sarees', desc: 'Handwoven pure silks & organza', img: '/images/classic_silk_saree.jpg' },
      { name: 'Royal Anarkalis', path: '/products?category=Anarkalis+%26+Kurtas', desc: 'Flowing silhouettes with zardozi', img: '/images/anarkali_set.jpg' },
      { name: 'Modern Evening', path: '/products?category=Dresses+%26+Gowns', desc: 'Contemporary couture & gowns', img: '/images/evening_gown.jpg' },
    ]
  },
  SAREES: {
    label: 'SAREES',
    path: '/products?category=Sarees',
    items: [
      { name: 'Classic Silk Sarees', path: '/products?category=Sarees', desc: 'Traditional heirloom weaves with zari', img: '/images/classic_silk_saree.jpg' },
      { name: 'Floral Organza Sarees', path: '/products?category=Sarees', desc: 'Sheer lightweight pastels & motifs', img: '/images/floral_organza_saree.jpg' },
      { name: 'Kanjeevaram & Banarasi', path: '/products?category=Sarees', desc: 'Pure temple border silks', img: '/images/classic_silk_saree.jpg' },
    ]
  },
  LEHENGAS: {
    label: 'LEHENGAS',
    path: '/products?category=Lehengas',
    items: [
      { name: 'Royal Wedding Lehengas', path: '/products?category=Lehengas', desc: 'Heavy hand-embroidered bridal sets', img: '/images/wedding_lehenga.jpg' },
      { name: 'Festive Silk Lehengas', path: '/products?category=Lehengas', desc: 'Lightweight festive flared skirts', img: '/images/festive_lehenga_set.jpg' },
    ]
  },
  KURTAS: {
    label: 'KURTAS',
    path: '/products?category=Anarkalis+%26+Kurtas',
    items: [
      { name: 'Embroidered Anarkalis', path: '/products?category=Anarkalis+%26+Kurtas', desc: 'Grand floor-length festive kalis', img: '/images/anarkali_set.jpg' },
      { name: 'Everyday Kurta Sets', path: '/products?category=Anarkalis+%26+Kurtas', desc: 'Chic comfortable daily wear', img: '/images/everyday_kurta_set.jpg' },
      { name: 'Festive Kurtis', path: '/products?category=Kurtis', desc: 'Intricate neckline & threadwork', img: '/images/festive_kurti.jpg' },
    ]
  },
  WESTERN_WEAR: {
    label: 'WESTERN WEAR',
    path: '/products?category=Western+Wear',
    items: [
      { name: 'Tailored Co-ord Sets', path: '/products?category=Western+Wear', desc: 'Chic modern co-ordinated outfits', img: '/images/coord_set.jpg' },
      { name: 'Evening Dresses & Gowns', path: '/products?category=Dresses+%26+Gowns', desc: 'Cocktail gowns with subtle sheen', img: '/images/evening_gown.jpg' },
    ]
  },
  MORE: {
    label: 'MORE',
    path: '/products',
    items: [
      { name: 'Bridal Dupattas', path: '/products?category=Dupattas', desc: 'Embellished bridal veil drapes', img: '/images/bridal_dupatta.jpg' },
      { name: 'Custom Stitching', path: '/wedding-orders', desc: 'Made-to-measure bespoke blouse & tailoring', img: '/images/anarkali_set.jpg' },
      { name: 'VIP Membership', path: '/subscription', desc: 'AGVIA Haute Privilege Circle & styling perks', img: '/images/hero_banner.jpg' },
    ]
  }
}

// ── Watermark Botanical Illustration (SVG) ───────────────────────────
function BotanicalCornerDecor({ className = '' }) {
  return (
    <svg viewBox="0 0 160 110" fill="none" className={`pointer-events-none select-none opacity-30 ${className}`}>
      <path d="M150 100 C130 80, 100 60, 60 70 C40 75, 20 90, 5 105" stroke="#C9A45C" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M120 70 C135 60, 145 40, 140 25 C125 35, 115 55, 120 70 Z" fill="#C9A45C" fillOpacity="0.18" stroke="#C9A45C" strokeWidth="0.8" />
      <path d="M95 62 C110 50, 115 30, 105 18 C92 28, 90 48, 95 62 Z" fill="#C9A45C" fillOpacity="0.18" stroke="#C9A45C" strokeWidth="0.8" />
      <path d="M70 68 C80 50, 75 32, 60 25 C55 40, 60 58, 70 68 Z" fill="#C9A45C" fillOpacity="0.18" stroke="#C9A45C" strokeWidth="0.8" />
      <path d="M45 78 C48 60, 40 45, 28 40 C28 55, 36 70, 45 78 Z" fill="#C9A45C" fillOpacity="0.18" stroke="#C9A45C" strokeWidth="0.8" />
      <circle cx="140" cy="22" r="1.5" fill="#C9A45C" />
      <circle cx="103" cy="15" r="1.5" fill="#C9A45C" />
      <circle cx="58" cy="22" r="1.5" fill="#C9A45C" />
    </svg>
  )
}

// ── AGVIA Lady Emblem Logo Icon ─────────────────────────────────────
function AgviaLogoEmblem() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10 md:w-11 md:h-11 shrink-0">
      {/* Sparkles around lady */}
      <path d="M14 18 L16 11 L18 18 L25 20 L18 22 L16 29 L14 22 L7 20 Z" fill="#C9A45C" />
      <path d="M50 14 L51 9 L52 14 L57 15 L52 16 L51 21 L50 16 L45 15 Z" fill="#C9A45C" />
      <path d="M12 44 L13 40 L14 44 L18 45 L14 46 L13 50 L12 46 L8 45 Z" fill="#C9A45C" opacity="0.85" />
      <path d="M52 46 L53 42 L54 46 L58 47 L54 48 L53 52 L52 48 L48 47 Z" fill="#C9A45C" opacity="0.85" />
      
      {/* Crown / Hair */}
      <circle cx="32" cy="18" r="4.5" stroke="#C9A45C" strokeWidth="1.5" fill="#FAF6F0" />
      <path d="M30 13 L32 10 L34 13 L36 11 L35 15 L29 15 L28 11 Z" fill="#C9A45C" />
      
      {/* Elegant Silhouette Gown */}
      <path d="M30 23 L28 29 L23 35 L16 53 L32 52 L48 53 L41 35 L36 29 L34 23 Z" stroke="#C9A45C" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Gown inner drapery lines */}
      <path d="M28 29 L32 44 L36 29" stroke="#C9A45C" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
      <path d="M25 38 L32 52 L39 38" stroke="#C9A45C" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M19 48 L32 52 L45 48" stroke="#C9A45C" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      {/* Base flourish pedestal */}
      <path d="M22 55 L32 53.5 L42 55" stroke="#C9A45C" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownTimeoutRef = useRef(null)

  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { count } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [location.pathname, location.search])

  const handleLogout = () => {
    dispatch(loggedOut())
    navigate('/')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleMouseEnter = (key) => {
    clearTimeout(dropdownTimeoutRef.current)
    setActiveDropdown(key)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const isHomeActive = location.pathname === '/'

  return (
    <>
      {/* Spacer for sticky dual header (top bar ~36px + main nav ~76px = ~112px) */}
      <div className="h-[106px] md:h-[114px]" />

      <header className="fixed top-0 left-0 right-0 z-50 select-none shadow-[0_4px_25px_rgba(0,0,0,0.06)]">

        {/* ══════════════════════════════════════════════════════════════
            1. TOP ANNOUNCEMENT BAR (DEEP BURGUNDY / WINE)
        ══════════════════════════════════════════════════════════════ */}
        <div className="relative bg-[#480814] text-[#E6C894] border-b border-[#5E1220] overflow-hidden">
          {/* Subtle background damask floral flourishes at edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-9 flex items-center justify-between text-[10.5px] sm:text-[11px] tracking-[0.16em] uppercase font-medium">
            
            {/* Left: Free Shipping & Easy Returns */}
            <div className="flex items-center gap-2 text-[#E6C894]">
              <Truck size={13} className="text-[#E6C894] shrink-0" />
              <span className="font-semibold tracking-[0.18em]">FREE SHIPPING</span>
              <span className="opacity-40">|</span>
              <span className="tracking-[0.18em]">EASY RETURNS</span>
            </div>

            {/* Center: Elegant Styles Symmetrical Flourish */}
            <div className="hidden md:flex items-center gap-2.5 text-[#E6C894] tracking-[0.22em] text-[11px] font-serif">
              <span className="w-8 lg:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#E6C894]/70" />
              <span className="text-[#E6C894] text-[10px]">✦</span>
              <span className="tracking-[0.24em] font-medium text-white/95">
                ELEGANT STYLES FOR EVERY OCCASION
              </span>
              <span className="text-[#E6C894] text-[10px]">✦</span>
              <span className="w-8 lg:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#E6C894]/70" />
            </div>

            {/* Right: Exclusive Collections & Secure Payments */}
            <div className="hidden sm:flex items-center gap-2 text-[#E6C894]">
              <Gift size={12} className="text-[#E6C894] shrink-0" />
              <span className="tracking-[0.18em]">EXCLUSIVE COLLECTIONS</span>
              <span className="opacity-40">|</span>
              <span className="tracking-[0.18em]">SECURE PAYMENTS</span>
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. MAIN LUXURY NAVBAR (WARM IVORY / SILK CREAM)
        ══════════════════════════════════════════════════════════════ */}
        <div className={`relative bg-[#FAF6F0] border-b border-[#EAE0D2] transition-all duration-300 ${scrolled ? 'py-2.5' : 'py-3.5 md:py-4'}`}>
          
          {/* Subtle Botanical Leaf Watermark in Corners */}
          <BotanicalCornerDecor className="absolute -left-4 -bottom-2 w-32 h-20 transform -scale-x-100 hidden lg:block" />
          <BotanicalCornerDecor className="absolute -right-2 -bottom-2 w-36 h-22 hidden lg:block" />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">

            {/* ── Left: AGVIA Official Brand Logo ── */}
            <Link to="/" className="flex items-center shrink-0 group py-0.5">
              <img
                src="/images/agvia-logo.png"
                alt="AGVIA Women's Wear Boutique"
                className="h-11 sm:h-12 lg:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* ── Center: Desktop Navigation Links ── */}
            <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
              
              {/* HOME LINK WITH ORNAMENTAL FLOURISH */}
              <Link
                to="/"
                className="relative py-1 flex flex-col items-center group cursor-pointer"
              >
                <span className={`text-[12px] tracking-[0.18em] uppercase font-semibold transition-colors duration-200 ${
                  isHomeActive ? 'text-[#4A0A16]' : 'text-[#382820] hover:text-[#4A0A16]'
                }`}>
                  HOME
                </span>
                {/* Reference Image Underline Flourish: ──◆── */}
                {isHomeActive ? (
                  <div className="flex items-center justify-center gap-1 mt-1 text-[#B68C48]">
                    <span className="w-3.5 h-[1.5px] bg-[#B68C48]" />
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#B68C48]" />
                    <span className="w-3.5 h-[1.5px] bg-[#B68C48]" />
                  </div>
                ) : (
                  <div className="h-[2.5px] mt-1" />
                )}
              </Link>

              {/* DROPDOWN CATEGORIES */}
              {Object.entries(NAV_CATEGORIES).map(([key, cat]) => {
                const isOpen = activeDropdown === key
                const isActive = location.search.toLowerCase().includes(cat.label.toLowerCase()) || 
                  (key === 'COLLECTIONS' && location.pathname === '/products' && !location.search)

                return (
                  <div
                    key={key}
                    className="relative py-1"
                    onMouseEnter={() => handleMouseEnter(key)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to={cat.path}
                      className={`flex items-center gap-1 text-[12px] tracking-[0.16em] uppercase font-medium transition-colors duration-200 ${
                        isActive || isOpen ? 'text-[#4A0A16] font-semibold' : 'text-[#382820] hover:text-[#4A0A16]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#B68C48]' : 'text-[#382820]/60'}`}
                      />
                    </Link>

                    {/* Dropdown Menu Card */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-72 sm:w-80"
                        >
                          <div className="bg-[#FFFDF9] rounded-2xl shadow-[0_16px_45px_rgba(74,10,22,0.12)] border border-[#EBE1D4] overflow-hidden p-3.5">
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EFE7DC]">
                              <span className="font-serif text-[11px] uppercase tracking-[0.2em] font-bold text-[#4A0A16]">
                                {cat.label}
                              </span>
                              <Link
                                to={cat.path}
                                onClick={() => setActiveDropdown(null)}
                                className="text-[10px] text-[#B68C48] hover:text-[#4A0A16] tracking-wider uppercase font-semibold flex items-center gap-1"
                              >
                                View All <ArrowRight size={10} />
                              </Link>
                            </div>

                            <div className="space-y-2">
                              {cat.items.map((item) => (
                                <Link
                                  key={item.name}
                                  to={item.path}
                                  onClick={() => setActiveDropdown(null)}
                                  className="group/item flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF5ED] transition-colors"
                                >
                                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#E8DEC0]">
                                    <ReliableImage
                                      src={item.img}
                                      alt={item.name}
                                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-serif text-[13px] font-bold text-[#4A0A16] group-hover/item:text-[#B68C48] transition-colors truncate">
                                      {item.name}
                                    </p>
                                    <p className="font-sans text-[10px] text-[#6A5A50] line-clamp-1">
                                      {item.desc}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}

            </nav>

            {/* ── Right: Pill Search Bar & Interactive Icons ── */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 shrink-0">
              
              {/* Pill-shaped Search Bar */}
              <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center">
                <div className="flex items-center gap-2 rounded-full border border-[#DFD3C5] bg-[#FAF6F0] px-3.5 py-1.5 transition-all duration-300 focus-within:border-[#B68C48] focus-within:bg-white focus-within:shadow-[0_2px_12px_rgba(182,140,72,0.12)] w-44 lg:w-56 xl:w-64">
                  <Search size={14} className="text-[#8C7A6B] shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for styles, collections..."
                    className="w-full bg-transparent text-[11.5px] text-[#2C1F18] placeholder-[#9E8E81] focus:outline-none"
                  />
                </div>
              </form>

              {/* User Profile */}
              {isAuthenticated ? (
                <div className="relative group/user flex items-center">
                  <Link
                    to="/profile"
                    className="p-1.5 text-[#382820] hover:text-[#4A0A16] transition-colors"
                    title={`Signed in as ${user?.name || 'Account'}`}
                  >
                    <User size={19} strokeWidth={1.75} />
                  </Link>
                  {/* Subtle hover menu */}
                  <div className="hidden group-hover/user:flex flex-col absolute right-0 top-full pt-2 z-50">
                    <div className="bg-white rounded-xl shadow-lg border border-[#E8DEC0] p-2 min-w-[140px] text-xs">
                      <Link to="/profile" className="px-3 py-1.5 hover:bg-[#FAF6F0] rounded-lg text-[#382820] font-medium block">
                        My Profile
                      </Link>
                      <Link to="/orders" className="px-3 py-1.5 hover:bg-[#FAF6F0] rounded-lg text-[#382820] font-medium block">
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-700 rounded-lg font-medium flex items-center gap-1.5 mt-1 border-t border-gray-100"
                      >
                        <LogOut size={12} /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-1.5 text-[#382820] hover:text-[#4A0A16] transition-colors"
                  title="Sign In / Register"
                >
                  <User size={19} strokeWidth={1.75} />
                </Link>
              )}

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="p-1.5 text-[#382820] hover:text-[#4A0A16] transition-colors"
                title="Wishlist"
              >
                <Heart size={19} strokeWidth={1.75} />
              </Link>

              {/* Shopping Bag Icon */}
              <Link
                to="/cart"
                className="p-1.5 text-[#382820] hover:text-[#4A0A16] transition-colors"
                title="Shopping Bag"
              >
                <ShoppingBag size={19} strokeWidth={1.75} />
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                className="xl:hidden p-1.5 text-[#382820] hover:text-[#4A0A16] transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Mobile Menu"
              >
                <Menu size={22} />
              </button>

            </div>

          </div>
        </div>

      </header>

      {/* ══════════════════════════════════════════════════════════════
          3. MOBILE NAVIGATION DRAWER
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-[60] w-full max-w-sm bg-[#FFFDF9] flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center px-6 py-5 border-b border-[#EAE0D2] bg-[#FAF6F0]">
                <div className="flex items-center">
                  <img
                    src="/images/agvia-logo.png"
                    alt="AGVIA Women's Wear Boutique"
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#4A0A16] hover:bg-white rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="p-4 border-b border-[#EAE0D2]">
                <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }}>
                  <div className="flex items-center gap-2 rounded-full border border-[#DFD3C5] bg-[#FAF6F0] px-3.5 py-2">
                    <Search size={14} className="text-[#8C7A6B]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search styles, sarees, lehengas..."
                      className="w-full bg-transparent text-xs text-[#2C1F18] focus:outline-none"
                    />
                  </div>
                </form>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between font-serif text-[15px] font-semibold text-[#4A0A16] hover:bg-[#FAF6F0] px-4 py-3 rounded-xl transition-all"
                >
                  <span>Home</span>
                  <ArrowRight size={14} className="text-[#B68C48]" />
                </Link>

                <div className="pt-3 pb-1 px-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-[#B68C48]">
                    Boutique Collections
                  </span>
                </div>

                {Object.entries(NAV_CATEGORIES).map(([key, cat]) => (
                  <div key={key} className="space-y-0.5">
                    <Link
                      to={cat.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between font-serif text-[14px] font-medium text-[#382820] hover:text-[#4A0A16] hover:bg-[#FAF6F0] px-4 py-2.5 rounded-xl transition-all"
                    >
                      <span>{cat.label}</span>
                      <ArrowRight size={13} className="text-[#B68C48]/60" />
                    </Link>
                  </div>
                ))}

                <div className="pt-3 pb-1 px-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-[#B68C48]">
                    Account & Privileges
                  </span>
                </div>

                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between font-serif text-[14px] text-[#382820] hover:bg-[#FAF6F0] px-4 py-2.5 rounded-xl transition-all"
                >
                  <span className="flex items-center gap-2"><Heart size={14} className="text-[#4A0A16]" /> Wishlist</span>
                  <ArrowRight size={13} className="text-[#B68C48]/60" />
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between font-serif text-[14px] text-[#382820] hover:bg-[#FAF6F0] px-4 py-2.5 rounded-xl transition-all"
                >
                  <span className="flex items-center gap-2"><ShoppingBag size={14} className="text-[#4A0A16]" /> Shopping Bag</span>
                  <ArrowRight size={13} className="text-[#B68C48]/60" />
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between font-serif text-[14px] text-[#382820] hover:bg-[#FAF6F0] px-4 py-2.5 rounded-xl transition-all"
                >
                  <span>My Orders</span>
                  <ArrowRight size={13} className="text-[#B68C48]/60" />
                </Link>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[#EAE0D2] bg-[#FAF6F0] flex items-center justify-between">
                {isAuthenticated ? (
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="text-xs text-rose-700 font-medium flex items-center gap-1.5"
                  >
                    <LogOut size={14} /> Sign Out ({user?.name?.split(' ')[0]})
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-[#4A0A16] font-semibold tracking-wider uppercase underline"
                  >
                    Sign In to Boutique
                  </Link>
                )}
                <span className="text-[10px] text-[#B68C48] tracking-widest uppercase">
                  AGVIA COUTURE
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
