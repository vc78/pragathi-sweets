import { createSlice } from '@reduxjs/toolkit'

const storedUser = JSON.parse(localStorage.getItem('ps_user') || 'null')
const storedToken = localStorage.getItem('ps_token') || null

const initialState = {
  user: storedUser,       // { id, name, email, role: 'CUSTOMER' | 'ADMIN' }
  token: storedToken,
  isAuthenticated: !!storedToken,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    credentialsReceived: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem('ps_user', JSON.stringify(user))
      localStorage.setItem('ps_token', token)
    },
    loggedOut: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('ps_user')
      localStorage.removeItem('ps_token')
    },
    profileUpdated: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('ps_user', JSON.stringify(state.user))
    },
  },
})

export const { credentialsReceived, loggedOut, profileUpdated } = authSlice.actions
export default authSlice.reducer
