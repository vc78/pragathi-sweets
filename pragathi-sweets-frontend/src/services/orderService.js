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
        id: data.data.orderNumber || data.data.id,
        orderNumber: data.data.orderNumber,
        backendId: data.data.id,
        ...payload,
        status: data.data.status,
        date: data.data.createdAt ? data.data.createdAt.split('T')[0] : new Date().toISOString().slice(0, 10)
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  async getMyOrders() {
    try {
      const { data } = await api.get('/orders')
      return data.data.content.map(o => ({
        id: o.orderNumber || `ORD-${o.id}`,
        orderNumber: o.orderNumber,
        backendId: o.id,
        customer: o.userName || 'Guest',
        date: o.createdAt ? o.createdAt.split('T')[0] : 'N/A',
        items: (o.items || []).map(i => ({
          name: i.productName,
          price: i.price,
          unit: 'kg',
          qty: i.quantity,
          image: '/images/pexels-gaurav-kumar-1281378-18488298.jpg'
        })),
        total: o.finalAmount,
        totalAmount: o.totalAmount,
        discountAmount: o.discountAmount || 0,
        finalAmount: o.finalAmount,
        couponCode: o.couponCode,
        status: o.status,
        payment: o.paymentStatus,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod || 'COD',
        address: {
          line1: o.shippingAddress,
          phone: o.contactPhone
        }
      }))
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  async getOrderById(id) {
    try {
      const { data } = await api.get(`/orders/${id}`)
      return {
        id: data.data.orderNumber || `ORD-${data.data.id}`,
        orderNumber: data.data.orderNumber,
        backendId: data.data.id,
        customer: data.data.userName || 'Guest',
        date: data.data.createdAt ? data.data.createdAt.split('T')[0] : 'N/A',
        items: (data.data.items || []).map(i => ({
          name: i.productName,
          price: i.price,
          unit: 'kg',
          qty: i.quantity,
          image: '/images/pexels-gaurav-kumar-1281378-18488298.jpg'
        })),
        total: data.data.finalAmount,
        totalAmount: data.data.totalAmount,
        discountAmount: data.data.discountAmount || 0,
        finalAmount: data.data.finalAmount,
        couponCode: data.data.couponCode,
        status: data.data.status,
        payment: data.data.paymentStatus,
        paymentStatus: data.data.paymentStatus,
        paymentMethod: data.data.paymentMethod || 'COD',
        address: {
          line1: data.data.shippingAddress,
          phone: data.data.contactPhone
        }
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  async createRazorpayOrder(orderNumber) {
    try {
      const { data } = await api.post(`/payments/razorpay/create/${orderNumber}`)
      return data.data
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  async verifyPayment(payload) {
    try {
      const { data } = await api.post('/payments/razorpay/verify', payload)
      return data.data
    } catch (err) {
      console.error(err)
      throw err
    }
  },
}
