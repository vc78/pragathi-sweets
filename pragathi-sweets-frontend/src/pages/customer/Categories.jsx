import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ReliableImage from '../../components/common/ReliableImage'

const CATS = [
  {
    name: 'Sarees',
    image: '/images/pexels-gaurav-kumar-1281378-18488298.jpg',
    desc: 'Heirloom Kanjeevaram, Banarasi, and tissue silks woven with certified gold zari.',
    path: '/products?category=Sarees'
  },
  {
    name: 'Lehengas',
    image: '/images/pexels-shanks-emperor-1524379304-28769884.jpg',
    desc: 'Regal bridal trousseau lehengas adorned with hand-stitched zardozi and gota patti.',
    path: '/products?category=Lehengas'
  },
  {
    name: 'Anarkalis & Kurtas',
    image: '/images/pexels-divigraphy-8624624.jpg',
    desc: 'Flowing multi-kalidar anarkalis, raw silk kurtas, and handcrafted organza dupattas.',
    path: '/products?category=Anarkalis+%26+Kurtas'
  },
  {
    name: 'Dresses & Gowns',
    image: '/images/pexels-divigraphy-14467844.jpg',
    desc: 'Sculpted cocktail gowns, corset drape dresses, and modern Indo-western silhouettes.',
    path: '/products?category=Dresses+%26+Gowns'
  },
  {
    name: 'Wedding & Festive Edit',
    image: '/images/pexels-jonathanborba-19863265.jpg',
    desc: 'Curated royal collections for Mehendi, Sangeet, Haldi, and grand reception galas.',
    path: '/products?category=Wedding+%26+Festive+Edit'
  }
]

export default function Categories() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211D1E] font-body selection:bg-[#C9A45C]/30">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#C9A45C] uppercase block text-center mb-3">✦ Atelier Collections ✦</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[#5A1020] font-bold text-center mb-12">Couture Categories</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATS.map((cat, idx) => (
            <div key={idx} className="bg-white border border-[#C9A45C]/20 hover:border-[#C9A45C]/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_16px_48px_rgba(201,164,92,0.12)] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="h-64 overflow-hidden bg-[#FAF7F2] border-b border-[#C9A45C]/15 relative">
                  <ReliableImage
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl text-[#5A1020] font-bold mb-2">{cat.name}</h3>
                  <p className="text-xs text-[#211D1E]/70 leading-relaxed font-body">{cat.desc}</p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link to={cat.path} className="inline-flex items-center gap-2 text-xs font-bold text-[#C9A45C] hover:text-[#5A1020] uppercase tracking-widest transition-colors font-sans">
                  Explore Silhouette <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
