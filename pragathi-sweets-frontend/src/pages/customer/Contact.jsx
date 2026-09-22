import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { BUSINESS } from '../../constants/business'

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success("Thank you for your message! Our representative will contact you shortly.", {
      style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
    })
    e.target.reset()
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-24">
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#B8860B] uppercase block text-center mb-3">✦ Get In Touch ✦</span>
        <h1 className="font-display text-4xl md:text-5xl text-[#8B0000] font-bold text-center mb-12">Contact Our Boutiques</h1>
        
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-6">
            <h2 className="font-display text-2xl text-[#8B0000] font-bold mb-4">Store Information</h2>
            
            <div className="space-y-4 text-xs text-[#3A2D23]/70">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#B8860B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3A2D23] block">Main Boutique</strong>
                  <span>{BUSINESS.location.fullAddress}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-[#B8860B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3A2D23] block">Call Us</strong>
                  <a href={`tel:${BUSINESS.contact.phoneRaw}`} className="hover:text-[#8B0000] transition-colors">{BUSINESS.contact.phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-[#B8860B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3A2D23] block">Email support</strong>
                  <a href={`mailto:${BUSINESS.contact.email}`} className="hover:text-[#8B0000] transition-colors">{BUSINESS.contact.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-[#B8860B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3A2D23] block">Boutique Hours</strong>
                  <span>{BUSINESS.contact.hours} ({BUSINESS.contact.openDays})</span>
                </div>
              </div>
            </div>

            {/* Google Maps Link Card */}
            <a 
              href={BUSINESS.location.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="border border-[#B8860B]/20 rounded-3xl p-5 bg-[#F5E6C8]/25 flex items-center justify-between hover:bg-[#F5E6C8]/40 hover:border-[#B8860B]/40 transition-all duration-300 group block"
            >
              <div>
                <span className="text-[10px] tracking-widest text-[#B8860B] uppercase font-bold block mb-1">Locate Us On Map</span>
                <span className="text-xs text-[#8B0000] font-semibold">{BUSINESS.location.street}, {BUSINESS.location.city}</span>
              </div>
              <ExternalLink size={16} className="text-[#B8860B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          <div className="md:col-span-7 bg-white border border-[#B8860B]/15 rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="font-display text-2xl text-[#8B0000] font-bold mb-6">Send A Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Your name" className="input-field" />
                <input required type="email" placeholder="Your email" className="input-field" />
              </div>
              <input required placeholder="Subject" className="input-field" />
              <textarea required rows={5} placeholder="How can we assist you with corporate, festival, or wedding catering?" className="input-field" />
              <button type="submit" className="btn-primary w-full">Send Message</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
