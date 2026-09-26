import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { Link } from 'react-router-dom'
import { Gift, ArrowRight } from 'lucide-react'

export default function GiftBoxes() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211D1E] font-body selection:bg-[#C9A45C]/30">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[#5A1020]/10 text-[#5A1020] flex items-center justify-center mx-auto mb-6">
          <Gift size={32} className="text-[#C9A45C]" />
        </div>
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#C9A45C] uppercase block mb-3">✦ Bespoke Keepsake Packaging ✦</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[#5A1020] font-bold mb-6">Heirloom Trousseau Boxes</h1>
        <p className="text-xs text-[#211D1E]/70 max-w-lg mx-auto leading-relaxed mb-8">
          Every AGVIA ensemble is encased in acid-free archival tissue, protected by a gold-embossed keepsake trunk, and delivered ready for royal celebration.
        </p>
        
        <div className="bg-white border border-[#C9A45C]/20 rounded-3xl p-8 max-w-xl mx-auto shadow-sm text-left space-y-4">
          <h3 className="font-serif text-xl text-[#5A1020] font-bold border-b border-[#C9A45C]/15 pb-3">Royal Atelier Keepsake Trunk</h3>
          <p className="text-xs text-[#211D1E]/70 leading-relaxed font-body">
            Crafted with champagne gold metallic foil, archival velvet ribbon, and personalized calligraphed gift cards for brides and celebratory gifting.
          </p>
          <div className="pt-4">
            <Link to="/products?category=Wedding+%26+Festive+Edit" className="btn-primary inline-flex">
              Explore Festive Edit <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
