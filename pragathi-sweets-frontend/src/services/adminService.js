import api from './api'
import { SALES_TREND } from './mockData'
import { normalizeProduct } from './productService'

export const adminService = {
  async getDashboardStats() {
    try {
      const { data } = await api.get('/admin/analytics/dashboard')
      const { data: ordersData } = await api.get('/admin/orders')
      // Normalize real OrderResponse shape → Dashboard table columns (id, customer, total, status)
      const recentOrdersList = (ordersData.data?.content || []).slice(0, 5).map(o => ({
        id: o.orderNumber || `#${o.id}`,
        customer: o.userName || 'Guest',
        total: o.finalAmount ?? o.totalAmount ?? 0,
        status: o.status || 'PENDING',
      }))
      
      return {
        totalRevenue: data.data.totalRevenue || 0,
        totalOrders: data.data.totalOrders || 0,
        totalCustomers: data.data.totalUsers || 0,
        totalProducts: data.data.totalProducts || 0,
        salesTrend: SALES_TREND,
        recentOrders: recentOrdersList
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  // Products
  async getProducts() {
    try {
      const { data } = await api.get('/admin/products')
      return (data.data.content || []).map(normalizeProduct)
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async createProduct(payload) {
    // Map frontend 'image' field to backend 'imageUrl'
    const { image, stock, ...rest } = payload
    const backendPayload = { ...rest, imageUrl: image || '', stockQuantity: stock }
    try {
      const { data } = await api.post('/admin/products', backendPayload)
      return normalizeProduct(data.data)
    } catch (err) {
      if (err.response) throw err
      return { id: Date.now(), ...payload }
    }
  },
  async updateProduct(id, payload) {
    // Map frontend 'image' field to backend 'imageUrl'
    const { image, stock, ...rest } = payload
    const backendPayload = { ...rest, imageUrl: image || '', stockQuantity: stock }
    try {
      const { data } = await api.put(`/admin/products/${id}`, backendPayload)
      return normalizeProduct(data.data)
    } catch (err) {
      if (err.response) throw err
      return { id, ...payload }
    }
  },
  async deleteProduct(id) {
    try {
      await api.delete(`/admin/products/${id}`)
      return true
    } catch (err) {
      if (err.response) throw err
      return true
    }
  },

  // Orders
  async getOrders() {
    try {
      const { data } = await api.get('/admin/orders')
      // Normalize real OrderResponse → shape expected by OrdersManagement column keys:
      // { id (numeric DB id, for PATCH), orderNumber (display), customer, date, items, total, payment, status }
      return (data.data.content || []).map(o => ({
        id: o.id,                                                       // numeric — used for /admin/orders/{id}/status
        orderNumber: o.orderNumber || `#${o.id}`,                       // display label
        customer: o.userName || 'Guest',
        date: o.createdAt ? o.createdAt.split('T')[0] : 'N/A',
        items: Array.isArray(o.items) ? o.items.length : (o.items ?? 0),
        total: o.finalAmount ?? o.totalAmount ?? 0,
        payment: o.paymentStatus || o.paymentMethod || 'N/A',
        status: o.status || 'PENDING',
      }))
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async updateOrderStatus(id, status) {
    try {
      const { data } = await api.patch(`/admin/orders/${id}/status`, { status })
      return data.data
    } catch (err) {
      if (err.response) throw err
      return { id, status }
    }
  },

  // Customers
  async getCustomers() {
    try {
      const { data } = await api.get('/admin/users')
      const { data: ordersData } = await api.get('/admin/orders')
      const allOrders = ordersData.data?.content || []
      
      return data.data.content
        .filter(u => u.role === 'ROLE_USER')
        .map(u => {
          const userOrders = allOrders.filter(o => o.customerId === u.id || o.customerEmail === u.email)
          const spentTotal = userOrders.reduce((sum, o) => sum + (o.finalAmount || 0), 0)
          return {
            id: u.id,
            name: u.fullName,
            email: u.email,
            orders: userOrders.length,
            spent: spentTotal,
            joined: u.createdAt ? u.createdAt.split('T')[0] : 'N/A'
          }
        })
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  // Inventory
  async getInventory() {
    try {
      const { data } = await api.get('/admin/products')
      return data.data.content.map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stockQuantity,
        unit: p.unit,
        lowStockThreshold: 10
      }))
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async updateStock(id, stock) {
    try {
      const { data } = await api.put(`/admin/inventory/${id}`, { quantity: stock })
      return data.data
    } catch (err) {
      if (err.response) throw err
      return { id, stock }
    }
  },

  // Offers
  async getOffers() {
    try {
      const { data } = await api.get('/admin/festival-offers')
      return data.data.map(o => ({
        id: o.id,
        title: o.title,
        code: o.categoryName ? `${o.categoryName.toUpperCase()}${Math.floor(o.discountPercentage)}` : `FESTIVE${Math.floor(o.discountPercentage)}`,
        discount: `${o.discountPercentage}%`,
        expires: o.endDate ? o.endDate.split('T')[0] : 'N/A',
        active: o.active
      }))
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async createOffer(payload) {
    try {
      const discountPercentage = parseFloat(payload.discount) || 10.0
      const backendPayload = {
        title: payload.title,
        description: payload.title,
        discountPercentage: discountPercentage,
        imageUrl: '',
        categoryId: null,
        startDate: new Date().toISOString().split('T')[0],
        endDate: payload.expires,
        active: true
      }
      const { data } = await api.post('/admin/festival-offers', backendPayload)
      return {
        id: data.data.id,
        title: data.data.title,
        code: payload.code || 'FESTIVE',
        discount: `${data.data.discountPercentage}%`,
        expires: data.data.endDate ? data.data.endDate.split('T')[0] : 'N/A',
        active: data.data.active
      }
    } catch (err) {
      if (err.response) throw err
      return { id: Date.now(), ...payload }
    }
  },
  async toggleOffer(id) {
    try {
      const { data: offersData } = await api.get('/admin/festival-offers')
      const offer = offersData.data.find(o => o.id === id)
      if (!offer) throw new Error('Offer not found')
      
      const toggledActive = !offer.active
      const { data } = await api.put(`/admin/festival-offers/${id}`, {
        title: offer.title,
        description: offer.description,
        discountPercentage: offer.discountPercentage,
        categoryId: offer.categoryId,
        active: toggledActive,
        startDate: offer.startDate,
        endDate: offer.endDate
      })
      return data.data
    } catch (err) {
      if (err.response) throw err
      return { id }
    }
  },

  // Reviews
  async getReviews() {
    try {
      const { data } = await api.get('/admin/reviews')
      return data.data
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async moderateReview(id, approved) {
    try {
      const { data } = await api.patch(`/admin/reviews/${id}`, { approved })
      return data.data
    } catch (err) {
      if (err.response) throw err
      return { id, approved }
    }
  },

  // Analytics
  async getAnalytics() {
    const CATEGORY_BREAKDOWN = [
      { name: 'Milk Sweets', value: 34 },
      { name: 'Dry Fruit Sweets', value: 26 },
      { name: 'Bengali Sweets', value: 18 },
      { name: 'Savouries', value: 12 },
      { name: 'Festival Hampers', value: 10 },
    ]
    try {
      // Fetch dashboard stats (for context) AND real products for topProducts section.
      // NOTE: The /admin/analytics/dashboard endpoint returns aggregate counts only —
      // it does NOT return a month-by-month salesTrend. SALES_TREND below is a
      // documented placeholder until a time-series analytics endpoint is available.
      await api.get('/admin/analytics/dashboard')
      const { data: productsData } = await api.get('/admin/products')
      const topProducts = (productsData.data?.content || [])
        .map(normalizeProduct)
        .filter(p => p.rating > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5)
      return {
        salesTrend: SALES_TREND,   // placeholder — no month-trend endpoint in backend
        topProducts: topProducts,
        categoryBreakdown: CATEGORY_BREAKDOWN,
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  },
}
