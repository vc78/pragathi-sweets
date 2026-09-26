import api from './api'

export const subscriptionService = {
  /**
   * Initiate a Razorpay subscription order.
   * Returns { id, razorpayOrderId, razorpayKeyId, amount, email, ... }
   */
  async createOrder(payload) {
    const { data } = await api.post('/subscriptions/create-order', payload)
    return data.data
  },

  /**
   * Verify Razorpay payment signature and activate subscription.
   */
  async verifyAndActivate(payload) {
    const { data } = await api.post('/subscriptions/verify-payment', payload)
    return data.data
  },

  /**
   * Instant mock activation (for testing or direct admin flow).
   */
  async activateInstant(payload) {
    const { data } = await api.post('/subscriptions/activate-instant', payload)
    return data.data
  },

  /**
   * Get current user's active subscription (if any) or query by email.
   */
  async getMySubscription(email) {
    try {
      const url = email ? `/subscriptions/my-status?email=${encodeURIComponent(email)}` : '/subscriptions/my-status'
      const { data } = await api.get(url)
      return data.data || null
    } catch (err) {
      console.warn('Could not fetch subscription status:', err)
      return null
    }
  },

  /**
   * Check if an email already has an active subscription.
   */
  async checkByEmail(email) {
    try {
      const { data } = await api.get(`/subscriptions/my-status?email=${encodeURIComponent(email)}`)
      return data.data || null
    } catch {
      return null
    }
  },
}
