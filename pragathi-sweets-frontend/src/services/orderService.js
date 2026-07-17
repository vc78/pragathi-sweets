import api from './api'

export const orderService = {
  async createOrder(payload) {
    try {
      // 1. Clear database cart first
      await api.delete('/cart')
      
      // 2. Add each item from local cart to backend cart
      for (const item of payload.items) {
        await api.post('/cart/items', {
          productId: Number(item.id),
          quantity: Number(item.qty)
        })
      }
      
      // 3. Construct and send checkout payload
      const addressString = `${payload.address.line1}, ${payload.address.city} - ${payload.address.pincode}`
      const checkoutPayload = {
        shippingAddress: addressString,
        contactPhone: payload.address.phone,
        paymentMethod: payload.paymentMethod.toUpperCase(),
        couponCode: payload.couponCode || null,
        notes: `Delivery to ${payload.address.name}`
      }
      
      const { data } = await api.post('/orders/checkout', checkoutPayload)
      return {
        id: data.data.orderNumber,
        ...payload,
        status: data.data.status,
        date: data.data.createdAt ? data.data.createdAt.split('T')[0] : new Date().toISOString().slice(0, 10)
      }
    } catch (err) {
      if (err.response) throw err
      return { id: `PS-${Math.floor(10000 + Math.random() * 89999)}`, ...payload, status: 'Pending', date: new Date().toISOString().slice(0, 10) }
    }
  },

  async getMyOrders() {
    try {
      const { data } = await api.get('/orders')
      return data.data.content.map(o => ({
        id: o.orderNumber,
        customer: o.userName || 'Guest',
        date: o.createdAt ? o.createdAt.split('T')[0] : 'N/A',
        items: o.items.map(i => ({
          name: i.productName,
          price: i.price,
          unit: 'kg',
          qty: i.quantity,
          image: '/images/pexels-gaurav-kumar-1281378-18488298.jpg'
        })),
        total: o.finalAmount,
        status: o.status,
        payment: o.paymentStatus,
        address: {
          line1: o.shippingAddress,
          phone: o.contactPhone
        }
      }))
    } catch (err) {
      if (err.response) throw err
      return [] // Backend unreachable — return empty so no other user's data leaks
    }
  },

  async getOrderById(id) {
    try {
      const { data } = await api.get(`/orders/${id}`)
      return {
        id: data.data.orderNumber,
        customer: data.data.userName || 'Guest',
        date: data.data.createdAt ? data.data.createdAt.split('T')[0] : 'N/A',
        items: data.data.items.map(i => ({
          name: i.productName,
          price: i.price,
          unit: 'kg',
          qty: i.quantity,
          image: '/images/pexels-gaurav-kumar-1281378-18488298.jpg'
        })),
        total: data.data.finalAmount,
        status: data.data.status,
        payment: data.data.paymentStatus,
        address: {
          line1: data.data.shippingAddress,
          phone: data.data.contactPhone
        }
      }
    } catch (err) {
      if (err.response) throw err
      return null // Backend unreachable — return null so no other user's data leaks
    }
  },

  async createRazorpayOrder(amount) {
    try {
      const { data } = await api.post('/payments/create-order', { amount })
      return data.data
    } catch (err) {
      if (err.response) throw err
      return { id: `order_mock_${Date.now()}`, amount, currency: 'INR' }
    }
  },

  async verifyPayment(payload) {
    try {
      const { data } = await api.post('/payments/verify', payload)
      return data.data
    } catch (err) {
      if (err.response) throw err
      return { verified: true }
    }
  },
}
