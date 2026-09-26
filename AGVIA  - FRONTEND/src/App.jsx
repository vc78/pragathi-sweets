import React from 'react'
import AppRoutes from './routes/AppRoutes'
import LoadingScreen from './components/customer/LoadingScreen'

export default function App() {
  return (
    <>
      <LoadingScreen />
      <AppRoutes />
    </>
  )
}
