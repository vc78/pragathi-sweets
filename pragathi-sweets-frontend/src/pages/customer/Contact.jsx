import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

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
                  <span>Koti, Hyderabad, Telangana, 500095</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-[#B8860B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3A2D23] block">Call Us</strong>
                  <span>+91 98490 12345</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-[#B8860B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3A2D23] block">Email support</strong>
                  <span>info@pragathisweets.com</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-[#B8860B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3A2D23] block">Boutique Hours</strong>
                  <span>9:00 AM - 9:00 PM Daily</span>
                </div>
              </div>
            </div>

            {/* Google Map Placeholder */}
            <div className="border border-[#B8860B]/15 rounded-3xl overflow-hidden h-48 relative bg-[#F5E6C8]/25 flex items-center justify-center">
              <span className="text-[10px] tracking-widest text-[#B8860B] uppercase font-bold">Interactive Map</span>
            </div>
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
