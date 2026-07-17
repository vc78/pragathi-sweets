import { useState } from 'react'
import AppRoutes from './routes/AppRoutes'
import LoadingScreen from './components/customer/LoadingScreen'

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      <LoadingScreen onComplete={() => setLoading(false)} />
      {!loading && <AppRoutes />}
    </>
  )
}
