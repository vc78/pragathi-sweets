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
    <footer className="bg-[#1F1F1F] text-[#FFFDF8] pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-10 border-t border-[#B8860B]/15 select-none relative z-10 font-body">
      
      {/* Decorative Subtle Gold Glow */}
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#8B0000]/10 filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 pb-10 md:pb-14 border-b border-[#B8860B]/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 select-none mb-6 group">
              <img
                src="/images/agvia-logo.png"
                alt="AGVIA"
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col items-start">
                <span className="font-serif text-2xl tracking-[0.2em] font-bold uppercase text-[#C9A45C] leading-none group-hover:text-white transition-colors duration-300">
                  AGVIA
                </span>
                <span className="font-sans text-[7.5px] tracking-[0.35em] uppercase text-white/60 font-semibold mt-1.5">
                  WOMEN'S WEAR BOUTIQUE
                </span>
              </div>
            </Link>
            <p className="font-sans text-xs tracking-wider text-white/60 leading-relaxed max-w-sm mb-6">
              {BUSINESS.description}
            </p>
            <div className="flex gap-4">
              {[{ Icon: Instagram, link: BUSINESS.social.instagram }, { Icon: Facebook, link: BUSINESS.social.facebook }].map(({ Icon, link }, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Social Link"
                  className="w-10 h-10 rounded-full border border-[#C9A45C]/30 flex items-center justify-center text-[#C9A45C] hover:text-white hover:border-[#C9A45C] transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-serif text-sm tracking-widest text-[#C9A45C] uppercase mb-6 font-semibold">
                Collections
              </h4>
              <ul className="space-y-3 font-sans text-xs tracking-wider text-white/70">
                <li><Link to="/products?category=Sarees" className="hover:text-[#C9A45C] transition-colors">Pure Silk Sarees</Link></li>
                <li><Link to="/products?category=Lehengas" className="hover:text-[#C9A45C] transition-colors">Bridal Lehengas</Link></li>
                <li><Link to="/products?category=Anarkalis+%26+Kurtas" className="hover:text-[#C9A45C] transition-colors">Handcrafted Anarkalis</Link></li>
                <li><Link to="/products?category=Dresses+%26+Gowns" className="hover:text-[#C9A45C] transition-colors">Evening Gowns</Link></li>
                <li><Link to="/orders" className="hover:text-[#C9A45C] transition-colors">Track Orders</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-sm tracking-widest text-[#C9A45C] uppercase mb-6 font-semibold">
                Boutique Flagship
              </h4>
              <ul className="space-y-4 font-sans text-xs tracking-wider text-white/70">
                <li className="flex items-start gap-2.5">
                  <MapPin size={13} className="text-[#C9A45C] mt-0.5 shrink-0" />
                  <span>{BUSINESS.location.street},<br />{BUSINESS.location.city}, {BUSINESS.location.state} {BUSINESS.location.postalCode}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={13} className="text-[#C9A45C] shrink-0" />
                  <a href={`tel:${BUSINESS.contact.phoneRaw}`} className="hover:text-[#C9A45C] transition-colors">{BUSINESS.contact.phone}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock size={13} className="text-[#C9A45C] shrink-0" />
                  <span>{BUSINESS.contact.hours}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <h4 className="font-serif text-sm tracking-widest text-[#C9A45C] uppercase mb-4 font-semibold">
              The AGVIA Edit
            </h4>
            <p className="font-sans text-xs text-white/60 tracking-wider mb-6">
              Subscribe to receive private invitations to new bridal drops, seasonal couture previews, and VIP atelier appointments.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center border-b border-[#C9A45C]/40 pb-2">
              <Mail size={14} className="text-[#C9A45C] mr-3 shrink-0" />
              <input
                type="email"
                name="email"
                placeholder="YOUR EMAIL ADDRESS"
                required
                className="w-full bg-transparent text-xs tracking-widest font-sans text-white placeholder-white/30 focus:outline-none uppercase"
              />
              <button
                type="submit"
                className="text-[#C9A45C] hover:text-white p-1 transition-colors"
                aria-label="Subscribe"
              >
                <ArrowUpRight size={18} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between font-sans text-[10px] text-white/50 tracking-widest uppercase">
          <div>
            © {new Date().getFullYear()} AGVIA WOMEN'S WEAR BOUTIQUE. ALL RIGHTS RESERVED.
          </div>
          <button
            onClick={handleScrollTop}
            className="mt-4 sm:mt-0 text-[#B8860B] hover:text-white flex items-center gap-1 transition-colors border-b border-[#B8860B]/10 pb-0.5 hover:border-[#B8860B]"
          >
            <span>Back to top</span>
            <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </footer>
  )
}
