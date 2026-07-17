import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck, Ticket } from 'lucide-react'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { useCart } from '../../hooks/useCart'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function Cart() {
  const { items, updateQty, removeFromCart, subtotal } = useCart()
  const navigate = useNavigate()

  // Coupon states
  const [couponCode, setCouponCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState('')

  const deliveryFee = items.length > 0 ? (subtotal >= 999 ? 0 : 50) : 0
  const discount = discountAmount
  const total = Math.max(0, subtotal + deliveryFee - discount)

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    const code = couponCode.trim().toUpperCase()

    if (code === 'AZADI15') {
      const calculated = Math.round(subtotal * 0.15)
      setDiscountAmount(calculated)
      setAppliedCoupon('AZADI15 (15% OFF)')
      toast.success('Promo code AZADI15 applied successfully!')
    } else if (code === 'RAKHI200') {
      const calculated = Math.min(subtotal, 200)
      setDiscountAmount(calculated)
      setAppliedCoupon('RAKHI200 (₹200 OFF)')
      toast.success('Promo code RAKHI200 applied successfully!')
    } else if (code === 'DIWALI2025') {
      const calculated = Math.round(subtotal * 0.25)
      setDiscountAmount(calculated)
      setAppliedCoupon('DIWALI2025 (25% OFF)')
      toast.success('Promo code DIWALI2025 applied successfully!')
    } else {
      toast.error('Invalid coupon code. Try AZADI15 or RAKHI200.')
    }
    setCouponCode('')
  }

  const handleRemoveCoupon = () => {
    setDiscountAmount(0)
    setAppliedCoupon('')
    toast.success('Coupon removed')
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-12 pb-16">
        <h1 className="font-display text-3xl md:text-5xl text-[#8B0000] font-bold mb-10 select-none">
          Your Selection Box
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#B8860B]/20 rounded-3xl bg-white select-none shadow-sm">
            <p className="font-display text-lg italic text-[#8B0000] font-bold">Your selection box is empty.</p>
            <p className="text-xs text-[#3A2D23]/50 mt-2 mb-8">Time to fill it with traditional delicacies.</p>
            <Link to="/products" className="btn-primary">Browse Boutique</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Cart items list */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    key={item.id}
                    className="bg-white border border-[#B8860B]/10 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow relative"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-[#B8860B]/10 shrink-0"
                    />
                    
                    <div className="flex-1 text-center sm:text-left">
                      <span className="text-[9px] uppercase tracking-widest text-[#B8860B] font-bold">Heritage Sweet</span>
                      <h3 className="font-display text-base text-[#8B0000] font-bold mt-0.5">{item.name}</h3>
                      <p className="text-xs text-[#3A2D23]/40 mt-1">₹{item.price} / {item.unit}</p>
                    </div>

                    <div className="flex items-center border border-[#B8860B]/30 rounded-full bg-white select-none overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="p-2.5 hover:bg-[#F5E6C8]/40 text-[#3A2D23]/70 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3.5 font-display font-bold text-xs text-[#3A2D23]">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="p-2.5 hover:bg-[#F5E6C8]/40 text-[#3A2D23]/70 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="w-24 text-center sm:text-right font-display text-base font-bold text-[#8B0000]">
                      ₹{item.price * item.qty}
                    </div>

                    <button
                      onClick={() => {
                        removeFromCart(item.id)
                        toast.success(`${item.name} removed from box`)
                      }}
                      className="text-[#3A2D23]/30 hover:text-red-700 p-2 absolute top-2 right-2 sm:static transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right Column: Order summary & coupon */}
            <div className="lg:col-span-4 space-y-6 select-none">
              
              {/* Order checkout card */}
              <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <h2 className="font-display text-lg tracking-wider text-[#8B0000] font-bold uppercase pb-4 border-b border-[#B8860B]/10">
                  Receipt Summary
                </h2>

                <div className="space-y-3 text-xs text-[#3A2D23]/60">
                  <div className="flex justify-between">
                    <span>Selection Subtotal</span>
                    <span className="font-bold text-[#3A2D23]">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Packaging</span>
                    <span className="font-bold text-[#3A2D23]">
                      {deliveryFee === 0 ? <span className="text-green-700 font-bold">FREE</span> : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-700 font-bold">
                      <span>Promo Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="border-t border-[#B8860B]/10 pt-4 flex justify-between font-display text-base font-bold text-[#8B0000]">
                    <span>Total Bill</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={() => navigate('/checkout', { state: { discount } })}
                  className="btn-primary w-full text-center flex items-center justify-center gap-2 py-4"
                >
                  Proceed to Checkout <ArrowRight size={14} />
                </button>
              </div>

              {/* Coupon card */}
              <div className="bg-white border border-[#B8860B]/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 text-[#8B0000] font-bold mb-4">
                  <Ticket size={16} className="text-[#B8860B]" />
                  <span className="font-display text-sm tracking-wider uppercase">Promotional Code</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200/50 rounded-xl p-3 text-xs text-green-700">
                    <span>Applied: <strong>{appliedCoupon}</strong></span>
                    <button onClick={handleRemoveCoupon} className="text-red-700 underline font-bold text-[10px] uppercase">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER CODE (e.g. AZADI15)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="input-field !py-2.5 uppercase !rounded-xl !border-[#B8860B]/20"
                    />
                    <button type="submit" className="btn-outline !py-2.5 !px-4 hover:!bg-[#8B0000] hover:!text-white hover:!border-[#8B0000] text-xs">
                      Apply
                    </button>
                  </form>
                )}
                
                <p className="text-[10px] text-[#3A2D23]/40 mt-3 leading-relaxed">
                  Tip: Use coupon <strong className="text-[#B8860B]">AZADI15</strong> for 15% discount or <strong className="text-[#B8860B]">RAKHI200</strong> for ₹200 off!
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#3A2D23]/40 font-bold">
                <ShieldCheck size={14} className="text-[#B8860B]" /> Secure checkout with premium packaging
              </div>

            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
