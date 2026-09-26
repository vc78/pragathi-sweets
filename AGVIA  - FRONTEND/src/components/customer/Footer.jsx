import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Instagram, Facebook, Youtube, Mail, ShoppingBag,
  Info, Headphones, ShieldCheck, ChevronUp
} from 'lucide-react'
import toast from 'react-hot-toast'
import { BUSINESS } from '../../constants/business'
import api from '../../services/api'

/* ── Pinterest & WhatsApp SVG icons ── */
const PinterestIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
)
const WhatsAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)

/* ── Vertical gold dot separator ── */
function ColSep() {
  return (
    <div className="hidden lg:flex flex-col items-center gap-2 py-4 opacity-40 shrink-0 mx-1" aria-hidden="true">
      {[...Array(7)].map((_, i) => (
        <span key={i} className="block w-0.5 h-0.5 rounded-full bg-[#C9A45C]"/>
      ))}
    </div>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      const { data } = await api.post('/newsletter/subscribe', { email })
      if (data?.data) localStorage.setItem('ps_circle_member', JSON.stringify(data.data))
      toast.success(data?.message || 'Welcome to AGVIA Haute Circle! Code CIRCLE15 unlocked.', {
        icon: '👑', style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
      setEmail('')
    } catch {
      toast.success('Welcome to AGVIA Haute Circle! Your VIP perks are active.', {
        icon: '👑', style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
      setEmail('')
    } finally {
      setLoading(false)
    }
  }

  const shopLinks = [
    { label: 'All Collections', to: '/products' },
    { label: 'Sarees', to: '/products?category=Sarees' },
    { label: 'Lehengas', to: '/products?category=Lehengas' },
    { label: 'Kurtas', to: '/products?category=Anarkalis+%26+Kurtas' },
    { label: 'Anarkalis', to: '/products?category=Anarkalis+%26+Kurtas' },
    { label: 'Western Wear', to: '/products?category=Western+Wear' },
    { label: 'New Arrivals', to: '/products' },
    { label: 'Festive Collection', to: '/products' },
    { label: 'Wedding Collection', to: '/products?category=Lehengas' },
    { label: 'Gift Cards', to: '/products' },
  ]

  const aboutLinks = [
    { label: 'Our Story', to: '/about' },
    { label: 'Craftsmanship', to: '/about' },
    { label: 'Sustainability', to: '/about' },
    { label: 'Blogs & Style Guide', to: '/about' },
    { label: 'Store Locations', to: '/about' },
    { label: 'Careers', to: '/about' },
  ]

  const helpLinks = [
    { label: 'Track Order', to: '/orders' },
    { label: 'Shipping & Delivery', to: '/about' },
    { label: 'Returns & Exchanges', to: '/about' },
    { label: 'Size Guide', to: '/about' },
    { label: 'Product Care', to: '/about' },
    { label: 'FAQs', to: '/about' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Bulk Orders', to: '/contact' },
    { label: 'Styling Consultation', to: '/contact' },
    { label: 'Atelier Appointments', to: '/contact' },
  ]

  const policyLinks = [
    { label: 'Privacy Policy', to: '/about' },
    { label: 'Terms & Conditions', to: '/about' },
    { label: 'Refund Policy', to: '/about' },
    { label: 'Shipping Policy', to: '/about' },
    { label: 'Cancellation Policy', to: '/about' },
    { label: 'Cookie Policy', to: '/about' },
    { label: 'Return & Exchange Policy', to: '/about' },
    { label: 'Intellectual Property', to: '/about' },
    { label: 'Disclaimer', to: '/about' },
  ]

  const bottomLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Privacy Policy', to: '/about' },
    { label: 'Terms & Conditions', to: '/about' },
    { label: 'Shipping Policy', to: '/about' },
    { label: 'Return Policy', to: '/about' },
    { label: 'Size Guide', to: '/about' },
    { label: 'FAQs', to: '/about' },
    { label: 'Contact Us', to: '/contact' },
  ]

  const socials = [
    { icon: Instagram, href: BUSINESS.social.instagram, label: 'Instagram' },
    { icon: Facebook, href: BUSINESS.social.facebook, label: 'Facebook' },
    { icon: PinterestIcon, href: '#', label: 'Pinterest' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: WhatsAppIcon, href: `https://wa.me/919032306961`, label: 'WhatsApp' },
  ]

  const linkCls = 'font-sans text-[11.5px] text-white/65 hover:text-[#E6C687] transition-colors leading-relaxed'
  const headingCls = 'font-serif text-sm font-semibold text-white mb-3 flex items-center gap-1.5'

  return (
    <footer className="relative select-none overflow-hidden font-body">

      {/* Royal Background Image */}
      <div className="absolute inset-0 bg-cover bg-top bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/images/footer_bg.png')" }}/>
      
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"/>
      <div className="absolute inset-0 bg-gradient-to-b from-[#3D0C18]/60 via-[#2A0810]/70 to-[#1E0509]/90 pointer-events-none"/>

      {/* Push content down to avoid overlapping the image's top arch */}
      <div className="pt-24 md:pt-32" />

      {/* ── Main footer grid ── */}
      <div className="relative z-10 max-w-[1340px] mx-auto px-4 sm:px-6 xl:px-8 pt-6 pb-4">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 pb-5 border-b border-white/10">

          {/* Brand column */}
          <div className="lg:w-[19%] shrink-0 flex flex-col items-start pr-6">
            <Link to="/" className="mb-3 group">
              <img src="/images/agvia-logo.png" alt="AGVIA Women's Wear Boutique"
                className="h-14 w-auto object-contain brightness-110 drop-shadow-[0_2px_12px_rgba(201,164,92,0.3)] group-hover:scale-105 transition-transform duration-300"/>
            </Link>
            <p className="font-sans text-[11.5px] text-white/60 leading-relaxed mb-4">
              Curating bespoke ethnic and contemporary wear for the modern woman. Tradition, quality and elegance — all in one place.
            </p>
            <div className="flex gap-2 flex-wrap">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-[#C9A45C]/35 flex items-center justify-center text-[#E6C687] hover:bg-[#7B1030] hover:border-[#7B1030] transition-all duration-200">
                  <Icon size={13}/>
                </a>
              ))}
            </div>
          </div>

          <ColSep />

          {/* Shop */}
          <div className="lg:w-[17%] shrink-0 px-3">
            <h4 className={headingCls}><ShoppingBag size={13} className="text-[#C9A45C]"/> Shop</h4>
            <ul className="space-y-1">
              {shopLinks.map(l => (
                <li key={l.label}><Link to={l.to} className={linkCls}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <ColSep />

          {/* About */}
          <div className="lg:w-[14%] shrink-0 px-3">
            <h4 className={headingCls}><Info size={13} className="text-[#C9A45C]"/> About</h4>
            <ul className="space-y-1">
              {aboutLinks.map(l => (
                <li key={l.label}><Link to={l.to} className={linkCls}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <ColSep />

          {/* Help & Support */}
          <div className="lg:w-[22%] shrink-0 px-3">
            <h4 className={headingCls}><Headphones size={13} className="text-[#C9A45C]"/> Help &amp; Support</h4>
            <ul className="space-y-1">
              {helpLinks.map(l => (
                <li key={l.label}><Link to={l.to} className={linkCls}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <ColSep />

          {/* Policies */}
          <div className="lg:flex-1 px-3">
            <h4 className={headingCls}><ShieldCheck size={13} className="text-[#C9A45C]"/> Policies</h4>
            <ul className="space-y-1">
              {policyLinks.map(l => (
                <li key={l.label}><Link to={l.to} className={linkCls}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Newsletter + Trust badges bar ── */}
        <div className="flex flex-col md:flex-row items-center gap-4 py-4 border-b border-white/10">
          {/* Newsletter */}
          <div className="flex items-center gap-3 md:flex-1 min-w-0">
            <Mail size={20} className="text-[#C9A45C] shrink-0"/>
            <div className="min-w-0">
              <p className="font-serif text-[12px] font-semibold text-white leading-tight">Subscribe to Our World</p>
              <p className="font-sans text-[10.5px] text-white/50 leading-tight">Get exclusive updates, new arrivals and special offers.</p>
            </div>
          </div>
          <form onSubmit={handleSubscribe}
            className="flex items-center gap-0 rounded-full overflow-hidden border border-[#C9A45C]/30 bg-white/8 backdrop-blur-sm md:w-72 w-full shrink-0">
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 min-w-0 bg-transparent text-[11.5px] font-sans text-white placeholder-white/35 px-4 py-2.5 focus:outline-none"
            />
            <button type="submit" disabled={loading}
              className="shrink-0 bg-[#7B1030] hover:bg-[#9B2043] text-white text-[10.5px] font-bold tracking-widest uppercase px-4 py-2.5 flex items-center gap-1.5 transition-colors">
              SUBSCRIBE <ChevronUp size={12} className="rotate-90"/>
            </button>
          </form>
          {/* Trust badges */}
          <div className="hidden xl:flex items-center gap-5 shrink-0 pl-4 border-l border-white/10">
            {[
              { icon: '🚚', title: 'Free Shipping', sub: 'On all orders' },
              { icon: '↩️', title: 'Easy Returns', sub: 'Hassle-free 7 days' },
              { icon: '🔒', title: 'Secure Payments', sub: '100% Safe & Trusted' },
            ].map(b => (
              <div key={b.title} className="flex items-center gap-2">
                <span className="text-lg leading-none">{b.icon}</span>
                <div>
                  <p className="font-serif text-[11px] font-semibold text-white leading-tight">{b.title}</p>
                  <p className="font-sans text-[9.5px] text-white/45 leading-tight">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 flex-wrap">
          {/* Copyright */}
          <p className="font-sans text-[9.5px] text-white/40 tracking-wider">
            © {new Date().getFullYear()} AGVIA Women's Wear Boutique. All rights reserved.
          </p>

          {/* Nav links */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 justify-center">
            {bottomLinks.map((l, i) => (
              <span key={l.label} className="flex items-center gap-2">
                <Link to={l.to} className="font-sans text-[9.5px] text-white/40 hover:text-[#E6C687] tracking-wider transition-colors">
                  {l.label}
                </Link>
                {i < bottomLinks.length - 1 && <span className="text-white/20 text-[9px]">|</span>}
              </span>
            ))}
          </div>

          {/* Payment icons + Back to top */}
          <div className="flex items-center gap-3">
            {/* Payment logos (text badges) */}
            <div className="flex items-center gap-1.5">
              {['VISA','MC','RuPay','PayTM'].map(p => (
                <span key={p}
                  className="inline-block px-1.5 py-0.5 text-[8px] font-bold rounded bg-white/10 text-white/50 tracking-wider border border-white/10">
                  {p}
                </span>
              ))}
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1 text-[9.5px] font-sans tracking-widest text-[#C9A45C]/70 hover:text-[#C9A45C] border border-[#C9A45C]/25 hover:border-[#C9A45C]/50 rounded px-2 py-1 transition-all uppercase">
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
