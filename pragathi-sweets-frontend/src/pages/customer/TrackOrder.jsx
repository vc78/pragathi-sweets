import { useState } from 'react'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { Search, Compass, ShieldCheck, Clock, MapPin } from 'lucide-react'

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [tracking, setTracking] = useState(null)

  const handleTrack = (e) => {
    e.preventDefault()
    if (!orderId.trim()) return
    setTracking({
      id: orderId.toUpperCase(),
      status: 'In Transit',
      estimate: 'Today, before 6:00 PM',
      deliveryPartner: 'Pragathi Delivery Agent'
    })
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body flex flex-col justify-between">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-8 flex-1 w-full">
        <div className="w-16 h-16 rounded-full bg-[#8B0000]/10 text-[#8B0000] flex items-center justify-center mx-auto">
          <Compass size={32} />
        </div>
        <h1 className="font-display text-3xl font-bold text-[#8B0000]">Track Your Box</h1>
        <p className="text-xs text-[#3A2D23]/60 leading-relaxed max-w-sm mx-auto">
          Enter your order reference code to check real-time fresh preparation and transit progress.
        </p>

        <form onSubmit={handleTrack} className="flex gap-2 max-w-md mx-auto">
          <input 
            required 
            placeholder="ORDER REFERENCE (e.g. PS-10231)" 
            value={orderId} 
            onChange={(e) => setOrderId(e.target.value)} 
            className="input-field uppercase" 
          />
          <button type="submit" className="btn-primary !px-6 flex items-center gap-1.5 font-bold tracking-widest text-xs">
            <Search size={14} /> Track
          </button>
        </form>

        {tracking && (
          <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm text-left space-y-4">
            <div className="flex justify-between items-center border-b border-[#B8860B]/10 pb-3">
              <span className="font-display font-bold text-sm text-[#8B0000]">{tracking.id}</span>
              <span className="bg-blue-50 text-blue-700 border border-blue-200/50 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                {tracking.status}
              </span>
            </div>
            <div className="space-y-3 text-xs text-[#3A2D23]/70">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#B8860B]" />
                <span>Estimated Arrival: <strong>{tracking.estimate}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#B8860B]" />
                <span>Carrier: <strong>{tracking.deliveryPartner}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#B8860B]" />
                <span>Destination: <strong>Hyderabad Metropolitan Area</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
