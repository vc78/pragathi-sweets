import api from './api'

// All calls hit the Spring Boot backend (AuthController). During local
// frontend-only development (backend not running), calls fail and we fall
// back to a mock login so the UI remains fully clickable end to end.

function mockLogin(email, isAdmin = false) {
  return {
    token: 'mock-jwt-token',
    user: {
      id: 1,
      name: isAdmin ? 'Admin' : email.split('@')[0],
      email,
      role: isAdmin ? 'ADMIN' : 'CUSTOMER',
    },
  }
}

export const authService = {
  async login(credentials) {
    try {
      const { data } = await api.post('/auth/login', credentials)
      return {
        token: data.data.accessToken,
        user: {
          id: data.data.userId,
          name: data.data.fullName,
          email: data.data.email,
          role: data.data.role === 'ROLE_ADMIN' ? 'ADMIN' : 'CUSTOMER'
        }
      }
    } catch (err) {
      if (err.response) throw err
      console.warn('authService.login: backend unavailable, using mock session')
      return mockLogin(credentials.email)
    }
  },

  async adminLogin(credentials) {
    try {
      const { data } = await api.post('/auth/login', credentials)
      if (data.data.role !== 'ROLE_ADMIN') {
        throw new Error('Not authorized as admin')
      }
      return {
        token: data.data.accessToken,
        user: {
          id: data.data.userId,
          name: data.data.fullName,
          email: data.data.email,
          role: 'ADMIN'
        }
      }
    } catch (err) {
      if (err.response || err.message === 'Not authorized as admin') throw err
      console.warn('authService.adminLogin: backend unavailable, using mock session')
      return mockLogin(credentials.email, true)
    }
  },

  async register(payload) {
    try {
      const backendPayload = {
        fullName: payload.name,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
        address: payload.address
      }
      await api.post('/auth/register', backendPayload)
      
      // Auto login after registration
      const { data } = await api.post('/auth/login', {
        email: payload.email,
        password: payload.password
      })
      
      return {
        token: data.data.accessToken,
        user: {
          id: data.data.userId,
          name: data.data.fullName,
          email: data.data.email,
          role: data.data.role === 'ROLE_ADMIN' ? 'ADMIN' : 'CUSTOMER'
        }
      }
    } catch (err) {
      if (err.response) throw err
      console.warn('authService.register: backend unavailable, using mock session')
      return mockLogin(payload.email)
    }
  },

  async updateProfile(payload) {
    try {
      const { data } = await api.put('/users/profile', payload)
      return {
        id: data.data.id,
        name: data.data.fullName,
        email: data.data.email,
        phone: data.data.phone,
        address: data.data.address,
        role: data.data.role === 'ROLE_ADMIN' ? 'ADMIN' : 'CUSTOMER'
      }
    } catch (err) {
      if (err.response) throw err
      return payload
    }
  },
}
