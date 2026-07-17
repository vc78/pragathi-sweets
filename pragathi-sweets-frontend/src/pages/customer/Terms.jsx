import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <h1 className="font-display text-4xl text-[#8B0000] font-bold mb-8 text-center">Terms of Service</h1>
        <div className="prose prose-stone text-xs leading-relaxed text-[#3A2D23]/70 space-y-6">
          <p>
            By accessing or ordering from Pragathi Sweets, you agree to our terms. All prices listed are in Indian Rupees (INR) and are inclusive of standard local taxes unless specified.
          </p>
          <p>
            We prepare morning batches starting at 6 AM. We reserve the right to cancel orders or adjust items selection depending on ingredient stocks or dispatch constraints.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
