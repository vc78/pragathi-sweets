import { Link } from 'react-router-dom'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body flex flex-col justify-between">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-50 text-red-700 border border-red-200/50 flex items-center justify-center mx-auto">
          <XCircle size={40} />
        </div>
        <h1 className="font-display text-3xl font-bold text-red-700">Payment Failed</h1>
        <p className="text-xs text-[#3A2D23]/60 leading-relaxed">
          The transaction could not be authorized by your issuing bank. Please retry using another card, UPI, or cash on delivery option.
        </p>

        <div className="pt-6 grid grid-cols-2 gap-4">
          <Link to="/checkout" className="btn-primary py-3 px-4 text-[10px] tracking-widest text-center flex items-center justify-center gap-1.5 font-bold">
            <RefreshCw size={14} /> Retry Payment
          </Link>
          <Link to="/cart" className="btn-outline py-3 px-4 text-[10px] tracking-widest text-center flex items-center justify-center gap-1.5 font-bold">
            <ArrowLeft size={14} /> View Box Cart
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
