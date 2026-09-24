import { Link } from 'react-router-dom'
import { Star, Plus, Eye, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import ReliableImage from '../common/ReliableImage'

export default function SweetCard({ product, onAdd, onAddToCart }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [adding, setAdding] = useState(false)

  if (!product) return null

  const categoryName = typeof product.category === 'object'
    ? (product.category?.name || '')
    : (product.category || product.categoryName || '')
  const ratingVal = product.rating ?? product.avgRating ?? 4.8
  const unitVal = product.unit || 'box'
  const imgUrl = product.image || product.imageUrl
  const isBestseller = product.bestseller ?? product.isBestseller ?? false

  const handleAdd = () => {
    const fn = onAdd || onAddToCart
    if (!fn) return
    setAdding(true)
    fn(product)
    setTimeout(() => setAdding(false), 800)
  }

  return (
    <div className="bg-white border border-[#B8860B]/10 rounded-2xl overflow-hidden group hover:border-[#B8860B]/30 hover:shadow-[0_16px_48px_rgba(184,134,11,0.12)] transition-all duration-400 flex flex-col h-full">

      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-[#F5E6C8]/40">
        {/* Badges */}
        {isBestseller && (
          <span className="absolute top-3 left-3 z-10 bg-[#8B0000] text-white text-[7px] font-bold uppercase tracking-[0.25em] px-2.5 py-1 rounded-full shadow-md">
            ★ Bestseller
          </span>
        )}
        <button
          onClick={e => { e.preventDefault(); setIsFavorite(v => !v) }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white shadow-sm"
          aria-label="Favourite"
        >
          <Heart size={13} fill={isFavorite ? '#8B0000' : 'none'} className={isFavorite ? 'text-[#8B0000]' : 'text-[#3A2D23]/50'} />
        </button>

        {/* Photo */}
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <ReliableImage
            src={imgUrl}
            alt={product.name}
            className="w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/products/${product.id}`}
            className="w-10 h-10 rounded-full bg-white text-[#8B0000] flex items-center justify-center hover:bg-[#8B0000] hover:text-white transition-all shadow-md translate-y-5 group-hover:translate-y-0 duration-400"
            title="View Details"
          >
            <Eye size={15} />
          </Link>
          <button
            onClick={handleAdd}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md translate-y-5 group-hover:translate-y-0 duration-400 delay-75 ${
              adding ? 'bg-green-600 text-white scale-110' : 'bg-[#B8860B] text-white hover:bg-[#8B0000]'
            }`}
            title="Add to Cart"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
        <div>
          {categoryName && (
            <p className="font-body text-[9px] uppercase tracking-[0.3em] text-[#B8860B] font-bold mb-1.5">
              {categoryName}
            </p>
          )}
          <Link to={`/products/${product.id}`}>
            <h3 className="font-display text-sm md:text-base text-[#8B0000] font-bold hover:text-[#B8860B] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 mt-2">
            <Star size={11} fill="#B8860B" className="text-[#B8860B]" />
            <span className="font-body text-[10px] text-[#3A2D23]/50">
              {ratingVal} {categoryName ? `· ${categoryName}` : ''}
            </span>
          </div>
          {product.description && (
            <p className="text-[11px] text-[#3A2D23]/55 mt-2 line-clamp-2 leading-relaxed font-body">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-[#B8860B]/10">
          <div>
            <span className="font-display text-base md:text-lg font-bold text-[#8B0000]">₹{product.price}</span>
            <span className="text-[10px] text-[#3A2D23]/40 font-body ml-1">/{unitVal}</span>
          </div>
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center gap-1.5 font-body text-[10px] tracking-widest font-bold uppercase transition-all px-3 py-1.5 rounded-full border ${
              adding
                ? 'bg-green-600 text-white border-green-600'
                : 'text-[#8B0000] border-[#8B0000]/30 hover:bg-[#8B0000] hover:text-white hover:border-[#8B0000]'
            }`}
          >
            {adding ? '✓ Added' : <><Plus size={10} /> Add</>}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
