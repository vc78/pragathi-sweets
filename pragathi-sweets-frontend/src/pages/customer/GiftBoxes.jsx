import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { Link } from 'react-router-dom'
import { Gift, ArrowRight } from 'lucide-react'

export default function GiftBoxes() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[#8B0000]/10 text-[#8B0000] flex items-center justify-center mx-auto mb-6">
          <Gift size={32} />
        </div>
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#B8860B] uppercase block mb-3">✦ Bespoke Packaging ✦</span>
        <h1 className="font-display text-4xl md:text-5xl text-[#8B0000] font-bold mb-6">Festival Gift Boxes</h1>
        <p className="text-xs text-[#3A2D23]/60 max-w-lg mx-auto leading-relaxed mb-8">
          Express your gratitude and love with our artisanal keepsakes, loaded with pure ghee confections and premium dry fruits.
        </p>
        
        <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-8 max-w-xl mx-auto shadow-sm text-left space-y-4">
          <h3 className="font-display text-lg text-[#8B0000] font-bold border-b border-[#B8860B]/10 pb-3">Royal Gold Selection Box</h3>
          <p className="text-xs text-[#3A2D23]/70 leading-relaxed">
            Includes custom choice of 1kg premium dry fruit assortment, customizable greeting card, and velvet box cover.
          </p>
          <div className="pt-4">
            <Link to="/products?category=Festival+Hampers" className="btn-primary inline-flex">
              Explore Hampers <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
