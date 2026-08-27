import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  ShoppingBag,
  CheckCircle2,
  Truck,
  Box,
  RotateCcw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Ticket,
  User,
  MapPin,
  Clock
} from 'lucide-react'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { orderService } from '../../services/orderService'

const statusColor = {
  Delivered: 'bg-green-50 text-green-700 border-green-200/50',
  Shipped: 'bg-blue-50 text-blue-700 border-blue-200/50',
  Processing: 'bg-[#B8860B]/10 text-[#B8860B] border-[#B8860B]/20',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200/50',
  Cancelled: 'bg-red-50 text-red-700 border-red-100',
}

// Function to generate detailed items if order.items is a number
const getItemsList = (o) => {
  if (Array.isArray(o.items)) return o.items
  // Generate mock items for standard mock data
  const seed = parseInt(o.id.replace(/\D/g, '')) || 0
  const mockItems = [
    { name: 'Kaju Katli', price: 620, unit: 'kg', qty: 1, image: '/images/pexels-gaurav-kumar-1281378-18488298.jpg' },
    { name: 'Motichoor Ladoo', price: 380, unit: 'kg', qty: 1, image: '/images/pexels-divigraphy-14467844.jpg' },
    { name: 'Gulab Jamun', price: 320, unit: 'kg', qty: 1, image: '/images/pexels-kailashkumarphotography-11887844.jpg' },
    { name: 'Mysore Pak', price: 480, unit: 'kg', qty: 1, image: '/images/pexels-gaurav-kumar-1281378-18488310.jpg' },
  ]
  const count = o.items || 1
  const result = []
  for (let i = 0; i < count; i++) {
    const item = mockItems[(seed + i) % mockItems.length]
    result.push({ ...item, qty: i === 0 && count > 1 ? 2 : 1 })
  }
  return result
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()

  // Mock Loyalty Coins matching Profile.jsx
  const goldCoins = 380

  useEffect(() => {
    orderService.getMyOrders().then((data) => {
      // Sort orders by date descending
      const sorted = [...data].sort((a, b) => b.id.localeCompare(a.id))
      setOrders(sorted)

      // Auto expand newly placed order if redirecting from checkout
      if (location.state?.newOrderId) {
        setExpandedOrderId(location.state.newOrderId)
      }
    })
  }, [location])

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id)
  }

  // Get status steps for tracker timeline
  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 1
      case 'Processing': return 2
      case 'Shipped': return 3
      case 'Delivered': return 4
      case 'Cancelled': return 0
      default: return 1
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-12 pb-16">
        <h1 className="font-display text-3xl md:text-5xl text-[#8B0000] font-bold mb-10 select-none">
          Client Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Column: Loyalty Status / Coins Summary (Cohesive with Profile.jsx) */}
          <div className="lg:col-span-4 space-y-6 select-none">

            {/* Loyalty Card */}
            <div className="bg-gradient-to-br from-[#1F1F1F] via-[#2A201A] to-[#8B0000] text-[#FFFDF8] rounded-3xl p-6 border border-[#B8860B]/25 relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#B8860B]/10 rounded-full filter blur-xl pointer-events-none" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[8px] tracking-[0.25em] text-[#B8860B] font-bold uppercase block">PRAGATHI COINS</span>
                  <p className="font-display text-xs text-[#B8860B] mt-1">Royale Class Membership</p>
                </div>
                <Award size={20} className="text-[#B8860B] animate-pulse" />
              </div>

              <div className="py-6">
                <span className="text-[10px] text-white/50 tracking-wider block">GOLD COINS BALANCE</span>
                <span className="font-display text-4xl text-[#B8860B] font-bold flex items-center gap-1.5 mt-1.5">
                  <Sparkles size={24} className="text-[#B8860B]" /> {goldCoins}
                </span>
                <span className="text-[9px] text-white/40 mt-1 block">Value: ₹{goldCoins} (1 Coin = ₹1 Discount)</span>
              </div>

              <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[10px] text-white/60">
                <span>Next reward tier: 500 Coins</span>
                <span className="text-[#B8860B] underline font-bold cursor-pointer">Learn More</span>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-5 space-y-3 shadow-sm">
              <h3 className="font-display text-[10px] tracking-[0.2em] text-[#8B0000] font-bold uppercase pb-2 border-b border-[#B8860B]/5 flex items-center gap-1.5">
                Client Workspace
              </h3>
              <div className="space-y-1 text-xs">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 p-3 rounded-xl transition-colors hover:bg-[#F5E6C8]/30 text-[#3A2D23]/75"
                >
                  <User size={14} className="text-[#B8860B]" />
                  <span>Personal Settings</span>
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center gap-2.5 p-3 rounded-xl transition-colors bg-[#8B0000]/5 border border-[#B8860B]/10 text-[#8B0000] font-bold"
                >
                  <ShoppingBag size={14} className="text-[#8B0000]" />
                  <span>Order History</span>
                </Link>
              </div>
            </div>

            {/* Exclusive Coupons */}
            <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 space-y-4 shadow-sm hidden lg:block">
              <h3 className="font-display text-[10px] tracking-[0.2em] text-[#8B0000] font-bold uppercase pb-2 border-b border-[#B8860B]/5 flex items-center gap-1.5">
                <Ticket size={14} className="text-[#B8860B]" /> Available Perks
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#F5E6C8]/10 border border-[#B8860B]/10 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#8B0000] block">AZADI15</span>
                    <span className="text-[10px] text-[#3A2D23]/50">15% Off storewide confections</span>
                  </div>
                  <span className="text-[9px] bg-green-50 text-green-700 border border-green-200/50 px-2 py-0.5 rounded font-bold uppercase">Active</span>
                </div>
                <div className="p-3 bg-[#F5E6C8]/10 border border-[#B8860B]/10 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#8B0000] block">RAKHI200</span>
                    <span className="text-[10px] text-[#3A2D23]/50">₹200 discount on gift boxes</span>
                  </div>
                  <span className="text-[9px] bg-green-50 text-green-700 border border-green-200/50 px-2 py-0.5 rounded font-bold uppercase">Active</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-8 space-y-6">

            {location.state?.newOrderId && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200/50 rounded-2xl p-5 flex items-center gap-4 text-green-700 font-bold"
              >
                <div className="bg-green-100 p-2.5 rounded-full">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm">Order Placed Successfully!</h4>
                  <p className="text-xs text-[#3A2D23]/70 mt-0.5 font-normal">
                    Order <span className="font-bold text-green-800">{location.state.newOrderId}</span> has been scheduled for preparation.
                  </p>
                </div>
              </motion.div>
            )}

            <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#B8860B]/10">
                <h2 className="font-display text-xl text-[#8B0000] font-bold flex items-center gap-2 select-none">
                  <ShoppingBag size={18} className="text-[#B8860B]" /> Purchase History
                </h2>
                <span className="text-xs text-[#3A2D23]/40 select-none">
                  {orders.length} order{orders.length !== 1 && 's'} placed
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingBag size={40} className="text-[#B8860B]/30 mx-auto mb-4" />
                  <p className="font-display text-base italic text-[#8B0000] font-bold">No orders found.</p>
                  <p className="text-xs text-[#3A2D23]/50 mt-1 mb-6">You have not ordered any confections yet.</p>
                  <Link to="/products" className="btn-primary inline-block">Explore Boutique</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => {
                    const isExpanded = expandedOrderId === o.id
                    const itemsList = getItemsList(o)
                    const trackingStep = getStatusStep(o.status)
                    const isNewOrder = location.state?.newOrderId === o.id

                    return (
                      <motion.div
                        key={o.id}
                        layout
                        className={`border rounded-2xl transition-all duration-300 ${isExpanded
                          ? 'border-[#B8860B] shadow-sm bg-[#FFFDF8]'
                          : isNewOrder
                            ? 'border-[#B8860B]/60 bg-[#B8860B]/5 shadow-sm'
                            : 'border-[#B8860B]/15 hover:border-[#B8860B]/40 hover:bg-[#F5E6C8]/10'
                          }`}
                      >
                        {/* Order Header / Summary View */}
                        <div
                          onClick={() => toggleExpand(o.id)}
                          className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-[#F5E6C8]/40 rounded-xl p-3 text-[#8B0000]">
                              <ShoppingBag size={18} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-sm tracking-wide text-[#8B0000]">
                                  {o.id}
                                </span>
                                {isNewOrder && (
                                  <span className="text-[8px] bg-[#B8860B] text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                    New
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-[#3A2D23]/50 mt-0.5 font-normal">
                                <Calendar size={12} className="text-[#B8860B]/70" />
                                <span>{o.date}</span>
                                <span>·</span>
                                <span>{itemsList.length} item{itemsList.length !== 1 && 's'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <span className="text-[10px] text-[#3A2D23]/40 block">Grand Total</span>
                              <span className="font-display font-bold text-sm text-[#8B0000]">
                                ₹{o.total}
                              </span>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusColor[o.status] || 'bg-gray-100 text-gray-600'}`}>
                              {o.status}
                            </span>

                            <div className="text-[#B8860B] hover:text-[#8B0000] transition-colors">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>
                        </div>

                        {/* Order Expanded Details */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden border-t border-[#B8860B]/10"
                            >
                              <div className="p-5 space-y-6">

                                {/* Tracking Progress Bar */}
                                {o.status !== 'Cancelled' ? (
                                  <div className="bg-[#FFFDF8] border border-[#B8860B]/10 rounded-2xl p-5 space-y-4">
                                    <div className="flex justify-between items-center text-[10px] text-[#3A2D23]/40 uppercase tracking-wider font-bold">
                                      <span className="flex items-center gap-1">
                                        <Clock size={12} className="text-[#B8860B]" /> Estimated Delivery: Same Day
                                      </span>
                                      <span className="font-bold text-[#B8860B]">Status: {o.status}</span>
                                    </div>

                                    {/* Timeline visual */}
                                    <div className="relative pt-2 pb-6">
                                      {/* Background line */}
                                      <div className="absolute top-[21px] left-3 right-3 h-0.5 bg-[#B8860B]/20" />
                                      {/* Active line progress */}
                                      <div
                                        className="absolute top-[21px] left-3 h-0.5 bg-[#B8860B] transition-all duration-500"
                                        style={{ width: `${((trackingStep - 1) / 3) * 100}%` }}
                                      />

                                      {/* Points */}
                                      <div className="relative flex justify-between">
                                        {[
                                          { label: 'Placed', icon: CheckCircle2, step: 1 },
                                          { label: 'Prepared', icon: Clock, step: 2 },
                                          { label: 'In Transit', icon: Truck, step: 3 },
                                          { label: 'Delivered', icon: Box, step: 4 }
                                        ].map((stepObj) => {
                                          const IconComp = stepObj.icon
                                          const isActive = trackingStep >= stepObj.step
                                          const isCurrent = trackingStep === stepObj.step

                                          return (
                                            <div key={stepObj.label} className="flex flex-col items-center relative z-10">
                                              <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${isActive
                                                ? 'bg-[#B8860B] border-[#B8860B] text-white shadow'
                                                : 'bg-white border-[#B8860B]/30 text-[#3A2D23]/40'
                                                } ${isCurrent ? 'ring-4 ring-[#B8860B]/20 animate-pulse' : ''}`}>
                                                <IconComp size={12} />
                                              </div>
                                              <span className={`text-[9px] mt-2 tracking-wider uppercase font-bold ${isActive ? 'text-[#8B0000]' : 'text-[#3A2D23]/40'
                                                }`}>
                                                {stepObj.label}
                                              </span>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 text-center">
                                    <p className="text-xs text-red-800">
                                      This order has been cancelled and any payments made have been refunded.
                                    </p>
                                  </div>
                                )}

                                {/* Detailed Items */}
                                <div className="space-y-3">
                                  <h4 className="font-display font-bold text-xs text-[#8B0000] tracking-wider uppercase border-b border-[#B8860B]/5 pb-1">
                                    Selected Confections
                                  </h4>
                                  <div className="divide-y divide-[#B8860B]/5 space-y-3">
                                    {itemsList.map((item, idx) => (
                                      <div key={idx} className="flex justify-between items-center pt-3 first:pt-0">
                                        <div className="flex items-center gap-3">
                                          <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-lg border border-[#B8860B]/10 shadow-sm shrink-0"
                                          />
                                          <div>
                                            <p className="font-display text-sm font-bold text-[#8B0000]">{item.name}</p>
                                            <p className="text-[10px] text-[#3A2D23]/40">
                                              ₹{item.price} / {item.unit}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-xs text-[#3A2D23]/60 block">Qty: {item.qty}</span>
                                          <span className="font-display font-bold text-xs text-[#8B0000]">
                                            ₹{item.price * item.qty}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Delivery & Payment details summary */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#B8860B]/10 pt-4">
                                  <div>
                                    <h5 className="font-display font-bold text-xs text-[#8B0000] tracking-wider uppercase flex items-center gap-1.5 mb-2">
                                      <MapPin size={12} className="text-[#B8860B]" /> Shipping Address
                                    </h5>
                                    <div className="text-[11px] text-[#3A2D23]/70 space-y-0.5 pl-4 font-normal">
                                      <p className="font-bold text-[#3A2D23]">{o.customer || user?.name || 'Client'}</p>
                                      {o.address ? (
                                        <>
                                          <p>{o.address.line1}</p>
                                          <p>{o.address.city} - {o.address.pincode}</p>
                                          <p className="mt-1 font-bold text-[#B8860B]">Phone: {o.address.phone}</p>
                                        </>
                                      ) : (
                                        <>
                                          <p>12, Jubilee Hills, Road No. 36</p>
                                          <p>Hyderabad - 500033</p>
                                          <p className="mt-1 font-bold text-[#B8860B]">Phone: +91 98765 43210</p>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="font-display font-bold text-xs text-[#8B0000] tracking-wider uppercase flex items-center gap-1.5 mb-2">
                                      <Ticket size={12} className="text-[#B8860B]" /> Payment Summary
                                    </h5>
                                    <div className="text-[11px] text-[#3A2D23]/70 space-y-1.5 pl-4 bg-[#F5E6C8]/10 p-3 rounded-xl border border-[#B8860B]/5">
                                      <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>₹{o.total - (o.status !== 'Cancelled' ? 60 : 0)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Delivery Fee</span>
                                        <span>₹60</span>
                                      </div>
                                      <div className="border-t border-[#B8860B]/10 pt-1.5 flex justify-between font-bold text-[#8B0000]">
                                        <span>Grand Total</span>
                                        <span>₹{o.total}</span>
                                      </div>
                                      <div className="text-[9px] text-[#3A2D23]/40 pt-1 border-t border-[#B8860B]/5 flex justify-between">
                                        <span>Gateway Status:</span>
                                        <span className="font-bold text-green-700">SUCCESS</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Bottom actions */}
                                <div className="border-t border-[#B8860B]/10 pt-4 flex gap-3 justify-end">
                                  <button
                                    onClick={() => window.open('https://wa.me/919849012345', '_blank')}
                                    className="btn-outline !py-2 !px-4 text-[10px] flex items-center gap-1.5 font-bold"
                                  >
                                    <HelpCircle size={12} /> Support
                                  </button>
                                  <Link
                                    to="/products"
                                    className="btn-primary !py-2 !px-4 text-[10px] flex items-center gap-1.5 font-bold"
                                  >
                                    <RotateCcw size={12} /> Reorder Sweets
                                  </Link>
                                </div>

                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
