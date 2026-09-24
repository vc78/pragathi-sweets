import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { useCart } from '../../hooks/useCart'
import { orderService } from '../../services/orderService'
import { motion } from 'framer-motion'
import { ShieldCheck, Truck, CreditCard, ChevronRight, Ticket, Sparkles, MessageCircle } from 'lucide-react'
import api from '../../services/api'
import { sendOrderConfirmationEmails } from '../../services/emailJsService'
import { buildWhatsAppOrderMessage, openWhatsAppDirectly } from '../../utils/whatsappUtils'

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
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const locationState = useLocation().state || {}
  
  const [couponCode, setCouponCode] = useState(locationState.couponCode || '')
  const [discount, setDiscount] = useState(locationState.discount || 0)
  const [couponInput, setCouponInput] = useState('')
  const [validatingCoupon, setValidatingCoupon] = useState(false)

  const [address, setAddress] = useState({ name: user?.name || '', phone: '', line1: '', city: '', pincode: '' })
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [placing, setPlacing] = useState(false)
  const [activeStep, setActiveStep] = useState(1) // 1: Shipping, 2: Payment

  const deliveryFee = items.length > 0 ? (subtotal >= 999 ? 0 : 50) : 0
  const total = Math.max(0, subtotal + deliveryFee - discount)

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value })

  const handleApplyCoupon = async (e) => {
    if (e) e.preventDefault()
    const code = couponInput.trim().toUpperCase()
    if (!code) return

    setValidatingCoupon(true)
    try {
      const { data } = await api.get('/coupons/validate', {
        params: { code, orderAmount: subtotal }
      })
      const result = data?.data
      if (result?.valid) {
        setDiscount(Number(result.discountAmount || 0))
        setCouponCode(result.code)
        setCouponInput('')
        toast.success(result.message || `Coupon ${result.code} applied successfully!`, {
          style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
        })
      } else {
        toast.error(result?.message || 'Invalid or expired promo code.')
      }
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Could not validate coupon.')
    } finally {
      setValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setDiscount(0)
    setCouponCode('')
    toast.success('Coupon removed')
  }

  const placeOrder = async (paymentInfo = {}) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to confirm your order and track live dispatch.', {
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
      navigate('/login', { state: { from: '/checkout' } })
      return
    }

    setPlacing(true)
    try {
      const order = await orderService.createOrder({
        items,
        address,
        total,
        paymentMethod,
        couponCode: couponCode || null,
        ...paymentInfo,
      })
      clearCart()

      // Dispatch live confirmation emails via EmailJS (customer + store)
      sendOrderConfirmationEmails({
        order,
        customerEmail: user?.email || address.email,
        customerName: address.name || user?.name || user?.fullName,
        phone: address.phone || user?.phone,
        items,
        total,
        address
      }).catch(err => console.warn('EmailJS order dispatch notice:', err))

      // Directly dispatch WhatsApp receipt to customer's WhatsApp
      const targetPhone = address.phone || user?.phone
      const waReceipt = buildWhatsAppOrderMessage({
        order,
        customerName: address.name || user?.name || user?.fullName,
        phone: targetPhone,
        address,
        items,
        total
      })
      if (targetPhone) {
        openWhatsAppDirectly(targetPhone, waReceipt)
      }

      toast.success(
        () => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontWeight: 700 }}>🎉 Order Placed Successfully!</span>
            <span style={{ fontSize: '12px', opacity: 0.85 }}>
              📱 Confirmation receipt sent directly to your WhatsApp & email.
            </span>
          </div>
        ),
        { duration: 5000, style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' } }
      )
      navigate('/orders', {
        state: {
          newOrderId: order.id,
          orderDetails: order,
          customerPhone: address.phone || user?.phone,
        }
      })
    } catch (err) {
      console.error('Order creation failed:', err)
      const msg = err?.response?.data?.message || err?.message || 'Could not place order. Please try again.'
      toast.error(msg)
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

    if (!isAuthenticated) {
      toast.error('Please sign in to place your order and track delivery.', {
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
      navigate('/login', { state: { from: '/checkout' } })
      return
    }

    if (paymentMethod === 'cod') {
      return placeOrder({ paymentStatus: 'Pending' })
    }

    // Create the internal order first so the server can bind the gateway order
    // to its authoritative total and inventory reservation.
    setPlacing(true)
    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Could not load payment gateway. Please try Cash on Delivery.')
        setPlacing(false)
        return
      }

      const order = await orderService.createOrder({ 
        items, 
        address, 
        total, 
        paymentMethod,
        couponCode: couponCode || null
      })
      const orderRef = order.orderNumber || order.id
      const rpOrder = await orderService.createRazorpayOrder(orderRef)
      const options = {
        key: rpOrder.razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rpOrder.amountInPaise,
        currency: rpOrder.currency,
        name: "AGVIA Women's Wear Boutique",
        description: 'Bespoke Luxury Order',
        order_id: rpOrder.razorpayOrderId,
        handler: async (response) => {
          try {
            await orderService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              internalOrderNumber: orderRef,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              ...response,
            })
            clearCart()

            // Dispatch live confirmation emails via EmailJS (customer + store)
            sendOrderConfirmationEmails({
              order,
              customerEmail: user?.email || address.email,
              customerName: address.name || user?.name || user?.fullName,
              phone: address.phone || user?.phone,
              items,
              total,
              address
            }).catch(err => console.warn('EmailJS order dispatch notice:', err))

            // Directly dispatch WhatsApp receipt to customer's WhatsApp
            const targetPhone = address.phone || user?.phone
            const waReceipt = buildWhatsAppOrderMessage({
              order,
              customerName: address.name || user?.name || user?.fullName,
              phone: targetPhone,
              address,
              items,
              total
            })
            if (targetPhone) {
              openWhatsAppDirectly(targetPhone, waReceipt)
            }

            toast.success(
              () => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: 700 }}>🎉 Payment Successful! Order Confirmed.</span>
                  <span style={{ fontSize: '12px', opacity: 0.85 }}>
                    📱 Confirmation receipt sent directly to your WhatsApp & email.
                  </span>
                </div>
              ),
              { duration: 5000, style: { background: '#166534', color: '#FAF7F2', borderRadius: '12px' } }
            )
            navigate('/orders', {
              state: {
                newOrderId: order.id,
                orderDetails: order,
                customerPhone: address.phone || user?.phone,
              }
            })
          } catch (err) {
            console.error('Payment verification failed:', err)
            toast.error(err?.response?.data?.message || 'Payment verification failed. Please contact support.')
          } finally {
            setPlacing(false)
          }
        },
        prefill: { name: address.name, contact: address.phone },
        theme: { color: '#5A1020' },
        modal: { ondismiss: () => setPlacing(false) },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error('Payment initiation error:', err)
      const msg = err?.response?.data?.message || err?.message || 'Could not initiate payment. Please try Cash on Delivery.'
      toast.error(msg)
      setPlacing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 select-none">
          <p className="font-serif text-lg italic text-[#5A1020] font-bold">Your wardrobe bag is empty.</p>
          <p className="text-xs text-[#211D1E]/60 mt-2 mb-6 font-sans">Add your favorite silhouettes to proceed.</p>
          <Link to="/products" className="btn-primary">Explore Collections</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211D1E] font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-12 pb-16">
        <h1 className="font-serif text-3xl md:text-5xl text-[#5A1020] font-bold mb-6 select-none">
          Secure Checkout
        </h1>

        {!isAuthenticated && (
          <div className="bg-[#C9A45C]/10 border border-[#C9A45C]/25 rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-3 select-none">
            <div>
              <span className="font-bold text-xs text-[#5A1020] block">Sign in to complete your bespoke purchase</span>
              <span className="text-[11px] text-[#211D1E]/70 font-sans">Link this order to your account for live atelier tracking and concierge support.</span>
            </div>
            <Link
              to="/login"
              state={{ from: '/checkout' }}
              className="btn-primary !py-2 !px-5 text-[10px] tracking-wider uppercase font-bold"
            >
              Sign In Now
            </Link>
          </div>
        )}

        {/* Multi-step indicator bar */}
        <div className="flex items-center gap-4 mb-12 select-none">
          <button
            onClick={() => setActiveStep(1)}
            className={`font-serif text-xs tracking-widest uppercase font-bold transition-colors ${activeStep === 1 ? 'text-[#5A1020] border-b-2 border-[#5A1020] pb-1' : 'text-[#211D1E]/40'
              }`}
          >
            1. Delivery Address
          </button>
          <ChevronRight size={14} className="text-[#211D1E]/30" />
          <button
            disabled={!address.name || !address.phone || !address.line1 || !address.city || !address.pincode}
            onClick={() => setActiveStep(2)}
            className={`font-serif text-xs tracking-widest uppercase font-bold transition-colors disabled:opacity-50 ${activeStep === 2 ? 'text-[#5A1020] border-b-2 border-[#5A1020] pb-1' : 'text-[#211D1E]/40'
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
                className="bg-white border border-[#C9A45C]/20 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
              >
                <h2 className="font-serif text-xl text-[#5A1020] font-bold pb-4 border-b border-[#C9A45C]/15 flex items-center gap-2">
                  <Truck size={18} className="text-[#C9A45C]" /> Atelier Delivery Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-widest uppercase text-[#C9A45C] font-bold block">Recipient Full Name</span>
                    <input name="name" value={address.name} onChange={handleChange} placeholder="Enter full name" required className="input-field" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-widest uppercase text-[#C9A45C] font-bold block">Contact Phone</span>
                    <input name="phone" value={address.phone} onChange={handleChange} placeholder="Enter mobile number" required className="input-field" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <span className="text-[9px] tracking-widest uppercase text-[#C9A45C] font-bold block">Street Address</span>
                    <input name="line1" value={address.line1} onChange={handleChange} placeholder="Flat, villa or apartment, street name" required className="input-field" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-widest uppercase text-[#C9A45C] font-bold block">City</span>
                    <input name="city" value={address.city} onChange={handleChange} placeholder="Hyderabad" required className="input-field" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-widest uppercase text-[#C9A45C] font-bold block">Postal Code / Pincode</span>
                    <input name="pincode" value={address.pincode} onChange={handleChange} placeholder="500033" required className="input-field" />
                  </div>
                </div>

                {/* WhatsApp Notification Callout */}
                <div className="flex items-start gap-3 bg-[#25D366]/8 border border-[#25D366]/25 rounded-2xl p-4">
                  <MessageCircle size={20} className="text-[#25D366] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#1a7a43]">📱 WhatsApp Dispatch Updates</p>
                    <p className="text-[11px] text-[#211D1E]/70 mt-0.5 leading-relaxed font-sans">
                      A bespoke digital order receipt and tracking updates will be dispatched to your WhatsApp number.
                    </p>
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
                className="bg-white border border-[#C9A45C]/20 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 select-none"
              >
                <h2 className="font-serif text-xl text-[#5A1020] font-bold pb-4 border-b border-[#C9A45C]/15 flex items-center gap-2">
                  <CreditCard size={18} className="text-[#C9A45C]" /> Payment Method
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center gap-4 border border-[#C9A45C]/20 hover:border-[#C9A45C]/50 rounded-2xl p-5 cursor-pointer transition-all has-[input:checked]:border-[#5A1020] has-[input:checked]:bg-[#5A1020]/[0.02]">
                    <input
                      type="radio"
                      name="pm"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-[#5A1020] shrink-0"
                    />
                    <div className="flex-1">
                      <span className="font-serif font-bold text-sm text-[#5A1020] block">Online Payment (Cards / UPI / Netbanking)</span>
                      <span className="text-[10px] text-[#211D1E]/60 mt-1 block font-sans">Pay securely via Razorpay gateway with instant dispatch.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 border border-[#C9A45C]/20 hover:border-[#C9A45C]/50 rounded-2xl p-5 cursor-pointer transition-all has-[input:checked]:border-[#5A1020] has-[input:checked]:bg-[#5A1020]/[0.02]">
                    <input
                      type="radio"
                      name="pm"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#5A1020] shrink-0"
                    />
                    <div className="flex-1">
                      <span className="font-serif font-bold text-sm text-[#5A1020] block">Cash on Delivery (COD)</span>
                      <span className="text-[10px] text-[#211D1E]/60 mt-1 block font-sans">Pay upon arrival of your atelier garment parcel.</span>
                    </div>
                  </label>
                </div>

                <div className="flex justify-between pt-6 border-t border-[#C9A45C]/15">
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
                    {placing ? 'Authorizing...' : 'Authorize & Place Order'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Delivery Timeline info */}
            <div className="border border-[#C9A45C]/20 rounded-2xl p-5 bg-white flex gap-4 select-none">
              <Truck size={20} className="text-[#C9A45C] mt-0.5 shrink-0" />
              <div>
                <h4 className="font-serif text-sm text-[#5A1020] font-bold">Atelier White-Glove Dispatch</h4>
                <p className="text-[10px] text-[#211D1E]/60 leading-relaxed mt-1 font-sans">
                  All bespoke garments are pressed, wrapped in muslin bags, and securely packaged in our signature keepsake boxes for express delivery in 3-5 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order summary box */}
          <div className="lg:col-span-4 select-none">
            <div className="bg-white border border-[#C9A45C]/20 rounded-3xl p-6 shadow-sm space-y-6 sticky top-28">
              <h2 className="font-serif text-lg tracking-wider text-[#5A1020] font-bold uppercase pb-4 border-b border-[#C9A45C]/15">
                Wardrobe Summary
              </h2>

              <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 justify-between items-center text-xs text-[#211D1E]/70 font-sans">
                    <span className="font-bold truncate max-w-[150px]">{item.name} <strong className="text-[#C9A45C] font-normal">× {item.qty}</strong></span>
                    <span className="font-serif text-[#5A1020] font-bold">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#C9A45C]/15 pt-4 space-y-3 text-xs text-[#211D1E]/70 font-sans">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#211D1E]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Atelier Delivery</span>
                  <span className="font-bold text-[#211D1E]">
                    {deliveryFee === 0 ? <span className="text-green-800 font-bold">COMPLIMENTARY</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-800 font-bold">
                    <span>Privilege Code {couponCode ? `(${couponCode})` : ''}</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-[#C9A45C]/15 pt-4 flex justify-between font-serif text-base font-bold text-[#5A1020]">
                  <span>Total Amount</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* In-Checkout Coupon Code Section */}
              <div className="border-t border-[#C9A45C]/15 pt-4">
                {couponCode ? (
                  <div className="bg-green-50 border border-green-200/70 rounded-xl p-3 flex items-center justify-between text-xs text-green-800">
                    <span className="flex items-center gap-1.5 font-bold font-sans">
                      <Ticket size={14} className="text-green-700" />
                      {couponCode} (-₹{discount})
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[10px] text-red-700 font-bold uppercase underline hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[#211D1E]/60 uppercase tracking-wider font-bold block font-sans">Have a privilege code?</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="ENTER CODE"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="input-field !py-2 !text-xs uppercase !rounded-xl !border-[#C9A45C]/30 bg-[#FAF7F2]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon}
                        className="btn-outline !py-2 !px-4 text-xs font-bold shrink-0"
                      >
                        {validatingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#211D1E]/50 font-semibold border-t border-[#C9A45C]/10 pt-4 font-sans">
                <ShieldCheck size={14} className="text-[#C9A45C]" /> Insured express courier with tamper-proof seal
              </div>
            </div>
          </div>

        </form>
      </div>

      <Footer />
    </div>
  )
}
