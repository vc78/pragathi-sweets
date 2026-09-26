import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import productsReducer from './productsSlice'
import cartReducer from './cartSlice'
import wishlistReducer from './wishlistSlice'
import ordersReducer from './ordersSlice'
import adminReducer from './adminSlice'
import notificationsReducer from './notificationsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: ordersReducer,
    admin: adminReducer,
    notifications: notificationsReducer,
  },
})
