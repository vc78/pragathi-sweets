import { useState, useEffect } from 'react'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import SweetCard from '../../components/customer/SweetCard'
import { productService } from '../../services/productService'
import { useCart } from '../../hooks/useCart'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Wishlist() {
  const [items, setItems] = useState([])
  const { addToCart } = useCart()

  useEffect(() => {
    productService.getAll().then((list) => {
      // Mock some items in wishlist
      setItems(list.slice(0, 2))
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-24">
        <h1 className="font-display text-3xl md:text-5xl text-[#8B0000] font-bold mb-10 select-none">
          Your Wishlist
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#B8860B]/20 rounded-3xl bg-white select-none shadow-sm">
            <Heart size={40} className="text-[#B8860B]/30 mx-auto mb-4" />
            <p className="font-display text-lg italic text-[#8B0000] font-bold">Your wishlist is empty.</p>
            <p className="text-xs text-[#3A2D23]/50 mt-2 mb-8">Save your favorite confections for later.</p>
            <Link to="/products" className="btn-primary">Browse Boutique</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((p) => (
              <SweetCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
