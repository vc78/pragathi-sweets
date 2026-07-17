import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { useCart } from '../../hooks/useCart'
import { orderService } from '../../services/orderService'
import { motion } from 'framer-motion'
import { ShieldCheck, Truck, CreditCard, ChevronRight } from 'lucide-react'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const locationState = useLocation().state || {}
  const discount = locationState.discount || 0

  const [address, setAddress] = useState({ name: user?.name || '', phone: '', line1: '', city: '', pincode: '' })
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [placing, setPlacing] = useState(false)
  const [activeStep, setActiveStep] = useState(1) // 1: Shipping, 2: Payment

  const deliveryFee = items.length > 0 ? (subtotal >= 999 ? 0 : 50) : 0
  const total = Math.max(0, subtotal + deliveryFee - discount)

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value })

  const placeOrder = async (paymentInfo = {}) => {
    setPlacing(true)
    try {
      const order = await orderService.createOrder({
        items,
        address,
        total,
        paymentMethod,
        ...paymentInfo,
      })
      clearCart()
      toast.success('Order placed successfully!', {
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
      navigate('/orders', { state: { newOrderId: order.id } })
    } catch (err) {
      toast.error('Could not place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!address.name || !address.phone || !address.line1 || !address.city || !address.pincode) {
      toast.error('Please fill in all delivery details.')
      return
    }

    if (activeStep === 1) {
      setActiveStep(2)
      return
    }

    if (paymentMethod === 'cod') {
      return placeOrder({ paymentStatus: 'Pending' })
    }

    // Razorpay flow
    setPlacing(true)
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      toast.error('Could not load payment gateway. Please try Cash on Delivery.')
      setPlacing(false)
      return
    }
    const rpOrder = await orderService.createRazorpayOrder(total * 100)
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      name: 'Pragathi Sweets',
      description: 'Sweet box order',
      order_id: rpOrder.id?.startsWith('order_mock') ? undefined : rpOrder.id,
      handler: async (response) => {
        await orderService.verifyPayment(response)
        placeOrder({ paymentStatus: 'Paid', razorpayPaymentId: response.razorpay_payment_id })
      },
      prefill: { name: address.name, contact: address.phone },
      theme: { color: '#8B0000' },
      modal: { ondismiss: () => setPlacing(false) },
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between font-body">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 select-none">
          <p className="font-display text-lg italic text-[#8B0000] font-bold">Your selection box is empty.</p>
          <p className="text-xs text-[#3A2D23]/50 mt-2 mb-6">Add some confections to proceed.</p>
          <Link to="/products" className="btn-primary">Explore Boutique</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-12 pb-16">
        <h1 className="font-display text-3xl md:text-5xl text-[#8B0000] font-bold mb-10 select-none">
          Secure Checkout
        </h1>

        {/* Multi-step indicator bar */}
        <div className="flex items-center gap-4 mb-12 select-none">
          <button
            onClick={() => setActiveStep(1)}
            className={`font-display text-xs tracking-widest uppercase font-bold transition-colors ${
              activeStep === 1 ? 'text-[#8B0000] border-b-2 border-[#8B0000] pb-1' : 'text-[#3A2D23]/40'
            }`}
          >
            1. Shipping Address
          </button>
          <ChevronRight size={14} className="text-[#3A2D23]/35" />
          <button
            disabled={!address.name || !address.phone || !address.line1 || !address.city || !address.pincode}
            onClick={() => setActiveStep(2)}
            className={`font-display text-xs tracking-widest uppercase font-bold transition-colors disabled:opacity-50 ${
              activeStep === 2 ? 'text-[#8B0000] border-b-2 border-[#8B0000] pb-1' : 'text-[#3A2D23]/40'
            }`}
          >
            2. Payment Method
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Flow panels */}
          <div className="lg:col-span-8 space-y-6">
            
            {activeStep === 1 ? (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
              >
                <h2 className="font-display text-xl text-[#8B0000] font-bold pb-4 border-b border-[#B8860B]/10 flex items-center gap-2">
                  <Truck size={18} className="text-[#B8860B]" /> Delivery Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-widest uppercase text-[#B8860B] font-bold block">Recipient Name</span>
                    <input name="name" value={address.name} onChange={handleChange} placeholder="Enter full name" required className="input-field" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-widest uppercase text-[#B8860B] font-bold block">Contact Phone</span>
                    <input name="phone" value={address.phone} onChange={handleChange} placeholder="Enter phone number" required className="input-field" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <span className="text-[9px] tracking-widest uppercase text-[#B8860B] font-bold block">Street Address</span>
                    <input name="line1" value={address.line1} onChange={handleChange} placeholder="Flat, house number, street name" required className="input-field" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-widest uppercase text-[#B8860B] font-bold block">City</span>
                    <input name="city" value={address.city} onChange={handleChange} placeholder="Hyderabad" required className="input-field" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-widest uppercase text-[#B8860B] font-bold block">Postal Code / Pincode</span>
                    <input name="pincode" value={address.pincode} onChange={handleChange} placeholder="500095" required className="input-field" />
                  </div>
                </div>

                <div className="pt-4 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      if (!address.name || !address.phone || !address.line1 || !address.city || !address.pincode) {
                        toast.error('Please fill in all shipping details first.')
                        return
                      }
                      setActiveStep(2)
                    }}
                    className="btn-primary"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 select-none"
              >
                <h2 className="font-display text-xl text-[#8B0000] font-bold pb-4 border-b border-[#B8860B]/10 flex items-center gap-2">
                  <CreditCard size={18} className="text-[#B8860B]" /> Payment Verification
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center gap-4 border border-[#B8860B]/20 hover:border-[#B8860B]/40 rounded-2xl p-5 cursor-pointer transition-all has-[input:checked]:border-[#8B0000] has-[input:checked]:bg-[#8B0000]/[0.02]">
                    <input
                      type="radio"
                      name="pm"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-[#8B0000] shrink-0"
                    />
                    <div className="flex-1">
                      <span className="font-display font-bold text-sm text-[#8B0000] block">Online Payment (Cards / UPI / Netbanking)</span>
                      <span className="text-[10px] text-[#3A2D23]/50 mt-1 block">Pay securely via Razorpay gateway. Same-day dispatch.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 border border-[#B8860B]/20 hover:border-[#B8860B]/40 rounded-2xl p-5 cursor-pointer transition-all has-[input:checked]:border-[#8B0000] has-[input:checked]:bg-[#8B0000]/[0.02]">
                    <input
                      type="radio"
                      name="pm"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#8B0000] shrink-0"
                    />
                    <div className="flex-1">
                      <span className="font-display font-bold text-sm text-[#8B0000] block">Cash on Delivery (COD)</span>
                      <span className="text-[10px] text-[#3A2D23]/50 mt-1 block">Pay in cash or digital scanning at your doorstep.</span>
                    </div>
                  </label>
                </div>

                <div className="flex justify-between pt-6 border-t border-[#B8860B]/10">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="btn-outline !py-3 !px-6 text-xs font-bold tracking-widest"
                  >
                    Back to Address
                  </button>
                  <button
                    type="submit"
                    disabled={placing}
                    className="btn-primary !py-3 !px-8 disabled:opacity-60 text-xs font-bold tracking-widest"
                  >
                    {placing ? 'Authorizing Payment...' : 'Authorize & Place Order'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Delivery Timeline info */}
            <div className="border border-[#B8860B]/15 rounded-2xl p-5 bg-white flex gap-4 select-none">
              <Truck size={20} className="text-[#B8860B] mt-0.5 shrink-0" />
              <div>
                <h4 className="font-display text-sm text-[#8B0000] font-bold">Estimated Delivery Schedule</h4>
                <p className="text-[10px] text-[#3A2D23]/50 leading-relaxed mt-1">
                  Orders placed before 2:00 PM are delivered between 4:00 PM - 8:00 PM today. Orders placed after 2:00 PM will arrive tomorrow morning.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order summary box */}
          <div className="lg:col-span-4 select-none">
            <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm space-y-6 sticky top-28">
              <h2 className="font-display text-lg tracking-wider text-[#8B0000] font-bold uppercase pb-4 border-b border-[#B8860B]/10">
                Summary Box
              </h2>

              <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 justify-between items-center text-xs text-[#3A2D23]/70">
                    <span className="font-bold truncate max-w-[150px]">{item.name} <strong className="text-[#B8860B] font-normal">× {item.qty}</strong></span>
                    <span className="font-display text-[#8B0000] font-bold">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#B8860B]/10 pt-4 space-y-3 text-xs text-[#3A2D23]/60">
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
                {discount > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>Applied Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-[#B8860B]/10 pt-4 flex justify-between font-display text-base font-bold text-[#8B0000]">
                  <span>Grand Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#3A2D23]/40 font-bold border-t border-[#B8860B]/5 pt-4">
                <ShieldCheck size={14} className="text-[#B8860B]" /> Zero-contact sanitized luxury delivery
              </div>
            </div>
          </div>

        </form>
      </div>

      <Footer />
    </div>
  )
}
