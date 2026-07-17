import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { Bell, Sparkles } from 'lucide-react'

const NOTIFS = [
  { id: 1, title: 'Welcome Reward!', desc: 'You received 380 gold coins loyalty membership signup bonus. Spend them on checkout!', date: 'Just now' },
  { id: 2, title: 'Festive Combo Active', desc: 'Promo code RAKHI200 is now active. Flat ₹200 discount on boutique gift hampers.', date: '2 hours ago' }
]

export default function Notifications() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body flex flex-col justify-between">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24 w-full">
        <h1 className="font-display text-3xl md:text-5xl text-[#8B0000] font-bold mb-10 select-none">
          Notifications
        </h1>

        <div className="space-y-4">
          {NOTIFS.map((n) => (
            <div key={n.id} className="bg-white border border-[#B8860B]/10 rounded-2xl p-5 shadow-sm flex items-start gap-4">
              <div className="bg-[#8B0000]/10 p-2.5 rounded-xl text-[#8B0000] shrink-0 mt-0.5">
                <Bell size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-display font-bold text-sm text-[#8B0000]">{n.title}</h3>
                  <span className="text-[9px] text-[#3A2D23]/40 tracking-wider font-bold uppercase shrink-0 mt-0.5">{n.date}</span>
                </div>
                <p className="text-xs text-[#3A2D23]/60 leading-relaxed mt-1">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
