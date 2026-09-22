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
    <footer className="bg-[#1F1F1F] text-[#FFFDF8] pt-20 pb-10 border-t border-[#B8860B]/15 select-none relative z-10 font-body">
      
      {/* Decorative Subtle Gold Glow */}
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#8B0000]/10 filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-[#B8860B]/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="flex flex-col items-start select-none mb-6 group">
              <span className="font-display text-2xl tracking-[0.2em] font-bold uppercase text-[#B8860B] leading-none group-hover:text-white transition-colors duration-300">
                PRAGATHI
              </span>
              <span className="font-body text-[8px] tracking-[0.38em] uppercase text-white/50 font-semibold mt-1.5 pl-[1px]">
                SWEETS & SAVOURIES
              </span>
            </Link>
            <p className="font-body text-xs tracking-wider text-white/60 leading-relaxed max-w-sm mb-6">
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
                  className="w-10 h-10 rounded-full border border-[#B8860B]/20 flex items-center justify-center text-[#B8860B] hover:text-white hover:border-[#B8860B] transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-display text-sm tracking-widest text-[#B8860B] uppercase mb-6 font-semibold">
                Explore
              </h4>
              <ul className="space-y-3 font-body text-xs tracking-wider text-white/60">
                <li><Link to="/products" className="hover:text-white transition-colors">Our Collection</Link></li>
                <li><Link to="/products?category=Festival%20Hampers" className="hover:text-white transition-colors">Gift Boxes</Link></li>
                <li><Link to="/orders" className="hover:text-white transition-colors">Track Orders</Link></li>
                <li><Link to="/profile" className="hover:text-white transition-colors">Loyalty Rewards</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm tracking-widest text-[#B8860B] uppercase mb-6 font-semibold">
                Heritage Boutique
              </h4>
              <ul className="space-y-4 font-body text-xs tracking-wider text-white/60">
                <li className="flex items-start gap-2.5">
                  <MapPin size={13} className="text-[#B8860B] mt-0.5 shrink-0" />
                  <span>{BUSINESS.location.street},<br />{BUSINESS.location.city}, {BUSINESS.location.state} {BUSINESS.location.postalCode}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={13} className="text-[#B8860B] shrink-0" />
                  <a href={`tel:${BUSINESS.contact.phoneRaw}`} className="hover:text-white transition-colors">{BUSINESS.contact.phone}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock size={13} className="text-[#B8860B] shrink-0" />
                  <span>{BUSINESS.contact.hours}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <h4 className="font-display text-sm tracking-widest text-[#B8860B] uppercase mb-4 font-semibold">
              The Pragathi Letter
            </h4>
            <p className="font-body text-xs text-white/60 tracking-wider mb-6">
              Subscribe to receive exclusive access to limited-edition festive drops, heritage recipes, and private luxury gifting options.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center border-b border-[#B8860B]/30 pb-2">
              <Mail size={14} className="text-[#B8860B] mr-3 shrink-0" />
              <input
                type="email"
                name="email"
                placeholder="YOUR EMAIL ADDRESS"
                required
                className="w-full bg-transparent text-xs tracking-widest font-body text-white placeholder-white/30 focus:outline-none uppercase"
              />
              <button
                type="submit"
                className="text-[#B8860B] hover:text-white p-1 transition-colors"
                aria-label="Subscribe"
              >
                <ArrowUpRight size={18} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between font-body text-[10px] text-white/40 tracking-widest uppercase">
          <div>
            © {new Date().getFullYear()} PRAGATHI SWEETS. ALL RIGHTS RESERVED.
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
