import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <h1 className="font-display text-4xl text-[#8B0000] font-bold mb-8 text-center">Privacy Policy</h1>
        <div className="prose prose-stone text-xs leading-relaxed text-[#3A2D23]/70 space-y-6">
          <p>
            At Pragathi Sweets, protecting your personal details is our priority. We collect customer name, email address, contact numbers, and delivery details for the sole purpose of fulfillment, secure Razorpay verification, and loyalty ledger management.
          </p>
          <p>
            We do not sell, rent, or trade your information with external agencies. All user profiles and order histories are safely managed behind end-to-end encrypted databases compatible with JWT login schemas.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
