import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { authService } from '../../services/authService'
import { profileUpdated } from '../../store/authSlice'
import { motion } from 'framer-motion'
import { User, Shield, Ticket, Sparkles, Award, ShoppingBag } from 'lucide-react'

export default function Profile() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })
  const [saving, setSaving] = useState(false)

  // Mock Loyalty Coins
  const goldCoins = 380

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await authService.updateProfile(form)
      dispatch(profileUpdated(updated))
      toast.success('Your boutique profile has been updated.', {
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
    } catch (err) {
      toast.error('Could not update profile details.')
    } finally {
      setSaving(false)
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
          
          {/* Left Column: Loyalty Status / Coins Summary */}
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
                  className="flex items-center gap-2.5 p-3 rounded-xl transition-colors bg-[#8B0000]/5 border border-[#B8860B]/10 text-[#8B0000] font-bold"
                >
                  <User size={14} className="text-[#8B0000]" />
                  <span>Personal Settings</span>
                </Link>
                <Link 
                  to="/orders" 
                  className="flex items-center gap-2.5 p-3 rounded-xl transition-colors hover:bg-[#F5E6C8]/30 text-[#3A2D23]/75"
                >
                  <ShoppingBag size={14} className="text-[#B8860B]" />
                  <span>Order History</span>
                </Link>
              </div>
            </div>

            {/* Exclusive Coupons */}
            <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="font-display text-sm tracking-widest text-[#8B0000] font-bold uppercase pb-2 border-b border-[#B8860B]/5 flex items-center gap-1.5">
                <Ticket size={16} className="text-[#B8860B]" /> Available Perks
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

          {/* Right Column: Settings Form */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
            >
              <h2 className="font-display text-xl text-[#8B0000] font-bold pb-4 border-b border-[#B8860B]/10 flex items-center gap-2 select-none">
                <User size={18} className="text-[#B8860B]" /> Personal Information
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Email Address</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email" required className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Contact Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98490 12345" className="input-field" />
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button type="submit" disabled={saving} className="btn-primary flex-1 sm:flex-none">
                    {saving ? 'Saving changes...' : 'Save Profile Changes'}
                  </button>
                  <span className="hidden sm:flex items-center gap-1.5 text-[10px] text-[#3A2D23]/40 font-bold select-none">
                    <Shield size={12} className="text-[#B8860B]" /> End-to-end encrypted sessions
                  </span>
                </div>
              </form>
            </motion.div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
