import api from './api'
import { resolveImageUrl } from '../utils/media'

// Normalize a product object from the backend so that all UI components
// can use consistent field names (image, stock, rating, bestseller, category).
export function normalizeProduct(p) {
  return {
    ...p,
    image: resolveImageUrl(p.image || p.imageUrl),
    stock: p.stock ?? p.stockQuantity ?? 0,
    rating: p.rating ?? p.avgRating ?? p.averageRating ?? 4.8,
    bestseller: p.bestseller ?? p.isBestseller ?? (p.id <= 4),
    category: p.category || p.categoryName || '',
  }
}

export const productService = {
  async getAll(params = {}) {
    try {
      // If a category name is passed, look up its ID and use /products/category/{id}
      if (params.category) {
        const { data: catData } = await api.get('/categories')
        const catList = catData.data || []
        const found = catList.find(
          (c) => c.name.toLowerCase() === params.category.toLowerCase()
        )
        if (found) {
          const { data } = await api.get(`/products/category/${found.id}`, { params: { size: 200, page: 0 } })
          return (data.data.content || []).map(normalizeProduct)
        }
      }
      // If a search keyword is provided use the /products/search endpoint
      if (params.search) {
        const { data } = await api.get('/products/search', { params: { keyword: params.search, size: 200, page: 0 } })
        return (data.data.content || []).map(normalizeProduct)
      }
      // Default: get all products — request a large page so none are hidden by pagination
      const { data } = await api.get('/products', { params: { size: 200, page: 0 } })
      return (data.data.content || []).map(normalizeProduct)
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/products/${id}`)
      return normalizeProduct(data.data)
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  async getCategories() {
    try {
      const { data } = await api.get('/categories')
      // Return only the category names (strings) so the Products page can render them directly
      return (data.data || []).map((c) => c.name)
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  async getReviews(productId) {
    try {
      const { data } = await api.get(`/reviews/product/${productId}`)
      return (data.data?.content || []).map(r => ({
        id: r.id,
        customer: r.customerName || r.userName || 'Valued Customer',
        rating: r.rating,
        comment: r.comment,
        verified: r.verifiedPurchase ?? true,
        date: r.createdAt ? r.createdAt.split('T')[0] : 'N/A'
      }))
    } catch (err) {
      if (err.response) throw err
      return []
    }
  },

  async submitReview(productId, payload) {
    try {
      const { data } = await api.post('/reviews', {
        productId: Number(productId),
        rating: payload.rating,
        comment: payload.comment
      })
      const r = data.data || {}
      return {
        id: r.id,
        customer: r.customerName || r.userName || payload.customer || 'Valued Customer',
        rating: r.rating,
        comment: r.comment,
        verified: r.verifiedPurchase ?? true,
        date: r.createdAt ? r.createdAt.split('T')[0] : new Date().toISOString().slice(0, 10)
      }
    } catch (err) {
      if (err.response) throw err
      return { ...payload, id: Date.now() }
    }
  },

  async getRelated(productId, limit = 4) {
    try {
      const { data } = await api.get(`/products/${productId}/related`, { params: { limit } })
      return (data.data || []).map(normalizeProduct)
    } catch {
      // Fallback if backend endpoint is unavailable
      const all = await this.getAll()
      return all.filter((p) => String(p.id) !== String(productId)).slice(0, limit)
    }
  },
}

