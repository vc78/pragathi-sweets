import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'

export default function PaymentSuccess() {
  const location = useLocation()
  const orderId = location.state?.orderId || "PS-MOCK-101"

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body flex flex-col justify-between">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-50 text-green-700 border border-green-200/50 flex items-center justify-center mx-auto animate-pulse">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="font-display text-3xl font-bold text-[#8B0000]">Payment Verified</h1>
        <p className="text-xs text-[#3A2D23]/60 leading-relaxed">
          Your transaction has been authorized successfully. Order <strong className="text-[#8B0000]">{orderId}</strong> is scheduled for instant preparation.
        </p>

        <div className="pt-6 grid grid-cols-2 gap-4">
          <Link to="/orders" className="btn-primary py-3 px-4 text-[10px] tracking-widest text-center flex items-center justify-center gap-1.5 font-bold">
            <ShoppingBag size={14} /> My Orders
          </Link>
          <Link to="/products" className="btn-outline py-3 px-4 text-[10px] tracking-widest text-center flex items-center justify-center gap-1.5 font-bold">
            Browse Boutique <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
