import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ReliableImage from '../../components/common/ReliableImage'

const CATS = [
  {
    name: 'Milk Sweets',
    image: '/images/pexels-divigraphy-8624624.jpg',
    desc: 'Indulgent classics prepared from pure condensed milk solids.',
    path: '/products?category=Milk+Sweets'
  },
  {
    name: 'Dry Fruit Sweets',
    image: '/images/pexels-gaurav-kumar-1281378-18488298.jpg',
    desc: 'Luxurious confections crafted from organic nuts and silver varq.',
    path: '/products?category=Dry+Fruit+Sweets'
  },
  {
    name: 'Bengali Sweets',
    image: '/images/pexels-gaurav-kumar-1281378-18488316.jpg',
    desc: 'Spongy chhena delicacies soaked in light cardamom syrup.',
    path: '/products?category=Bengali+Sweets'
  },
  {
    name: 'Savouries',
    image: '/images/pexels-kailashkumarphotography-11887844.jpg',
    desc: 'Crunchy, salted blends prepared in wood-pressed oils.',
    path: '/products?category=Savouries'
  },
  {
    name: 'Festival Hampers',
    image: '/images/pexels-jonathanborba-19863265.jpg',
    desc: 'Curated premium hampers for rakhi, diwali, and royal gifting.',
    path: '/products?category=Festival+Hampers'
  }
]

export default function Categories() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#B8860B] uppercase block text-center mb-3">✦ Crafted Collections ✦</span>
        <h1 className="font-display text-4xl md:text-5xl text-[#8B0000] font-bold text-center mb-12">Boutique Categories</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATS.map((cat, idx) => (
            <div key={idx} className="bg-white border border-[#B8860B]/10 hover:border-[#B8860B]/30 rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_16px_48px_rgba(184,134,11,0.08)] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="h-48 overflow-hidden bg-[#F5E6C8]/40 border-b border-[#B8860B]/5">
                  <ReliableImage
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-[#8B0000] font-bold mb-2">{cat.name}</h3>
                  <p className="text-xs text-[#3A2D23]/60 leading-relaxed">{cat.desc}</p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link to={cat.path} className="inline-flex items-center gap-2 text-xs font-bold text-[#B8860B] hover:text-[#8B0000] uppercase tracking-widest transition-colors">
                  Explore Collection <ArrowRight size={14} />
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
