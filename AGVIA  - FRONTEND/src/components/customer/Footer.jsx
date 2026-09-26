import { Link } from 'react-router-dom'
import { Instagram, Facebook, MapPin, Phone, Mail, ArrowUpRight, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { BUSINESS } from '../../constants/business'
import api from '../../services/api'

export default function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    const email = e.target.email?.value?.trim()
    if (!email) return
    try {
      const { data } = await api.post('/newsletter/subscribe', { email })
      if (data?.data) {
        localStorage.setItem('ps_circle_member', JSON.stringify(data.data))
      }
      toast.success(data?.message || 'Welcome to Pragathi Circle! Code CIRCLE15 unlocked.', {
        icon: '👑',
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
      e.target.reset()
    } catch {
      toast.success('Welcome to Pragathi Circle! Your VIP perks are active.', {
        icon: '👑',
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
      e.target.reset()
    }
  }

  return (
    <footer className="relative text-[#FFFDF8] pt-8 md:pt-10 pb-5 md:pb-6 border-t border-[#C9A45C]/20 select-none overflow-hidden font-body">
      
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-105"
        style={{ backgroundImage: `url('/images/hero_banner.jpg')` }}
      />
      {/* Deep Burgundy & Charcoal Luxury Vignette Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#18060B]/95 via-[#130508]/94 to-[#0C0305]/98 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#5A1020]/30 via-transparent to-transparent pointer-events-none" />

      {/* Decorative Subtle Gold Glow */}
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#C9A45C]/10 filter blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#5A1020]/15 filter blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-6 md:pb-8 border-b border-[#C9A45C]/15">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="flex items-center select-none mb-3 group">
              <img
                src="/images/agvia-logo.png"
                alt="AGVIA Women's Wear Boutique"
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 brightness-110 drop-shadow-[0_2px_12px_rgba(201,164,92,0.25)]"
              />
            </Link>
            <p className="font-sans text-xs tracking-wider text-white/70 leading-normal max-w-sm mb-3.5">
              {BUSINESS.description}
            </p>
            <div className="flex gap-3">
              {[{ Icon: Instagram, link: BUSINESS.social.instagram }, { Icon: Facebook, link: BUSINESS.social.facebook }].map(({ Icon, link }, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Social Link"
                  className="w-8 h-8 rounded-full border border-[#C9A45C]/30 flex items-center justify-center text-[#C9A45C] hover:text-white hover:border-[#C9A45C] transition-all duration-300"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-serif text-xs tracking-widest text-[#C9A45C] uppercase mb-3 font-semibold">
                Collections
              </h4>
              <ul className="space-y-2 font-sans text-xs tracking-wider text-white/70">
                <li><Link to="/products?category=Sarees" className="hover:text-[#C9A45C] transition-colors">Pure Silk Sarees</Link></li>
                <li><Link to="/products?category=Lehengas" className="hover:text-[#C9A45C] transition-colors">Bridal Lehengas</Link></li>
                <li><Link to="/products?category=Anarkalis+%26+Kurtas" className="hover:text-[#C9A45C] transition-colors">Handcrafted Anarkalis</Link></li>
                <li><Link to="/products?category=Dresses+%26+Gowns" className="hover:text-[#C9A45C] transition-colors">Evening Gowns</Link></li>
                <li><Link to="/orders" className="hover:text-[#C9A45C] transition-colors">Track Orders</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-xs tracking-widest text-[#C9A45C] uppercase mb-3 font-semibold">
                Boutique Flagship
              </h4>
              <ul className="space-y-2 font-sans text-xs tracking-wider text-white/70">
                <li className="flex items-start gap-2">
                  <MapPin size={12} className="text-[#C9A45C] mt-0.5 shrink-0" />
                  <span>{BUSINESS.location.street},<br />{BUSINESS.location.city}, {BUSINESS.location.state}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={12} className="text-[#C9A45C] shrink-0" />
                  <a href={`tel:${BUSINESS.contact.phoneRaw}`} className="hover:text-[#C9A45C] transition-colors">{BUSINESS.contact.phone}</a>
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={12} className="text-[#C9A45C] shrink-0" />
                  <span>{BUSINESS.contact.hours}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <h4 className="font-serif text-xs tracking-widest text-[#C9A45C] uppercase mb-2 font-semibold">
              The AGVIA Edit
            </h4>
            <p className="font-sans text-xs text-white/60 tracking-wider mb-3 leading-normal">
              Subscribe to receive private invitations to new bridal drops, seasonal couture previews, and VIP atelier appointments.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center border-b border-[#C9A45C]/40 pb-1.5">
              <Mail size={13} className="text-[#C9A45C] mr-2.5 shrink-0" />
              <input
                type="email"
                name="email"
                placeholder="YOUR EMAIL ADDRESS"
                required
                className="w-full bg-transparent text-xs tracking-widest font-sans text-white placeholder-white/30 focus:outline-none uppercase"
              />
              <button
                type="submit"
                className="text-[#C9A45C] hover:text-white p-0.5 transition-colors"
                aria-label="Subscribe"
              >
                <ArrowUpRight size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between font-sans text-[9.5px] text-white/50 tracking-widest uppercase">
          <div>
            © {new Date().getFullYear()} AGVIA WOMEN'S WEAR BOUTIQUE. ALL RIGHTS RESERVED.
          </div>
          <button
            onClick={handleScrollTop}
            className="mt-2 sm:mt-0 text-[#B8860B] hover:text-white flex items-center gap-1 transition-colors border-b border-[#B8860B]/10 pb-0.5 hover:border-[#B8860B]"
          >
            <span>Back to top</span>
            <ArrowUpRight size={11} />
          </button>
        </div>
      </div>
    </footer>
  )
}
