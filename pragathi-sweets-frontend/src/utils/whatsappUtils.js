/**
 * WhatsApp Utility for Direct Receipt Generation and Messaging
 */
import { BUSINESS } from '../constants/business'

export function buildWhatsAppOrderMessage({ order, customerName, phone, address, items, total }) {
  const orderNum = order?.orderNumber || order?.id || 'PS-' + Date.now()
  const name = customerName || address?.name || order?.userName || 'Valued Customer'
  const itemsList = Array.isArray(items) && items.length > 0 
    ? items 
    : (Array.isArray(order?.items) ? order.items : [])
  const finalAmount = total || order?.finalAmount || order?.totalAmount || order?.total || '0'
  const paymentMethod = order?.paymentMethod === 'COD' 
    ? 'Cash on Delivery 💵' 
    : 'Online Payment (Razorpay) 💳'

  let msg = `🎉 *PRAGATHI SWEETS* 🎉\n`
  msg += `━━━━━━━━━━━━━━━━━━━━━━\n`
  msg += `✅ *Order Confirmed!*\n\n`
  msg += `👤 Dear *${name}*,\n`
  msg += `Your order has been placed successfully!\n\n`
  msg += `📦 *Order Details*\n`
  msg += `━━━━━━━━━━━━━━━━━━━━━━\n`
  msg += `🔖 Order No : *${orderNum}*\n`
  msg += `📅 Date      : ${new Date().toLocaleDateString('en-IN')}\n`
  msg += `💳 Payment   : ${paymentMethod}\n\n`

  if (itemsList.length > 0) {
    msg += `🛒 *Items Ordered*\n`
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`
    itemsList.forEach((item) => {
      const pName = item.productName || item.name || 'Artisanal Confection'
      const qty = item.quantity || item.qty || 1
      const pPrice = item.subtotal || (item.price ? item.price * qty : 0)
      msg += `• ${pName} × ${qty}  ₹${pPrice}\n`
    })
    msg += `\n`
  }

  msg += `💰 *Total Amount: ₹${finalAmount}*\n`
  if (address?.line1 || order?.shippingAddress) {
    const addr = address ? `${address.line1 || ''}, ${address.city || ''} ${address.pincode || ''}` : order.shippingAddress
    msg += `📍 *Delivery Address*: ${addr}\n`
  }
  msg += `\n━━━━━━━━━━━━━━━━━━━━━━\n`
  msg += `⏰ *Estimated Delivery*: 2–4 Business Days\n`
  msg += `🚚 *Live Tracking*: ${window.location.origin}/track-order?order=${orderNum}\n`
  msg += `📞 Support: ${BUSINESS?.contact?.phone || '+91 9032306961'}\n\n`
  msg += `🙏 *Thank you for choosing Pragathi Sweets!*\n`
  msg += `_Taste the Tradition_ 🍮`

  return msg
}

export function buildWhatsAppDirectUrl(phone, text) {
  if (!phone) {
    const storeRaw = (BUSINESS?.contact?.whatsappRaw || '919032306961').replace(/\D/g, '')
    return `https://api.whatsapp.com/send?phone=${storeRaw}&text=${encodeURIComponent(text)}`
  }
  const cleanDigits = String(phone).replace(/\D/g, '')
  const formatted = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits
  return `https://api.whatsapp.com/send?phone=${formatted}&text=${encodeURIComponent(text)}`
}

export function openWhatsAppDirectly(phone, text) {
  try {
    const url = buildWhatsAppDirectUrl(phone, text)
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    return !!win
  } catch (err) {
    console.warn('Could not open WhatsApp window:', err)
    return false
  }
}
