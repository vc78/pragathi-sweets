import { useEffect, useState } from 'react'
import { useSearchParams, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, MessageSquare, Copy, ExternalLink, ShoppingBag, ArrowRight, Package, Crown } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import api from '../../services/api'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const orderId = searchParams.get('orderId') || searchParams.get('id') || 'AGV-' + Math.floor(100000 + Math.random() * 900000)
  
  const [whatsappMsg, setWhatsappMsg] = useState('')
  const [loadingMsg, setLoadingMsg] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    // Fetch formatted WhatsApp message from backend
    if (orderId) {
      api.get(`/orders/${orderId}/whatsapp-message`)
        .then(res => {
          if (res.data?.success && res.data?.whatsappMessage) {
            setWhatsappMsg(res.data.whatsappMessage)
          }
        })
        .catch(err => {
          console.warn('Could not fetch auto WhatsApp receipt, using formatted template', err)
        })
        .finally(() => setLoadingMsg(false))
    } else {
      setLoadingMsg(false)
    }
  }, [orderId])

  const copyToClipboard = () => {
    if (!whatsappMsg) return
    navigator.clipboard.writeText(whatsappMsg)
    setCopied(true)
    toast.success('WhatsApp receipt copied to clipboard!', {
      icon: '📋',
      style: { background: '#075E54', color: '#FAF7F2', borderRadius: '12px' }
    })
    setTimeout(() => setCopied(false), 2500)
  }

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      whatsappMsg || `Hello AGVIA Atelier Support! Here is my confirmed order receipt #${orderId}. Please update me on courier dispatch.`
    )
    const phone = location.state?.customerPhone || location.state?.phone || ''
    const cleanPhone = phone ? phone.replace(/\D/g, '') : ''
    const target = cleanPhone.length === 10 ? `91${cleanPhone}` : (cleanPhone || '919032306961')
    window.open(`https://api.whatsapp.com/send?phone=${target}&text=${text}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211D1E] font-body flex flex-col justify-between selection:bg-[#C9A45C]/30">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-14 w-full">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-10"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 size={44} />
          </div>
          <span className="text-[10px] tracking-[0.3em] font-bold text-[#C9A45C] uppercase block">
            Payment & Couture Order Confirmed
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#5A1020]">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-[#211D1E]/70 max-w-lg mx-auto leading-relaxed">
            Your transaction has been securely authorized. Order <strong className="text-[#5A1020] font-mono">#{orderId}</strong> has been transmitted to our master atelier karigars for bespoke finishing and heirloom packaging.
          </p>
        </motion.div>

        {/* WhatsApp Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="bg-white border border-[#25D366]/30 rounded-3xl p-6 md:p-8 shadow-lg shadow-emerald-500/5 mb-8 relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#25D366]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#25D366]/15 flex items-center justify-center text-[#075E54]">
                <MessageSquare size={22} className="text-[#25D366]" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#075E54]">
                  WhatsApp Order Confirmation
                </h3>
                <p className="text-xs text-[#211D1E]/60">
                  Instant real-time receipt & dispatch updates sent directly to your phone.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {whatsappMsg && (
                <button
                  onClick={copyToClipboard}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-all"
                >
                  <Copy size={13} /> {copied ? 'Copied' : 'Copy'}
                </button>
              )}
              <button
                onClick={shareOnWhatsApp}
                className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <ExternalLink size={13} /> Open in WhatsApp
              </button>
            </div>
          </div>

          {/* Formatted WhatsApp Preview Box */}
          <div className="mt-5 bg-[#ECE5DD]/40 border border-[#075E54]/10 rounded-2xl p-4 md:p-5 font-mono text-xs text-[#2A2A2A] whitespace-pre-line leading-relaxed overflow-x-auto shadow-inner">
            {whatsappMsg || (
              loadingMsg ? (
                <div className="py-6 text-center text-gray-400 font-sans text-xs">
                  Generating your professional WhatsApp receipt...
                </div>
              ) : (
                `👑 *AGVIA — WOMEN'S WEAR BOUTIQUE* 👑
━━━━━━━━━━━━━━━━━━━━━━
✅ *Atelier Order Confirmed!*
🔖 Order No: *${orderId}*
📦 Status  : Scheduled for Handcrafted Inspection & Keepsake Packaging
⏰ Delivery: 2–4 Business Days
📞 Concierge: +91 90323 06961
━━━━━━━━━━━━━━━━━━━━━━
🙏 Thank you for choosing AGVIA!
_Timeless Indian Luxury Couture_ 👗`
              )
            )}
          </div>
        </motion.div>

        {/* Atelier Circle VIP Membership Upsell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="bg-gradient-to-r from-[#2E050E] via-[#5A1020] to-[#2E050E] text-white rounded-3xl p-6 md:p-7 border border-[#C9A45C]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl mb-10"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A45C]/20 border border-[#C9A45C]/40 flex items-center justify-center shrink-0">
              <Crown size={24} className="text-[#C9A45C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-[#C9A45C] font-bold tracking-widest uppercase">AGVIA Atelier Circle</span>
                <span className="text-[8px] bg-[#C9A45C]/20 text-[#C9A45C] px-2 py-0.5 rounded-full font-bold">15% OFF NEXT ORDER</span>
              </div>
              <h4 className="font-serif text-lg font-bold text-white mt-0.5">
                Join Atelier Circle VIP for ₹499/yr
              </h4>
              <p className="text-xs text-white/70">
                Unlock complimentary made-to-measure fittings, priority bridal dispatch, and bespoke styling consultations.
              </p>
            </div>
          </div>

          <Link
            to="/subscription"
            className="shrink-0 px-6 py-3 rounded-full bg-gradient-to-r from-[#C9A45C] to-[#E8C7C3] text-[#2E050E] font-bold text-xs tracking-wider uppercase shadow hover:scale-105 transition-all font-sans"
          >
            Explore VIP Circle
          </Link>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/orders"
            className="py-3.5 px-5 rounded-2xl bg-[#5A1020] hover:bg-[#400B16] text-[#FAF7F2] text-xs font-bold tracking-widest uppercase text-center flex items-center justify-center gap-2 shadow-md transition-all font-sans"
          >
            <ShoppingBag size={15} /> Track in Orders
          </Link>
          <Link
            to={`/track-order?id=${orderId}`}
            className="py-3.5 px-5 rounded-2xl border border-[#C9A45C]/40 hover:bg-[#C9A45C]/10 text-[#5A1020] text-xs font-bold tracking-widest uppercase text-center flex items-center justify-center gap-2 transition-all font-sans"
          >
            <Package size={15} /> Live Order Status
          </Link>
          <Link
            to="/products"
            className="py-3.5 px-5 rounded-2xl border border-gray-200 hover:border-[#C9A45C]/40 text-[#211D1E]/80 hover:text-[#5A1020] text-xs font-bold tracking-widest uppercase text-center flex items-center justify-center gap-2 transition-all font-sans"
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
