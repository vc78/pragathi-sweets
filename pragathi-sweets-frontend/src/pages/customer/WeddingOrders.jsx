import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { Sparkles, Crown } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WeddingOrders() {
  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success("Thank you for your bridal inquiry! Our senior atelier couturier will connect with you within 24 hours.", {
      style: { background: '#5A1020', color: '#FAF7F2', borderRadius: '12px' }
    })
    e.target.reset()
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211D1E] font-body selection:bg-[#C9A45C]/30">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[#5A1020]/10 text-[#5A1020] flex items-center justify-center mx-auto mb-6">
          <Crown size={32} className="text-[#C9A45C]" />
        </div>
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#C9A45C] uppercase block mb-3">✦ Royal Trousseau Curation ✦</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[#5A1020] font-bold mb-6">Bridal & Wedding Trousseaus</h1>
        <p className="text-xs text-[#211D1E]/70 max-w-lg mx-auto leading-relaxed mb-12">
          Curate an unforgettable bridal wardrobe with bespoke handloom Kanjeevarams, custom-embroidered zardozi lehengas, coordinated bridal party ensembles, and personalized styling consultations at our Jubilee Hills atelier.
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-[#C9A45C]/20 rounded-3xl p-6 md:p-8 max-w-lg mx-auto shadow-sm text-left space-y-4">
          <h3 className="font-serif text-lg text-[#5A1020] font-bold border-b border-[#C9A45C]/15 pb-3">Bridal Consultation Request</h3>
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Bride / Patron Name" className="input-field" />
            <input required type="email" placeholder="Email Address" className="input-field" />
          </div>
          <input required placeholder="Phone Number / WhatsApp" className="input-field" />
          <div>
            <label className="text-[9px] uppercase tracking-wider text-[#C9A45C] font-bold block mb-1">Estimated Wedding Date</label>
            <input required type="date" className="input-field text-gray-600" />
          </div>
          <textarea
            required
            rows={4}
            placeholder="Specify silhouettes required (Bridal Lehenga, Reception Gown, Muhurtham Sarees, Bridesmaids Edits), preferred colors, and custom sizing notes..."
            className="input-field"
          />
          <button type="submit" className="btn-primary w-full text-xs font-bold tracking-widest uppercase py-3.5">
            Request Atelier Consultation
          </button>
        </form>
      </div>
      <Footer />
    </div>
  )
}
