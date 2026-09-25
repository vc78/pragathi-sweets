import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { Crown, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WeddingOrders() {
  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success(
      'Thank you for your bridal inquiry! Our senior atelier couturier will connect with you within 24 hours.',
      { style: { background: '#5A1020', color: '#FAF7F2', borderRadius: '12px' } }
    )
    e.target.reset()
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211D1E]">
      <Navbar />

      {/* Page body — pt accounts for fixed Navbar */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">

        {/* ── Page Header ── */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-[#5A1020]/08 flex items-center justify-center mx-auto mb-5 border border-[#C9A45C]/25">
            <Crown size={26} className="text-[#C9A45C]" />
          </div>
          <span
            style={{ fontFamily: "'Lato', 'Inter', sans-serif", letterSpacing: '0.3em' }}
            className="text-[9px] font-bold uppercase text-[#C9A45C] block mb-3"
          >
            ✦ Royal Trousseau Curation ✦
          </span>
          <h1
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
            className="text-3xl sm:text-4xl md:text-5xl text-[#5A1020] font-bold mb-4 leading-tight"
          >
            Bridal &amp; Wedding Trousseaus
          </h1>
          <p
            style={{ fontFamily: "'Lato', 'Inter', sans-serif" }}
            className="text-xs sm:text-sm text-[#211D1E]/60 max-w-xl mx-auto leading-relaxed"
          >
            Curate an unforgettable bridal wardrobe — bespoke Kanjeevarams, custom-embroidered
            zardozi lehengas, coordinated bridal party ensembles, and personal styling at our
            Jubilee Hills atelier.
          </p>
        </div>

        {/* ── Consultation Form ── */}
        <div className="bg-white border border-[#C9A45C]/20 rounded-3xl shadow-sm overflow-hidden">
          {/* Form header bar */}
          <div className="bg-gradient-to-r from-[#5A1020] to-[#7A1F32] px-6 py-4 flex items-center gap-3">
            <Sparkles size={16} className="text-[#E6C687]" />
            <h3
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-white font-bold text-base sm:text-lg tracking-wide"
            >
              Bridal Consultation Request
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-7 md:p-8 space-y-5">

            {/* Row 1: Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  style={{ fontFamily: "'Lato', sans-serif", letterSpacing: '0.1em' }}
                  className="text-[10px] uppercase font-bold text-[#C9A45C]"
                >
                  Bride / Patron Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-[#FAF7F2] border border-[#C9A45C]/25 rounded-xl px-4 py-3 text-sm text-[#211D1E] placeholder:text-[#211D1E]/35 focus:outline-none focus:ring-2 focus:ring-[#C9A45C]/40 focus:border-[#C9A45C] transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  style={{ fontFamily: "'Lato', sans-serif", letterSpacing: '0.1em' }}
                  className="text-[10px] uppercase font-bold text-[#C9A45C]"
                >
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-[#FAF7F2] border border-[#C9A45C]/25 rounded-xl px-4 py-3 text-sm text-[#211D1E] placeholder:text-[#211D1E]/35 focus:outline-none focus:ring-2 focus:ring-[#C9A45C]/40 focus:border-[#C9A45C] transition-all duration-200"
                />
              </div>
            </div>

            {/* Row 2: Phone */}
            <div className="flex flex-col gap-1.5">
              <label
                style={{ fontFamily: "'Lato', sans-serif", letterSpacing: '0.1em' }}
                className="text-[10px] uppercase font-bold text-[#C9A45C]"
              >
                Phone / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="tel"
                placeholder="+91 98765 43210"
                className="w-full bg-[#FAF7F2] border border-[#C9A45C]/25 rounded-xl px-4 py-3 text-sm text-[#211D1E] placeholder:text-[#211D1E]/35 focus:outline-none focus:ring-2 focus:ring-[#C9A45C]/40 focus:border-[#C9A45C] transition-all duration-200"
              />
            </div>

            {/* Row 3: Wedding Date */}
            <div className="flex flex-col gap-1.5">
              <label
                style={{ fontFamily: "'Lato', sans-serif", letterSpacing: '0.1em' }}
                className="text-[10px] uppercase font-bold text-[#C9A45C]"
              >
                Estimated Wedding Date <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="date"
                className="w-full bg-[#FAF7F2] border border-[#C9A45C]/25 rounded-xl px-4 py-3 text-sm text-[#211D1E] focus:outline-none focus:ring-2 focus:ring-[#C9A45C]/40 focus:border-[#C9A45C] transition-all duration-200"
              />
            </div>

            {/* Row 4: Requirements */}
            <div className="flex flex-col gap-1.5">
              <label
                style={{ fontFamily: "'Lato', sans-serif", letterSpacing: '0.1em' }}
                className="text-[10px] uppercase font-bold text-[#C9A45C]"
              >
                Silhouettes &amp; Requirements <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Specify silhouettes required (Bridal Lehenga, Reception Gown, Muhurtham Sarees, Bridesmaids Edits), preferred colors, and custom sizing notes..."
                className="w-full bg-[#FAF7F2] border border-[#C9A45C]/25 rounded-xl px-4 py-3 text-sm text-[#211D1E] placeholder:text-[#211D1E]/35 focus:outline-none focus:ring-2 focus:ring-[#C9A45C]/40 focus:border-[#C9A45C] transition-all duration-200 resize-none leading-relaxed"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{ fontFamily: "'Lato', sans-serif", letterSpacing: '0.15em' }}
              className="w-full bg-[#5A1020] hover:bg-[#7A1F32] text-white font-bold text-xs uppercase py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              <Crown size={14} className="text-[#E6C687]" />
              Request Atelier Consultation
            </button>

            <p
              style={{ fontFamily: "'Lato', sans-serif" }}
              className="text-center text-[10px] text-[#211D1E]/40 tracking-wide"
            >
              Our bridal stylists will reach out within 24 hours.
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
