import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_pragathi'
const CONTACT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || 'template_5k3xk4j'
const AUTOREPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID || 'template_mz2tfnj'
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

/**
 * Checks if the configured EmailJS public key is valid.
 * An EmailJS public key is alphanumeric without spaces (e.g. user_xxx or alphanumeric token).
 */
export function isEmailJsConfigured() {
  if (!PUBLIC_KEY || PUBLIC_KEY.trim() === '' || PUBLIC_KEY.includes(' ') || PUBLIC_KEY.toLowerCase().includes('mail')) {
    return false
  }
  return true
}

/**
 * Dispatches both Contact Enquiry email and Customer Auto-Reply email via EmailJS.
 */
export async function sendContactEmails({ name, email, subject, message }) {
  if (!isEmailJsConfigured()) {
    throw new Error(
      'Invalid EmailJS Public Key in .env. Please find your Public Key in EmailJS Dashboard -> Account -> API Keys.'
    )
  }

  const templateParams = {
    name,
    from_name: name,
    user_name: name,
    email,
    from_email: email,
    reply_to: email,
    user_email: email,
    to_name: name,
    to_email: email,
    subject: subject || 'New Enquiry from Website',
    message: message || '',
    sent_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  }

  // 1. Send Enquiry to Admin/Store
  const enquiryPromise = emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, templateParams, PUBLIC_KEY)

  // 2. Send Auto-Reply to Customer
  const autoReplyPromise = emailjs.send(SERVICE_ID, AUTOREPLY_TEMPLATE_ID, templateParams, PUBLIC_KEY)

  const results = await Promise.allSettled([enquiryPromise, autoReplyPromise])

  const rejected = results.filter(r => r.status === 'rejected')
  if (rejected.length === results.length) {
    const firstErr = rejected[0].reason
    throw new Error(firstErr?.text || firstErr?.message || 'Failed to dispatch emails via EmailJS.')
  }

  return {
    enquirySent: results[0].status === 'fulfilled',
    autoReplySent: results[1].status === 'fulfilled'
  }
}

/**
 * Dispatches Customer Order Confirmation and Store Order Alert emails via EmailJS.
 */
export async function sendOrderConfirmationEmails({ order, customerEmail, customerName, phone, items, total, address }) {
  if (!isEmailJsConfigured()) {
    console.info('[EmailJS] Skipped order confirmation: EmailJS not configured')
    return { skipped: true }
  }

  const orderNum = order?.orderNumber || order?.id || 'PS-' + Date.now()
  const name = customerName || address?.name || 'Valued Customer'
  const email = customerEmail || address?.email || ''
  const finalTotal = total || order?.finalAmount || order?.totalAmount || '0.00'
  const itemsText = Array.isArray(items) && items.length > 0
    ? items.map(i => `${i.productName || i.name} x ${i.quantity} (₹${i.price})`).join(', ')
    : 'Artisanal Sweets & Snacks Box'

  const templateParams = {
    name,
    from_name: 'Pragathi Sweets',
    to_name: name,
    to_email: email,
    reply_to: 'venkatbodduluri78@gmail.com',
    user_email: email,
    email: email,
    subject: `✅ Order Confirmed #${orderNum} — Pragathi Sweets`,
    order_id: orderNum,
    order_number: orderNum,
    total_amount: `₹${finalTotal}`,
    amount: `₹${finalTotal}`,
    items_summary: itemsText,
    phone: phone || address?.phone || '',
    shipping_address: address ? `${address.line1 || ''}, ${address.city || ''}, ${address.pincode || ''}` : '',
    message: `Thank you for your order #${orderNum}! Total: ₹${finalTotal}.\nItems: ${itemsText}\nYour sweets are freshly made and dispatched with care.`,
    sent_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  }

  const customerPromise = emailjs.send(SERVICE_ID, AUTOREPLY_TEMPLATE_ID, templateParams, PUBLIC_KEY)
  const adminPromise = emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, {
    ...templateParams,
    subject: `🔔 [New Order Alert] #${orderNum} received — ₹${finalTotal}`,
    to_email: 'venkatbodduluri78@gmail.com'
  }, PUBLIC_KEY)

  const results = await Promise.allSettled([customerPromise, adminPromise])
  return {
    customerSent: results[0].status === 'fulfilled',
    adminSent: results[1].status === 'fulfilled'
  }
}

/**
 * Dispatches an OTP verification email to the user's email address via EmailJS.
 */
export async function sendOtpEmail({ toEmail, customerName, otpCode, type = 'EMAIL_CHANGE' }) {
  if (!isEmailJsConfigured()) {
    console.info('[EmailJS] Skipped OTP email: EmailJS not configured')
    return { skipped: true }
  }

  const name = customerName || 'Valued Customer'
  const isEmail = type === 'EMAIL_CHANGE'
  const purpose = isEmail ? 'Primary Email Verification' : 'Mobile Number Verification'

  const templateParams = {
    name,
    customer_name: name,
    user_name: name,
    from_name: 'Pragathi Sweets Security',
    to_name: name,
    to_email: toEmail,
    reply_to: 'venkatbodduluri78@gmail.com',
    user_email: toEmail,
    email: toEmail,
    subject: `🔐 Your Pragathi Sweets Verification Code: ${otpCode}`,
    message: `Your 6-digit verification code for ${purpose} is:\n\n👉 ${otpCode} 👈\n\nThis OTP is valid for 10 minutes. Please do not share this code with anyone.\n\nThank you for choosing Pragathi Sweets!`,
    otp_message: `Your 6-digit verification code is: ${otpCode}`,
    otp_code: otpCode,
    otp: otpCode,
    code: otpCode,
    verification_code: otpCode,
    purpose: purpose,
    sent_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  }

  return await emailjs.send(SERVICE_ID, AUTOREPLY_TEMPLATE_ID, templateParams, PUBLIC_KEY)
}

export default {
  isEmailJsConfigured,
  sendContactEmails,
  sendOrderConfirmationEmails,
  sendOtpEmail
}
