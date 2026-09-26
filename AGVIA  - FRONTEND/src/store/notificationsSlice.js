import { createSlice } from '@reduxjs/toolkit'

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
  },
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload)
    }
  }
})

export const { setNotifications, addNotification } = notificationsSlice.actions
export default notificationsSlice.reducer
