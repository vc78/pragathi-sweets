import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem('ps_cart') || '[]'),
  },
  reducers: {
    syncCart: (state) => {
      state.items = JSON.parse(localStorage.getItem('ps_cart') || '[]')
    }
  }
})

export const { syncCart } = cartSlice.actions
export default cartSlice.reducer
