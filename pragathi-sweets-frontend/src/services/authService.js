import api from './api'

// All calls hit the Spring Boot backend (AuthController) for real-time authentication.

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
      console.error(err)
      throw err
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
      console.error(err)
      throw err
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
      console.error(err)
      throw err
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
      console.error(err)
      throw err
    }
  },

  async sendEmailOtp(newEmail) {
    try {
      const { data } = await api.post('/users/email/send-otp', { newEmail })
      return data
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  async verifyEmailOtp(newEmail, otp) {
    try {
      const { data } = await api.post('/users/email/verify-otp', { newEmail, otp })
      return {
        id: data.data.id,
        name: data.data.fullName,
        email: data.data.email,
        phone: data.data.phone,
        address: data.data.address,
        role: data.data.role === 'ROLE_ADMIN' ? 'ADMIN' : 'CUSTOMER'
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  async sendPhoneOtp(newPhone) {
    try {
      const { data } = await api.post('/users/phone/send-otp', { newPhone })
      return data
    } catch (err) {
      console.error(err)
      throw err
    }
  },

  async verifyPhoneOtp(newPhone, otp) {
    try {
      const { data } = await api.post('/users/phone/verify-otp', { newPhone, otp })
      return {
        id: data.data.id,
        name: data.data.fullName,
        email: data.data.email,
        phone: data.data.phone,
        address: data.data.address,
        role: data.data.role === 'ROLE_ADMIN' ? 'ADMIN' : 'CUSTOMER'
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  },
}
