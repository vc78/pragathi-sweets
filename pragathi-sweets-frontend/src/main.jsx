import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './store'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" toastOptions={{
          style: { background: '#5C1A2B', color: '#FBF3E7', fontFamily: 'Inter, sans-serif' },
        }} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
