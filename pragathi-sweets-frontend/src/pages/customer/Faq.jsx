import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { HelpCircle } from 'lucide-react'

const FAQS = [
  {
    q: "Are your handloom sarees Silk Mark certified?",
    a: "Yes, 100% of our pure Kanjeevaram, Banarasi, and Chanderi sarees carry authentic Silk Mark certification, woven on traditional Indian pit looms with certified gold/silver electroplated zari."
  },
  {
    q: "Do you offer custom sizing and bespoke blouse tailoring?",
    a: "Absolutely. All lehengas and anarkalis are crafted with generous 3-4 inch internal margins for effortless tailoring. We also offer complimentary made-to-measure blouse and silhouette tailoring upon request."
  },
  {
    q: "What is your standard delivery timeline?",
    a: "Ready-to-wear silhouettes are dispatched within 24-48 hours via premium insured courier (2-4 business days delivery across India). Bespoke bridal orders take 10-14 days for hand-embroidery and precision fitting."
  },
  {
    q: "Can I schedule a private bridal styling consultation?",
    a: "Yes! You can visit our Jubilee Hills atelier salon in Hyderabad or book a virtual 1-on-1 video styling consultation with our senior couturiers via WhatsApp concierge."
  },
  {
    q: "How are the garments packaged for transit?",
    a: "Every AGVIA ensemble is wrapped in breathable archival muslin, protected inside an acid-free gold-embossed keepsake trunk, and shipped in weather-sealed tamper-evident outer packaging."
  }
]

export default function Faq() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211D1E] font-body selection:bg-[#C9A45C]/30">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#C9A45C] uppercase block text-center mb-3">✦ Atelier Assistance ✦</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[#5A1020] font-bold text-center mb-12">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white border border-[#C9A45C]/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-serif font-bold text-base text-[#5A1020] mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-[#C9A45C] shrink-0" /> {faq.q}
              </h3>
              <p className="text-xs text-[#211D1E]/70 leading-relaxed pl-6 font-body">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
