import api from './api'
import { PRODUCTS, ORDERS, CUSTOMERS, REVIEWS, SALES_TREND, OFFERS } from './mockData'

// Normalize a product from the backend into the shape the UI expects.
function normalizeProduct(p) {
  return {
    ...p,
    image: p.image || p.imageUrl || '',
    stock: p.stock ?? p.stockQuantity ?? 0,
    rating: p.rating ?? p.averageRating ?? 0,
    bestseller: p.bestseller ?? p.bestSeller ?? false,
    category: p.category || p.categoryName || '',
  }
}

export const adminService = {
  async getDashboardStats() {
    try {
      const { data } = await api.get('/admin/analytics/dashboard')
      const { data: ordersData } = await api.get('/admin/orders')
      const recentOrdersList = (ordersData.data?.content || []).slice(0, 5).map(o => ({
        id: o.orderNumber,
        customer: o.customerName || 'Guest',
        total: o.finalAmount,
        status: o.status
      }))
      
      return {
        totalRevenue: data.data.totalRevenue || 0,
        totalOrders: data.data.totalOrders || 0,
        totalCustomers: data.data.totalUsers || 0,
        totalProducts: data.data.totalProducts || 0,
        salesTrend: SALES_TREND,
        recentOrders: recentOrdersList.length ? recentOrdersList : ORDERS.slice(0, 5)
      }
    } catch (err) {
      if (err.response) throw err
      return {
        totalRevenue: SALES_TREND.reduce((s, m) => s + m.sales, 0),
        totalOrders: ORDERS.length,
        totalCustomers: CUSTOMERS.length,
        totalProducts: PRODUCTS.length,
        salesTrend: SALES_TREND,
        recentOrders: ORDERS.slice(0, 5),
      }
    }
  },

  // Products
  async getProducts() {
    try {
      const { data } = await api.get('/admin/products')
      return (data.data.content || []).map(normalizeProduct)
    } catch (err) {
      if (err.response) throw err
      return PRODUCTS
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
      return data.data.content
    } catch (err) {
      if (err.response) throw err
      return ORDERS
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
      if (err.response) throw err
      return CUSTOMERS
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
      if (err.response) throw err
      return PRODUCTS.map((p) => ({ id: p.id, name: p.name, stock: p.stock, unit: p.unit, lowStockThreshold: 10 }))
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
      if (err.response) throw err
      return OFFERS
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
      if (err.response) throw err
      return REVIEWS
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
    try {
      const { data } = await api.get('/admin/analytics/dashboard')
      return {
        salesTrend: SALES_TREND,
        topProducts: PRODUCTS.slice().sort((a, b) => b.rating - a.rating).slice(0, 5),
        categoryBreakdown: [
          { name: 'Milk Sweets', value: 34 },
          { name: 'Dry Fruit Sweets', value: 26 },
          { name: 'Bengali Sweets', value: 18 },
          { name: 'Savouries', value: 12 },
          { name: 'Festival Hampers', value: 10 },
        ]
      }
    } catch (err) {
      if (err.response) throw err
      return {
        salesTrend: SALES_TREND,
        topProducts: PRODUCTS.slice().sort((a, b) => b.rating - a.rating).slice(0, 5),
        categoryBreakdown: [
          { name: 'Milk Sweets', value: 34 },
          { name: 'Dry Fruit Sweets', value: 26 },
          { name: 'Bengali Sweets', value: 18 },
          { name: 'Savouries', value: 12 },
          { name: 'Festival Hampers', value: 10 },
        ],
      }
    }
  },
}
