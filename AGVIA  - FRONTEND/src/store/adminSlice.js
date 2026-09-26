import { createSlice } from '@reduxjs/toolkit'

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    orders: [],
    loading: false,
  },
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload
    },
    setOrders: (state, action) => {
      state.orders = action.payload
    }
  }
})

export const { setStats, setOrders } = adminSlice.actions
export default adminSlice.reducer
