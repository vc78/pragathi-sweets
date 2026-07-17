import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <h1 className="font-display text-4xl text-[#8B0000] font-bold mb-8 text-center">Refund Policy</h1>
        <div className="prose prose-stone text-xs leading-relaxed text-[#3A2D23]/70 space-y-6">
          <p>
            Due to the perishable nature of fresh food items, confections, and sweets prepared daily, Pragathi Sweets does not accept returns or offer refunds after shipping dispatch has commenced.
          </p>
          <p>
            In the rare event that your order box is delivered damaged, please contact our Support team within 2 hours of delivery with photographic evidence, and we will initiate a priority redelivery or a refund to your original payment gateway account.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
