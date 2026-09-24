import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, ShoppingBag, ArrowRight, MessageSquare, 
  Copy, ExternalLink, Crown, Sparkles, Package, MapPin, Phone
} from 'lucide-react'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { orderService } from '../../services/orderService'
import toast from 'react-hot-toast'

export default function PaymentSuccess() {
  const location = useLocation()
  const orderId = location.state?.orderId || "PS-MOCK-101"
  const [whatsappMsg, setWhatsappMsg] = useState('')
  const [copied, setCopied] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState(true)

  useEffect(() => {
    async function loadPreview() {
      try {
        const preview = await orderService.getWhatsAppPreview(orderId)
        if (preview) {
          setWhatsappMsg(preview)
        }
      } catch (err) {
        console.warn('Could not load WhatsApp preview:', err)
      } finally {
        setLoadingMsg(false)
      }
    }
    if (orderId) {
      loadPreview()
    }
  }, [orderId])

  const copyToClipboard = () => {
    if (!whatsappMsg) return
    navigator.clipboard.writeText(whatsappMsg)
    setCopied(true)
    toast.success('WhatsApp receipt copied to clipboard!', {
      icon: '📋',
      style: { background: '#075E54', color: '#FFFDF8', borderRadius: '12px' }
    })
    setTimeout(() => setCopied(false), 2500)
  }

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      whatsappMsg || `Hello Pragathi Sweets! Here is my confirmed order receipt #${orderId}. Please update me on delivery dispatch.`
    )
    const phone = location.state?.customerPhone || location.state?.phone || ''
    const cleanPhone = phone ? phone.replace(/\D/g, '') : ''
    const target = cleanPhone.length === 10 ? `91${cleanPhone}` : (cleanPhone || '919032306961')
    window.open(`https://api.whatsapp.com/send?phone=${target}&text=${text}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body flex flex-col justify-between">
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
          <span className="text-[10px] tracking-[0.3em] font-bold text-[#B8860B] uppercase block">
            Payment & Order Confirmed
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-[#8B0000]">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-[#3A2D23]/70 max-w-lg mx-auto leading-relaxed">
            Your transaction has been securely authorized. Order <strong className="text-[#8B0000] font-mono">#{orderId}</strong> has been transmitted to our master sweet-makers for instant preparation.
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
                <h3 className="font-display text-base font-bold text-[#075E54]">
                  WhatsApp Order Confirmation
                </h3>
                <p className="text-xs text-[#3A2D23]/60">
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
                `🎉 *PRAGATHI SWEETS* 🎉
━━━━━━━━━━━━━━━━━━━━━━
✅ *Order Confirmed!*
🔖 Order No: *${orderId}*
📦 Status  : Scheduled for Fresh Prep
⏰ Delivery: 2–4 Business Days
📞 WhatsApp: +91 98490 12345
━━━━━━━━━━━━━━━━━━━━━━
🙏 Thank you for choosing Pragathi Sweets!
_Taste the Tradition_ 🍮`
              )
            )}
          </div>
        </motion.div>

        {/* VIP Membership Upsell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="bg-gradient-to-r from-[#1A0A0A] via-[#2A1117] to-[#3A1F0F] text-white rounded-3xl p-6 md:p-7 border border-[#B8860B]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl mb-10"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#B8860B]/20 border border-[#B8860B]/40 flex items-center justify-center shrink-0">
              <Crown size={24} className="text-[#E6C687]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-[#E6C687] font-bold tracking-widest uppercase">Pragathi Circle</span>
                <span className="text-[8px] bg-[#E6C687]/20 text-[#E6C687] px-2 py-0.5 rounded-full font-bold">10% OFF NEXT ORDER</span>
              </div>
              <h4 className="font-display text-lg font-bold text-white mt-0.5">
                Join Pragathi Circle VIP for ₹299/yr
              </h4>
              <p className="text-xs text-white/60">
                Unlock lifetime free delivery, priority festival shipping, and complimentary gift packaging.
              </p>
            </div>
          </div>

          <Link
            to="/subscription"
            className="shrink-0 px-6 py-3 rounded-full bg-gradient-to-r from-[#B8860B] to-[#E6C687] text-[#1A0A0A] font-bold text-xs tracking-wider uppercase shadow hover:scale-105 transition-all"
          >
            Explore VIP
          </Link>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/orders"
            className="py-3.5 px-5 rounded-2xl bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-bold tracking-widest uppercase text-center flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <ShoppingBag size={15} /> Track in Orders
          </Link>
          <Link
            to={`/track-order?id=${orderId}`}
            className="py-3.5 px-5 rounded-2xl border border-[#B8860B]/40 hover:bg-[#F5E6C8]/30 text-[#8B0000] text-xs font-bold tracking-widest uppercase text-center flex items-center justify-center gap-2 transition-all"
          >
            <Package size={15} /> Live Order Status
          </Link>
          <Link
            to="/products"
            className="py-3.5 px-5 rounded-2xl border border-gray-200 hover:border-gray-300 text-[#3A2D23]/80 hover:text-[#3A2D23] text-xs font-bold tracking-widest uppercase text-center flex items-center justify-center gap-2 transition-all"
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
