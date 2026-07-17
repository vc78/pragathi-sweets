import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { Award, Compass, Heart, ShieldCheck } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#B8860B] uppercase block text-center mb-3">✦ Our Heritage ✦</span>
        <h1 className="font-display text-4xl md:text-6xl text-[#8B0000] font-bold text-center mb-8">About Pragathi Sweets</h1>
        
        <div className="prose prose-stone mx-auto text-sm leading-relaxed text-[#3A2D23]/80 space-y-6">
          <p>
            Established in 1994, Pragathi Sweets began as a small family boutique in Hyderabad, built on the simple promise of delivering purity, quality, and the authentic taste of Indian heritage. Today, three decades later, our culinary artisans continue to prepare confections fresh every morning using generation-old secrets.
          </p>
          <p>
            We believe that a sweet is not just food—it is a celebration, a memory, and a token of love. That is why we refuse to use artificial preservatives, additives, or compromises. Only organic cashews, milk solids, and pure cow ghee make it to our copper kadhais.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: Award, title: "30 Years", desc: "Crafting traditions since 1994 with family heritage." },
            { icon: ShieldCheck, title: "Purity First", desc: "No artificial preservatives or additives." },
            { icon: Compass, title: "Hyderabad Soul", desc: "Prepared and delivered fresh across Telangana." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-[#B8860B]/10 rounded-2xl p-6 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#8B0000]/10 text-[#8B0000] flex items-center justify-center mx-auto mb-4">
                <item.icon size={18} />
              </div>
              <h3 className="font-display font-bold text-base text-[#8B0000] mb-2">{item.title}</h3>
              <p className="text-xs text-[#3A2D23]/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
