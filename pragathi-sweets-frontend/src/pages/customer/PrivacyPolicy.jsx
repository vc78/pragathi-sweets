import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211D1E] font-body selection:bg-[#C9A45C]/30">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#C9A45C] uppercase block text-center mb-3">✦ Confidentiality ✦</span>
        <h1 className="font-serif text-4xl text-[#5A1020] font-bold mb-8 text-center">Privacy Policy</h1>
        <div className="prose prose-stone text-xs leading-relaxed text-[#211D1E]/70 space-y-6">
          <p>
            At AGVIA Women's Wear Boutique, protecting your personal details is our highest commitment. We collect patron name, email address, contact numbers, and delivery details for the sole purpose of bespoke order fulfillment, secure Razorpay verification, and Atelier Circle membership management.
          </p>
          <p>
            We do not sell, rent, or trade your personal information. All patron profiles, measurement notes, and order histories are safely stored behind end-to-end encrypted databases compatible with JWT authentication protocols.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
