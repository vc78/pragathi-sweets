import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WeddingOrders() {
  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success("Thank you for your wedding request! Our catering architect will get in touch with you.", {
      style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
    })
    e.target.reset()
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[#8B0000]/10 text-[#8B0000] flex items-center justify-center mx-auto mb-6">
          <Sparkles size={32} />
        </div>
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#B8860B] uppercase block mb-3">✦ Shadi Collections ✦</span>
        <h1 className="font-display text-4xl md:text-5xl text-[#8B0000] font-bold mb-6">Wedding Celebrations</h1>
        <p className="text-xs text-[#3A2D23]/60 max-w-lg mx-auto leading-relaxed mb-12">
          Make your special day unforgettable with customized sweet boxes, decorative platters, and authentic Indian wedding confections.
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 md:p-8 max-w-lg mx-auto shadow-sm text-left space-y-4">
          <h3 className="font-display text-lg text-[#8B0000] font-bold border-b border-[#B8860B]/10 pb-3">Wedding Catering Request</h3>
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Your name" className="input-field" />
            <input required type="email" placeholder="Email" className="input-field" />
          </div>
          <input required placeholder="Phone number" className="input-field" />
          <input required type="date" className="input-field text-gray-500" />
          <textarea required rows={4} placeholder="Specify estimated guest count and preferred sweet menu assortment..." className="input-field" />
          <button type="submit" className="btn-primary w-full">Submit Request</button>
        </form>
      </div>
      <Footer />
    </div>
  )
}
