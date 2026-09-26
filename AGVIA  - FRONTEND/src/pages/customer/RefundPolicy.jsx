import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211D1E] font-body selection:bg-[#C9A45C]/30">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#C9A45C] uppercase block text-center mb-3">✦ Atelier Guarantee ✦</span>
        <h1 className="font-serif text-4xl text-[#5A1020] font-bold mb-8 text-center">Exchange & Alteration Policy</h1>
        <div className="prose prose-stone text-xs leading-relaxed text-[#211D1E]/70 space-y-6">
          <p>
            At AGVIA, we take immense pride in the craftsmanship of our bridal lehengas, handloom sarees, and couture garments. We offer complimentary size alterations or exchanges for ready-to-wear silhouettes within 7 days of delivery.
          </p>
          <p>
            Bespoke, custom made-to-measure bridal trousseaus are meticulously crafted to your personal measurements with 3-4 inch internal seam allowances. In the rare event of transit damage, notify our concierge within 48 hours for immediate priority resolution or replacement.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
