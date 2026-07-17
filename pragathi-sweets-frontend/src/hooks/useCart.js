import { useCallback, useEffect, useState } from 'react'

// Lightweight cart persisted to localStorage. Kept outside Redux (only auth
// is modeled in the store, per the app's state slice) but exposed as a hook
// so any page/component can read and mutate the cart consistently.

const CART_KEY = 'ps_cart'

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch {
    return []
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('ps-cart-updated'))
}

export function useCart() {
  const [items, setItems] = useState(readCart())

  useEffect(() => {
    const sync = () => setItems(readCart())
    window.addEventListener('ps-cart-updated', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('ps-cart-updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const addToCart = useCallback((product, qty = 1) => {
    const current = readCart()
    const idx = current.findIndex((i) => i.id === product.id)
    if (idx >= 0) {
      current[idx].qty += qty
    } else {
      current.push({ id: product.id, name: product.name, price: product.price, unit: product.unit, image: product.image, qty })
    }
    writeCart(current)
  }, [])

  const updateQty = useCallback((id, qty) => {
    const current = readCart()
    const idx = current.findIndex((i) => i.id === id)
    if (idx >= 0) {
      if (qty <= 0) current.splice(idx, 1)
      else current[idx].qty = qty
    }
    writeCart(current)
  }, [])

  const removeFromCart = useCallback((id) => {
    writeCart(readCart().filter((i) => i.id !== id))
  }, [])

  const clearCart = useCallback(() => writeCart([]), [])

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return { items, addToCart, updateQty, removeFromCart, clearCart, subtotal, count }
}
