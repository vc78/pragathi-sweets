import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  ShoppingCart, Menu, X, User, Search, Heart, LogOut,
  ArrowRight, Trash2, Plus, Minus, Phone, MapPin, Clock,
  ChevronDown, Gift, Star, Cake, Package, Crown
} from 'lucide-react'
import { loggedOut } from '../../store/authSlice'
import { useCart } from '../../hooks/useCart'
import { motion, AnimatePresence } from 'framer-motion'
import AnnouncementTicker from './AnnouncementTicker'
import ReliableImage from '../common/ReliableImage'

const MEGA_MENU_CATEGORIES = [
  {
    label: 'Milk Sweets',
    icon: '🥛',
    desc: 'Creamy handcrafted classics',
    image: '/images/pexels-divigraphy-8624624.jpg',
    path: '/products?category=Milk+Sweets',
  },
  {
    label: 'Dry Fruit Sweets',
    icon: '🌰',
    desc: 'Premium nut confections',
    image: '/images/pexels-gaurav-kumar-1281378-18488298.jpg',
    path: '/products?category=Dry+Fruit+Sweets',
  },
  {
    label: 'Bengali Sweets',
    icon: '🍮',
    desc: 'Artisanal Eastern delights',
    image: '/images/pexels-gaurav-kumar-1281378-18488316.jpg',
    path: '/products?category=Bengali+Sweets',
  },
  {
    label: 'Savouries',
    icon: '🫙',
    desc: 'Crunchy spiced blends',
    image: '/images/pexels-kailashkumarphotography-11887844.jpg',
    path: '/products?category=Savouries',
  },
  {
    label: 'Festival Hampers',
    icon: '🎁',
    desc: 'Curated gifting boxes',
    image: '/images/pexels-jonathanborba-19863265.jpg',
    path: '/products?category=Festival+Hampers',
  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const megaMenuRef = useRef(null)
  const megaTimerRef = useRef(null)

  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { items, updateQty, removeFromCart, subtotal, count } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setCartDrawerOpen(false)
    setSearchOpen(false)
    setMegaMenuOpen(false)
  }, [location])

  const handleLogout = () => { dispatch(loggedOut()); navigate('/') }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const openMega = () => {
    clearTimeout(megaTimerRef.current)
    setMegaMenuOpen(true)
  }
  const closeMega = () => {
    megaTimerRef.current = setTimeout(() => setMegaMenuOpen(false), 120)
  }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products', hasMega: true },
    { to: '/orders', label: 'My Orders' },
  ]

  const headerBg = scrolled
    ? 'bg-white/95 backdrop-blur-xl shadow-[0_4px_32px_rgba(139,0,0,0.08)] border-b border-gold/20'
    : 'bg-white border-b border-gold/10'

  return (
    <>
      <div className="h-[88px] md:h-[96px]" /> {/* Spacer for fixed header */}

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}>

        {/* ── TOP ANNOUNCEMENT SCROLLER ── */}
        <AnnouncementTicker />

        {/* ── MAIN NAVBAR ── */}
        <div className={`max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between transition-all duration-500 ${scrolled ? 'py-3' : 'py-4'}`}>

          {/* Logo */}
          <Link to="/" className="flex flex-col items-start select-none group shrink-0">
            <motion.span
              className="font-display text-2xl md:text-3xl tracking-[0.15em] font-bold uppercase text-[#8B0000] leading-none group-hover:text-[#B8860B] transition-colors duration-300"
            >
              PRAGATHI
            </motion.span>
            <span className="font-body text-[8px] tracking-[0.42em] uppercase text-[#B8860B] font-semibold mt-0.5 pl-[1px]">
              SWEETS & SAVOURIES
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = link.hasMega
                ? location.pathname.startsWith('/products')
                : location.pathname === link.to
              return link.hasMega ? (
                <div
                  key={link.to}
                  className="relative"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                  ref={megaMenuRef}
                >
                  <button
                    className={`flex items-center gap-1 font-body text-xs tracking-widest uppercase transition-colors duration-300 py-1 ${
                      isActive ? 'text-[#8B0000] font-bold' : 'text-[#3A2D23]/70 hover:text-[#8B0000]'
                    }`}
                  >
                    {link.label}
                    <motion.span
                      animate={{ rotate: megaMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={12} />
                    </motion.span>
                  </button>
                  {isActive && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8860B]" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}

                  {/* MEGA MENU */}
                  <AnimatePresence>
                    {megaMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        onMouseEnter={openMega}
                        onMouseLeave={closeMega}
                        className="fixed left-0 right-0 top-[88px] bg-white/98 backdrop-blur-xl border-t border-b border-gold/15 shadow-[0_20px_60px_rgba(0,0,0,0.12)] z-50"
                      >
                        <div className="max-w-7xl mx-auto px-8 py-8">
                          <div className="grid grid-cols-5 gap-4">
                            {MEGA_MENU_CATEGORIES.map((cat) => (
                              <Link
                                key={cat.label}
                                to={cat.path}
                                onClick={() => setMegaMenuOpen(false)}
                                className="group flex flex-col rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 hover:shadow-[0_8px_32px_rgba(184,134,11,0.12)] transition-all duration-300 bg-[#FFFDF8]"
                              >
                                <div className="h-28 overflow-hidden">
                                  <ReliableImage
                                    src={cat.image}
                                    alt={cat.label}
                                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>
                                <div className="p-3">
                                  <span className="text-base">{cat.icon}</span>
                                  <p className="font-display text-sm font-semibold text-[#8B0000] mt-1">{cat.label}</p>
                                  <p className="font-body text-[10px] text-[#3A2D23]/60 mt-0.5">{cat.desc}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-6 pt-5 border-t border-gold/10 flex items-center gap-6">
                            <Link to="/products" onClick={() => setMegaMenuOpen(false)} className="flex items-center gap-2 text-xs font-semibold text-[#B8860B] hover:text-[#8B0000] tracking-widest uppercase transition-colors">
                              View All Products <ArrowRight size={14} />
                            </Link>
                            <span className="text-[#3A2D23]/30">|</span>
                            <span className="flex items-center gap-2 text-xs text-[#3A2D23]/50">
                              <Gift size={12} /> Festival Hampers Available
                            </span>
                            <span className="flex items-center gap-2 text-xs text-[#3A2D23]/50">
                              <Cake size={12} /> Wedding Orders — Custom Quotes
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-body text-xs tracking-widest uppercase transition-colors relative py-1 duration-300 ${
                    isActive ? 'text-[#8B0000] font-bold' : 'text-[#3A2D23]/70 hover:text-[#8B0000]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8860B]" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-4 md:gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-[#3A2D23]/70 hover:text-[#8B0000] transition-colors duration-200"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/subscription" title="Pragathi Circle VIP" className="p-1.5 text-[#B8860B] hover:text-[#8B0000] transition-colors" >
                  <Crown size={15} />
                </Link>
                <Link to="/profile" className="flex items-center gap-2 text-xs tracking-wider font-body text-[#3A2D23]/70 hover:text-[#8B0000] uppercase transition-colors">
                  <User size={15} className="text-[#B8860B]" />
                  {user?.name?.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="p-1.5 text-[#3A2D23]/50 hover:text-red-700 transition-colors" title="Logout">
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:inline-flex items-center gap-2 text-xs tracking-widest font-body font-semibold text-[#8B0000] hover:text-[#B8860B] uppercase border-b-2 border-[#8B0000]/30 hover:border-[#B8860B] pb-0.5 transition-all duration-200">
                Sign In
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 text-[#3A2D23]/70 hover:text-[#8B0000] transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-[#8B0000] text-white text-[9px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold px-1"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 text-[#3A2D23]/80 hover:text-[#8B0000] transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ── SEARCH OVERLAY ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#1F1F1F]/95 flex flex-col justify-center px-6 md:px-24"
          >
            <button onClick={() => setSearchOpen(false)} className="absolute top-8 right-8 text-white/60 hover:text-[#E6C687] p-2 transition-colors">
              <X size={26} />
            </button>
            <div className="max-w-3xl mx-auto w-full">
              <p className="font-display text-sm italic text-[#E6C687]/70 mb-5 text-center tracking-widest uppercase">
                What are you craving today?
              </p>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search sweets, hampers, gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#B8860B]/40 py-5 text-2xl md:text-4xl text-white font-display placeholder-white/20 focus:outline-none focus:border-[#E6C687] tracking-wide transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#B8860B] hover:text-[#E6C687] p-2 transition-colors">
                  <ArrowRight size={28} />
                </button>
              </form>
              <div className="flex gap-3 flex-wrap mt-6">
                <span className="text-xs text-white/30 py-1 tracking-widest uppercase">Popular:</span>
                {['Kaju Katli', 'Ladoo', 'Gift Box', 'Mysore Pak', 'Rasgulla'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => { setSearchQuery(term); navigate(`/products?search=${encodeURIComponent(term)}`); setSearchOpen(false) }}
                    className="text-xs text-[#E6C687]/75 hover:text-[#E6C687] border border-[#B8860B]/30 hover:border-[#B8860B] px-3 py-1.5 rounded-full transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-[60] bg-black" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="fixed inset-y-0 right-0 z-[60] w-full max-w-sm bg-[#FFFDF8] flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-5 border-b border-gold/10">
                <span className="font-display text-xl uppercase tracking-[0.2em] text-[#8B0000] font-bold">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[#3A2D23]/60 hover:text-[#8B0000] transition-colors"><X size={20} /></button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto p-6 space-y-1">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/products', label: 'All Products' },
                  ...MEGA_MENU_CATEGORIES.map(c => ({ to: c.path, label: c.icon + ' ' + c.label })),
                  { to: '/orders', label: 'My Orders' },
                ].map((link) => (
                  <Link
                    key={link.to + link.label}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block font-body text-sm font-medium text-[#3A2D23] hover:text-[#8B0000] hover:bg-[#F5E6C8]/50 px-4 py-3 rounded-xl transition-all"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="h-px bg-gold/15 my-4" />

                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block font-body text-sm font-medium text-[#3A2D23] hover:text-[#8B0000] hover:bg-[#F5E6C8]/50 px-4 py-3 rounded-xl transition-all">
                      👤 Profile Settings
                    </Link>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false) }} className="flex items-center gap-2 text-red-700 font-body text-sm font-medium px-4 py-3 rounded-xl hover:bg-red-50 w-full transition-all">
                      <LogOut size={15} /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full text-center mt-4 block">
                    Sign In
                  </Link>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gold/10 text-center text-[9px] text-[#3A2D23]/30 tracking-widest uppercase">
                Pragathi Sweets © {new Date().getFullYear()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── CART DRAWER ── */}
      <AnimatePresence>
        {cartDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setCartDrawerOpen(false)} className="fixed inset-0 z-[60] bg-black" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.38, ease: 'easeOut' }}
              className="fixed inset-y-0 right-0 z-[60] w-full max-w-md bg-[#FFFDF8] flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gold/15 flex justify-between items-center bg-[#F5E6C8]/30">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={17} className="text-[#8B0000]" />
                  <span className="font-display text-base font-bold uppercase tracking-wider text-[#8B0000]">Your Cart</span>
                  {count > 0 && <span className="text-xs text-[#3A2D23]/50 font-body">({count} items)</span>}
                </div>
                <button onClick={() => setCartDrawerOpen(false)} className="p-2 text-[#3A2D23]/50 hover:text-[#8B0000] transition-colors"><X size={18} /></button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                    <Package size={48} className="text-[#B8860B]/20" />
                    <p className="text-sm text-[#3A2D23]/50 font-body italic">Your box awaits its first treasure.</p>
                    <Link to="/products" onClick={() => setCartDrawerOpen(false)} className="btn-outline">Explore Sweets</Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div layout key={item.id} className="flex gap-4 p-4 border border-gold/15 rounded-2xl bg-white hover:border-gold/30 transition-all">
                      <ReliableImage src={item.image} alt={item.name} className="w-16 h-16 rounded-xl border border-gold/10 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-bold text-[#8B0000] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#3A2D23]/40 mt-0.5 font-body">₹{item.price} / {item.unit}</p>
                        <div className="flex items-center border border-gold/30 rounded-full w-fit mt-2 bg-white overflow-hidden">
                          <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2.5 py-1 hover:bg-[#F5E6C8] text-[#3A2D23]/60 transition-colors"><Minus size={10} /></button>
                          <span className="px-2.5 text-xs font-bold text-[#3A2D23]">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2.5 py-1 hover:bg-[#F5E6C8] text-[#3A2D23]/60 transition-colors"><Plus size={10} /></button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <span className="font-display font-bold text-sm text-[#8B0000]">₹{item.price * item.qty}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-[#3A2D23]/25 hover:text-red-600 transition-colors p-1"><Trash2 size={13} /></button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-5 border-t border-gold/15 bg-[#F5E6C8]/20 space-y-3">
                  <div className="flex justify-between text-xs text-[#3A2D23]/60 font-body">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#3A2D23]">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#3A2D23]/60 font-body">
                    <span>Delivery</span>
                    <span className="text-green-700 font-semibold">{subtotal >= 999 ? 'FREE' : '₹50'}</span>
                  </div>
                  {subtotal < 999 && (
                    <div className="w-full bg-[#F5E6C8] rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="h-full bg-[#B8860B] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                  )}
                  {subtotal < 999 && (
                    <p className="text-[10px] text-[#3A2D23]/50 font-body">Add ₹{999 - subtotal} more for free delivery</p>
                  )}
                  <div className="border-t border-gold/10 pt-3 flex justify-between font-display text-sm font-bold text-[#8B0000]">
                    <span>Total</span>
                    <span>₹{subtotal >= 999 ? subtotal : subtotal + 50}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <Link to="/cart" onClick={() => setCartDrawerOpen(false)} className="btn-outline !py-3 !px-2 text-[10px] text-center">View Cart</Link>
                    <Link to="/checkout" onClick={() => setCartDrawerOpen(false)} className="btn-primary !py-3 !px-2 text-[10px] text-center flex items-center justify-center gap-1">
                      Checkout <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
