import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { Award } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CorporateOrders() {
  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success("Thank you for your request! We will share our catalog and price sheet with you.", {
      style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
    })
    e.target.reset()
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[#8B0000]/10 text-[#8B0000] flex items-center justify-center mx-auto mb-6">
          <Award size={32} />
        </div>
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#B8860B] uppercase block mb-3">✦ Corporate Gifting ✦</span>
        <h1 className="font-display text-4xl md:text-5xl text-[#8B0000] font-bold mb-6">Corporate Gifting</h1>
        <p className="text-xs text-[#3A2D23]/60 max-w-lg mx-auto leading-relaxed mb-12">
          Deliver joy to your partners, clients, and employees with premium branded gift sets for diwali, holidays, and milestones.
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 md:p-8 max-w-lg mx-auto shadow-sm text-left space-y-4">
          <h3 className="font-display text-lg text-[#8B0000] font-bold border-b border-[#B8860B]/10 pb-3">Corporate Gifting Request</h3>
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Contact name" className="input-field" />
            <input required type="email" placeholder="Work email" className="input-field" />
          </div>
          <input required placeholder="Company name" className="input-field" />
          <input required placeholder="Estimated quantity (minimum 25 boxes)" className="input-field" />
          <textarea required rows={4} placeholder="Mention special branding, custom tags, or delivery schedule preferences..." className="input-field" />
          <button type="submit" className="btn-primary w-full">Submit Inquiry</button>
        </form>
      </div>
      <Footer />
    </div>
  )
}
