import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211D1E] font-body selection:bg-[#C9A45C]/30">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <span className="text-[9px] tracking-[0.3em] font-bold text-[#C9A45C] uppercase block text-center mb-3">✦ Legal & Policies ✦</span>
        <h1 className="font-serif text-4xl text-[#5A1020] font-bold mb-8 text-center">Terms of Service</h1>
        <div className="prose prose-stone text-xs leading-relaxed text-[#211D1E]/70 space-y-6">
          <p>
            By accessing or ordering from AGVIA Women's Wear Boutique, you agree to our terms. All prices listed are in Indian Rupees (INR) and are inclusive of standard applicable GST and luxury handloom cess unless specified.
          </p>
          <p>
            Each handcrafted garment and handloom weave is subject to subtle variations in zari sheen and embroidery texture, which testify to authentic artisanal craftsmanship. We reserve the right to modify availability and delivery timelines for custom made-to-measure orders.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
