import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  Check,
  Copy,
  ExternalLink,
  X,
  Send,
  Phone,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  Store
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { BUSINESS } from '../../constants/business'

export default function WhatsAppConfirmationModal({ isOpen, onClose, order, customerName, defaultPhone }) {
  const [copied, setCopied] = useState(false)
  const [customPhone, setCustomPhone] = useState(defaultPhone || '')
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [messageText, setMessageText] = useState('')

  // Build client-side fallback message if backend fetch is pending or fails
  const buildFallbackMessage = () => {
    if (!order) return ''
    const orderNum = order.orderNumber || order.id || 'PS-ORDER'
    const name = customerName || order.customer || 'Valued Customer'
    const items = order.items || []

    let msg = `👑 *AGVIA WOMEN'S WEAR BOUTIQUE* 👑\n`
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `✅ *Order Confirmed!*\n\n`
    msg += `👤 Dear *${name}*,\n`
    msg += `Your bespoke order has been placed successfully!\n\n`
    msg += `📦 *Order Details*\n`
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `🔖 Order No : *${orderNum}*\n`
    msg += `📅 Date      : ${order.date || new Date().toLocaleDateString('en-IN')}\n`
    msg += `💳 Payment   : ${order.paymentMethod === 'COD' ? 'Cash on Delivery 💵' : 'Online Payment (Razorpay) 💳'}\n\n`
    msg += `🛒 *Items Ordered*\n`
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`

    items.forEach((item) => {
      const pName = item.name || item.productName || 'Confection'
      const pQty = item.qty || item.quantity || 1
      const pPrice = item.price || item.unitPrice || 0
      msg += `• ${pName} × ${pQty}  ₹${pPrice * pQty}\n`
    })

    msg += `\n💰 *Price Breakdown*\n`
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `  Sub-total   : ₹${order.totalAmount || order.total || 0}\n`
    if (order.discountAmount && Number(order.discountAmount) > 0) {
      msg += `  🏷️ Discount  : -₹${order.discountAmount}${order.couponCode ? ` (${order.couponCode})` : ''}\n`
    }
    msg += `  🚚 Delivery  : ${order.total >= 999 ? '*FREE* 🎁' : '₹50'}\n`
    msg += `  ─────────────────────\n`
    msg += `  *TOTAL PAYABLE: ₹${order.finalAmount || order.total || 0}*\n\n`
    if (order.address?.line1) {
      msg += `📍 *Deliver To*\n${order.address.line1}\n\n`
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `⏰ *Estimated Delivery*: 2–4 Business Days\n\n`
    msg += `📞 Need help? Call/WhatsApp us at ${BUSINESS?.contact?.phone || '+91 90323 06961'}\n`
    msg += `🌐 agvia.in\n\n`
    msg += `🙏 *Thank you for choosing AGVIA Boutique!*\n`
    msg += `_Couture Crafted with Heritage_ ✨`
    return msg
  }

  useEffect(() => {
    if (!isOpen || !order) return
    const phoneToUse = defaultPhone || order.address?.phone || ''
    setCustomPhone(phoneToUse)

    // Try fetching authoritative server-rendered preview
    const orderIdToFetch = order.orderNumber || order.backendId || order.id
    if (orderIdToFetch) {
      setLoadingPreview(true)
      api.get(`/orders/${orderIdToFetch}/whatsapp-preview`)
        .then((res) => {
          if (res.data?.data) {
            setMessageText(res.data.data)
          } else {
            setMessageText(buildFallbackMessage())
          }
        })
        .catch(() => {
          setMessageText(buildFallbackMessage())
        })
        .finally(() => {
          setLoadingPreview(false)
        })
    } else {
      setMessageText(buildFallbackMessage())
    }
  }, [isOpen, order])

  if (!isOpen || !order) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText)
    setCopied(true)
    toast.success('WhatsApp receipt copied to clipboard!', {
      icon: '📋',
      style: { background: '#075E54', color: '#FFFDF8', borderRadius: '12px' }
    })
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSendToCustomer = () => {
    const rawDigits = (customPhone || '').replace(/[^\d]/g, '')
    const targetPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits
    const encoded = encodeURIComponent(messageText)
    const url = targetPhone
      ? `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`
    window.open(url, '_blank', 'noopener,noreferrer')
    toast.success('Opening WhatsApp to your phone…', { icon: '📱', style: { background: '#075E54', color: '#fff', borderRadius: '12px' } })
  }

  const handleSendToStore = () => {
    const storeRaw = (BUSINESS?.contact?.whatsappRaw || '919032306961').replace(/[^\d]/g, '')
    const encoded = encodeURIComponent(messageText)
    window.open(`https://api.whatsapp.com/send?phone=${storeRaw}&text=${encoded}`, '_blank', 'noopener,noreferrer')
    toast.success('Opening WhatsApp to AGVIA Boutique Concierge…', { icon: '🏪', style: { background: '#128C7E', color: '#fff', borderRadius: '12px' } })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#B8860B]/20 flex flex-col max-h-[90vh]"
        >
          {/* Header Bar - Authentic WhatsApp Business Branding */}
          <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] text-white px-6 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#8B0000] font-display font-bold text-base shadow-inner border border-amber-200">
                  🍮
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-white rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm tracking-wide">AGVIA Boutique Concierge</h3>
                  <ShieldCheck size={14} className="text-[#25D366]" />
                </div>
                <p className="text-[11px] text-white/80 flex items-center gap-1">
                  <span>Official Business Account</span>
                  <span>•</span>
                  <span className="text-[#25D366] font-medium">Online</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title="Close Preview"
            >
              <X size={18} />
            </button>
          </div>

          {/* Subheader Banner */}
          <div className="bg-[#EFEAE2] border-b border-[#D1D7DB] px-6 py-2.5 flex items-center justify-between text-xs text-[#54656F]">
            <div className="flex items-center gap-2">
              <MessageCircle size={14} className="text-[#128C7E]" />
              <span className="font-medium text-[#111B21]">Instant WhatsApp Order Receipt</span>
            </div>
            <span className="text-[10px] bg-white/80 border border-[#D1D7DB] px-2 py-0.5 rounded-full font-mono text-[#008069] font-bold">
              #{order.orderNumber || order.id}
            </span>
          </div>

          {/* WhatsApp Chat Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#EFEAE2] relative">
            {/* WhatsApp Chat Bubble */}
            <div className="max-w-[95%] sm:max-w-[90%] bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-[#E9EDEF] text-[#111B21] text-xs leading-relaxed space-y-2 relative">
              {loadingPreview ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-2 text-[#54656F]">
                  <div className="w-6 h-6 border-2 border-[#128C7E] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs">Preparing official branded receipt...</p>
                </div>
              ) : (
                <pre className="font-sans whitespace-pre-wrap select-text text-[12px] sm:text-[13px] leading-relaxed break-words text-[#111B21]">
                  {messageText}
                </pre>
              )}

              {/* Message Footer Info (Timestamp & Read Ticks) */}
              <div className="flex items-center justify-end gap-1 text-[10px] text-[#667781] pt-1 select-none">
                <span>Just now</span>
                <CheckCheck size={14} className="text-[#53BDEB]" />
              </div>
            </div>
          </div>

          {/* Interactive Footer & Actions */}
          <div className="bg-white border-t border-[#E9EDEF] p-4 sm:p-5 space-y-3.5">
            {/* Phone Number Target */}
            <div className="flex items-center gap-2 text-xs">
              <div className="relative flex-1">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B0000]/60" />
                <input
                  type="tel"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="Recipient Mobile Number (e.g. 9032306961)"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#B8860B]/25 focus:outline-none focus:border-[#8B0000] transition-colors"
                />
              </div>
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 text-xs rounded-xl border border-[#B8860B]/30 hover:bg-[#F5E6C8]/20 text-[#8B0000] font-semibold flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Done
              </button>
              <button
                onClick={handleSendToCustomer}
                className="flex-[2] py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Send size={14} />
                <span>Send to My WhatsApp</span>
                <ExternalLink size={12} className="opacity-75" />
              </button>
              <button
                onClick={handleSendToStore}
                className="flex-[2] py-2.5 px-4 rounded-xl bg-[#128C7E] hover:bg-[#0a7468] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                title="Send receipt to AGVIA boutique concierge & dispatch team"
              >
                <Store size={14} />
                <span>Send to AGVIA Boutique</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
