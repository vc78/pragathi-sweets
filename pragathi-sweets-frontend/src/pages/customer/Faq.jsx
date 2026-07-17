import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { HelpCircle } from 'lucide-react'

const FAQS = [
  { q: "How long do the sweets stay fresh?", a: "Most of our milk sweets stay fresh for 3-5 days when refrigerated. Dry fruit sweets and savouries can be stored for up to 15-20 days in airtight containers." },
  { q: "Do you ship outside Hyderabad?", a: "Yes, we ship to major metros across India via express air shipping. Same-day delivery is currently restricted to Hyderabad." },
  { q: "Is the silver varq safe for consumption?", a: "Yes, we only use pure, premium food-grade vegetarian silver varq certified by safety standards." },
  { q: "Can I customize a gift hamper?", a: "Absolutely! You can choose individual sweets and custom boxes on our site or contact support for corporate volumes." }
]

export default function Faq() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#B8860B] uppercase block text-center mb-3">✦ Common Inquiries ✦</span>
        <h1 className="font-display text-4xl md:text-5xl text-[#8B0000] font-bold text-center mb-12">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white border border-[#B8860B]/10 rounded-2xl p-6 shadow-sm">
              <h3 className="font-display font-bold text-base text-[#8B0000] mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-[#B8860B]" /> {faq.q}
              </h3>
              <p className="text-xs text-[#3A2D23]/60 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
