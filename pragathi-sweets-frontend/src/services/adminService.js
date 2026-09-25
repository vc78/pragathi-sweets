import api from './api'
import { SALES_TREND } from './mockData'
import { normalizeProduct } from './productService'

export const adminService = {
  async getDashboardStats() {
    try {
      const { data } = await api.get('/admin/analytics/dashboard')
      const { data: ordersData } = await api.get('/admin/orders')
      const ordersList = ordersData.data?.content || []
      // Normalize real OrderResponse shape → Dashboard table columns (id, customer, total, status)
      const recentOrdersList = ordersList.slice(0, 5).map(o => ({
        id: o.orderNumber || `#${o.id}`,
        customer: o.userName || 'Guest',
        total: o.finalAmount ?? o.totalAmount ?? 0,
        status: o.status || 'PENDING',
      }))

      let salesTrend = SALES_TREND
      if (ordersList.length > 0) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const monthlyTotals = {}
        ordersList.forEach(o => {
          if (o.createdAt) {
            const d = new Date(o.createdAt)
            const m = monthNames[d.getMonth()]
            const amt = o.finalAmount ?? o.totalAmount ?? 0
            monthlyTotals[m] = (monthlyTotals[m] || 0) + amt
          }
        })
        const computed = Object.entries(monthlyTotals).map(([month, sales]) => ({ month, sales: Math.round(sales) }))
        if (computed.length >= 2) {
          salesTrend = computed
        }
      }
      
      return {
        totalRevenue: data.data.totalRevenue || 0,
        totalOrders: data.data.totalOrders || 0,
        totalCustomers: data.data.totalUsers || 0,
        totalProducts: data.data.totalProducts || 0,
        salesTrend,
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
      console.error('Failed to get products:', err)
      throw err
    }
  },
  async createProduct(payload) {
    const { image, stock, ...rest } = payload
    let categoryId = payload.categoryId ? Number(payload.categoryId) : undefined
    
    // Auto-resolve categoryId if not provided but category name is available
    if (!categoryId && payload.category) {
      try {
        const cats = await adminService.getCategories()
        const matched = cats.find(c => c.name.toLowerCase() === String(payload.category).toLowerCase())
        if (matched) categoryId = matched.id
      } catch (e) {
        console.warn('Could not auto-resolve categoryId from category name:', e)
      }
    }

    const backendPayload = {
      ...rest,
      name: payload.name?.trim(),
      description: payload.description || '',
      sku: payload.sku || `PRG-${Date.now().toString().slice(-6)}`,
      price: Number(payload.price),
      discountPrice: payload.discountPrice ? Number(payload.discountPrice) : null,
      stockQuantity: Number(stock ?? payload.stockQuantity ?? 0),
      unit: payload.unit || 'kg',
      imageUrl: image || payload.imageUrl || '',
      categoryId: categoryId,
      active: payload.active ?? true,
    }

    try {
      const { data } = await api.post('/admin/products', backendPayload)
      return normalizeProduct(data.data)
    } catch (err) {
      console.error('Failed to create product:', err)
      throw err
    }
  },
  async updateProduct(id, payload) {
    const { image, stock, ...rest } = payload
    let categoryId = payload.categoryId ? Number(payload.categoryId) : undefined

    if (!categoryId && payload.category) {
      try {
        const cats = await adminService.getCategories()
        const matched = cats.find(c => c.name.toLowerCase() === String(payload.category).toLowerCase())
        if (matched) categoryId = matched.id
      } catch (e) {
        console.warn('Could not auto-resolve categoryId:', e)
      }
    }

    const backendPayload = {
      ...rest,
      name: payload.name?.trim(),
      description: payload.description || '',
      sku: payload.sku,
      price: Number(payload.price),
      discountPrice: payload.discountPrice ? Number(payload.discountPrice) : null,
      stockQuantity: Number(stock ?? payload.stockQuantity ?? 0),
      unit: payload.unit || 'kg',
      imageUrl: image || payload.imageUrl || '',
      categoryId: categoryId,
      active: payload.active ?? true,
    }

    try {
      const { data } = await api.put(`/admin/products/${id}`, backendPayload)
      return normalizeProduct(data.data)
    } catch (err) {
      console.error('Failed to update product:', err)
      throw err
    }
  },
  async deleteProduct(id) {
    try {
      await api.delete(`/admin/products/${id}`)
      return true
    } catch (err) {
      console.error('Failed to delete product:', err)
      throw err
    }
  },

  async generateAiProductContent({ name, category, ingredients, weight, price, characteristics }) {
    try {
      const { data } = await api.post('/admin/products/ai-generate', {
        name, category, ingredients, weight, price, characteristics
      })
      return data.data
    } catch (err) {
      console.error('AI generate failed:', err)
      throw err
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
        userId: o.userId ?? null,                                       // for customer matching
        customer: o.userName || 'Guest',
        userEmail: o.userEmail || o.email || null,                      // for customer email matching
        date: o.createdAt ? o.createdAt.split('T')[0] : 'N/A',
        items: Array.isArray(o.items) ? o.items.length : (o.items ?? 0),
        total: o.finalAmount ?? o.totalAmount ?? 0,
        subtotal: o.totalAmount ?? o.finalAmount ?? 0,
        discountAmount: o.discountAmount ?? 0,
        couponCode: o.couponCode || null,
        payment: o.paymentStatus || o.paymentMethod || 'N/A',
        paymentMethod: o.paymentMethod || 'COD',
        status: o.status || 'PENDING',
        notificationStatus: o.notificationStatus || 'NOT_DISPATCHED',
        awbNumber: o.awbNumber || null,
        trackingUrl: o.trackingUrl || null,
        shippingAddress: o.shippingAddress || null,
        contactPhone: o.contactPhone || null,
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
  async getOrderNotifications(id) {
    try {
      const { data } = await api.get(`/admin/orders/${id}/notifications`)
      return data.data || []
    } catch (err) {
      console.error('Failed to get order notifications:', err)
      return []
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
          // Match orders by userId (preferred), customerEmail, or userEmail
          const userOrders = allOrders.filter(o =>
            (o.userId != null && o.userId === u.id) ||
            (o.customerId != null && o.customerId === u.id) ||
            (o.userEmail && o.userEmail === u.email) ||
            (o.customerEmail && o.customerEmail === u.email)
          )
          const spentTotal = userOrders.reduce((sum, o) => sum + (o.finalAmount ?? o.totalAmount ?? 0), 0)
          return {
            id: u.id,
            name: u.fullName || u.name || u.username || 'Unknown',
            email: u.email,
            phone: u.phone || u.phoneNumber || null,
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
      return (data.data?.content || []).map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stockQuantity ?? 0,
        unit: p.unit || 'kg',
        lowStockThreshold: p.lowStockThreshold || 10
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
      return (data.data || []).map(o => ({
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
      const offer = (offersData.data || []).find(o => o.id === id)
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
      const list = data.data?.content || data.data || []
      return list.map(r => ({
        id: r.id,
        product: r.productName || `Product #${r.productId}`,
        customer: r.userName || 'Customer',
        rating: r.rating || 5,
        comment: r.comment || '',
        approved: true
      }))
    } catch (err) {
      console.error('Failed to get reviews:', err)
      return []
    }
  },
  async moderateReview(id, approved) {
    try {
      if (!approved) {
        await api.delete(`/admin/reviews/${id}`)
      }
      return { id, approved }
    } catch (err) {
      console.error('Failed to moderate review:', err)
      throw err
    }
  },

  // Categories
  async getCategories() {
    try {
      const { data } = await api.get('/admin/categories')
      return data.data || []
    } catch (err) {
      console.error('Failed to get admin categories:', err)
      throw err
    }
  },
  async createCategory(payload) {
    try {
      const { data } = await api.post('/admin/categories', {
        name: payload.name.trim(),
        description: payload.description || '',
        imageUrl: payload.imageUrl || '',
        active: payload.active ?? true,
      })
      return data.data
    } catch (err) {
      console.error('Failed to create category:', err)
      throw err
    }
  },
  async deleteCategory(id) {
    try {
      await api.delete(`/admin/categories/${id}`)
      return true
    } catch (err) {
      console.error('Failed to delete category:', err)
      throw err
    }
  },

  // Coupons
  async getCoupons() {
    try {
      const { data } = await api.get('/admin/coupons')
      return (data.data || []).map(c => ({
        id: c.id,
        code: c.code,
        title: c.description || c.code,
        discount: c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `₹${c.discountValue}`,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderAmount: c.minOrderAmount,
        expires: c.validTo ? c.validTo.split('T')[0] : 'N/A',
        active: c.active,
        usedCount: c.usedCount || 0
      }))
    } catch (err) {
      console.error('Failed to get coupons:', err)
      throw err
    }
  },
  async createCoupon(payload) {
    try {
      const backendPayload = {
        code: payload.code.trim().toUpperCase(),
        description: payload.title || payload.description || payload.code,
        discountType: payload.discountType || (payload.discount?.includes('%') ? 'PERCENTAGE' : 'FLAT'),
        discountValue: Number(payload.discountValue ?? parseFloat(payload.discount) ?? 10),
        minOrderAmount: payload.minOrderAmount ? Number(payload.minOrderAmount) : null,
        maxDiscountAmount: payload.maxDiscountAmount ? Number(payload.maxDiscountAmount) : null,
        validFrom: new Date().toISOString(),
        validTo: payload.expires ? `${payload.expires}T23:59:59` : new Date(Date.now() + 30 * 86400000).toISOString(),
        usageLimit: payload.usageLimit ? Number(payload.usageLimit) : 100,
        active: payload.active ?? true,
      }
      const { data } = await api.post('/admin/coupons', backendPayload)
      return {
        id: data.data.id,
        code: data.data.code,
        title: data.data.description,
        discount: data.data.discountType === 'PERCENTAGE' ? `${data.data.discountValue}%` : `₹${data.data.discountValue}`,
        expires: data.data.validTo ? data.data.validTo.split('T')[0] : 'N/A',
        active: data.data.active
      }
    } catch (err) {
      console.error('Failed to create coupon:', err)
      throw err
    }
  },
  async deleteCoupon(id) {
    try {
      await api.delete(`/admin/coupons/${id}`)
      return true
    } catch (err) {
      console.error('Failed to delete coupon:', err)
      throw err
    }
  },
  async toggleCouponStatus(id) {
    try {
      const { data } = await api.patch(`/admin/coupons/${id}/toggle-status`)
      return data.data
    } catch (err) {
      console.error('Failed to toggle coupon status:', err)
      throw err
    }
  },

  // Analytics
  async getAnalyticsDashboard() {
    try {
      const { data } = await api.get('/admin/analytics/dashboard')
      return data.data || {}
    } catch (err) {
      console.error('Failed to get analytics dashboard:', err)
      throw err
    }
  },

  async getSalesReport(startDate, endDate) {
    try {
      const { data } = await api.get('/admin/analytics/sales-report', {
        params: { startDate, endDate }
      })
      return data.data || null
    } catch (err) {
      console.error('Failed to get sales report:', err)
      return null
    }
  },

  async getAnalytics() {
    try {
      const [productsRes, ordersRes, categoriesRes] = await Promise.allSettled([
        api.get('/admin/products'),
        api.get('/admin/orders'),
        api.get('/admin/categories'),
      ])

      const products = productsRes.status === 'fulfilled' ? (productsRes.value.data?.data?.content || []) : []
      const orders = ordersRes.status === 'fulfilled' ? (ordersRes.value.data?.data?.content || []) : []
      const categories = categoriesRes.status === 'fulfilled' ? (categoriesRes.value.data?.data || []) : []

      const topProducts = products
        .map(normalizeProduct)
        .filter(p => p.rating > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5)

      let categoryBreakdown = []
      if (categories.length > 0) {
        categoryBreakdown = categories.map(c => {
          const count = products.filter(p => p.categoryId === c.id || p.categoryName === c.name || p.category === c.name).length
          return { name: c.name, value: count }
        }).filter(c => c.value > 0)
      }

      if (categoryBreakdown.length === 0) {
        categoryBreakdown = [
          { name: 'Milk Sweets', value: 34 },
          { name: 'Dry Fruit Sweets', value: 26 },
          { name: 'Bengali Sweets', value: 18 },
          { name: 'Savouries', value: 12 },
          { name: 'Festival Hampers', value: 10 },
        ]
      }

      let salesTrend = SALES_TREND
      if (orders.length > 0) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const monthlyTotals = {}
        orders.forEach(o => {
          if (o.createdAt) {
            const date = new Date(o.createdAt)
            const monthKey = monthNames[date.getMonth()]
            const amt = o.finalAmount ?? o.totalAmount ?? 0
            monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + amt
          }
        })
        const computed = Object.entries(monthlyTotals).map(([month, sales]) => ({ month, sales: Math.round(sales) }))
        if (computed.length >= 2) {
          salesTrend = computed
        }
      }

      return {
        salesTrend,
        topProducts,
        categoryBreakdown,
      }
    } catch (err) {
      console.error('Failed to get analytics:', err)
      throw err
    }
  },

  // ── Subscriptions & VIP Memberships ─────────────────────────────────────────
  async getSubscriptions(params = {}) {
    try {
      const { data } = await api.get('/admin/subscriptions', { params })
      return data.data
    } catch (err) {
      console.error('Failed to get subscriptions:', err)
      throw err
    }
  },

  async getSubscriptionStats() {
    try {
      const { data } = await api.get('/admin/subscriptions/stats')
      return data.data
    } catch (err) {
      console.error('Failed to get subscription stats:', err)
      throw err
    }
  },

  async updateSubscriptionStatus(id, status) {
    try {
      const { data } = await api.patch(`/admin/subscriptions/${id}/status`, null, {
        params: { status }
      })
      return data.data
    } catch (err) {
      console.error('Failed to update subscription status:', err)
      throw err
    }
  },

  async extendSubscription(id, days = 30) {
    try {
      const { data } = await api.patch(`/admin/subscriptions/${id}/extend`, null, {
        params: { days }
      })
      return data.data
    } catch (err) {
      console.error('Failed to extend subscription:', err)
      throw err
    }
  },

  async grantSubscription(payload) {
    try {
      const { data } = await api.post('/admin/subscriptions/grant', payload)
      return data.data
    } catch (err) {
      console.error('Failed to grant subscription:', err)
      throw err
    }
  },

  async deleteSubscription(id) {
    try {
      const { data } = await api.delete(`/admin/subscriptions/${id}`)
      return data.data
    } catch (err) {
      console.error('Failed to delete subscription:', err)
      throw err
    }
  },
}

