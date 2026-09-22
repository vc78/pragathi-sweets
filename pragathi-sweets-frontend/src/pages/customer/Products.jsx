import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Search, Grid, List, SlidersHorizontal, ChevronRight, X, Star, Sparkles, Award } from 'lucide-react'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import SweetCard from '../../components/customer/SweetCard'
import { productService } from '../../services/productService'
import { useCart } from '../../hooks/useCart'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCardSkeleton } from '../../components/common/SkeletonLoaders'
import ReliableImage from '../../components/common/ReliableImage'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlSearch = searchParams.get('search') || ''
  const urlCategory = searchParams.get('category') || 'All'

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(urlCategory)
  const [search, setSearch] = useState(urlSearch)
  const [priceRange, setPriceRange] = useState(2000)
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [loading, setLoading] = useState(true)
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)

  const { addToCart } = useCart()

  // Sync category & search query from URL parameters
  useEffect(() => {
    setSearch(urlSearch)
  }, [urlSearch])

  useEffect(() => {
    setActiveCategory(urlCategory)
  }, [urlCategory])

  useEffect(() => {
    productService.getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    productService
      .getAll({ category: activeCategory === 'All' ? undefined : activeCategory, search: search || undefined })
      .then((list) => {
        // Filter by price client-side for immediate responsive experience
        let filtered = list.filter((p) => p.price <= priceRange)
        
        // Apply sorting
        if (sortBy === 'price-low') {
          filtered.sort((a, b) => a.price - b.price)
        } else if (sortBy === 'price-high') {
          filtered.sort((a, b) => b.price - a.price)
        } else if (sortBy === 'rating') {
          filtered.sort((a, b) => b.rating - a.rating)
        }
        
        setProducts(filtered)
      })
      .finally(() => setLoading(false))
  }, [activeCategory, search, priceRange, sortBy])

  const handleAdd = (product) => {
    addToCart(product)
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
    })
  }

  const clearFilters = () => {
    setActiveCategory('All')
    setSearch('')
    setPriceRange(2000)
    setSortBy('popular')
    setSearchParams({})
  }

  return (
    <div className="relative min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />

      {/* Hero Banner Header */}
      <section className="bg-[#8B0000] text-white pt-24 pb-16 px-6 md:px-12 relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-black/20 z-0" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#B8860B]/20 filter blur-[90px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[10px] tracking-[0.3em] text-amber-200 font-bold uppercase mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-white/50">Collection</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl text-white font-bold leading-tight">
            Our Sweet <span className="italic font-normal text-amber-200">Boutique</span>
          </h1>
          <p className="text-xs text-white/70 mt-3 max-w-md leading-relaxed tracking-wide">
            Hand-rolled cashew sweets, saffron-simmered syrups, and premium festive hampers packaged to tell a generations-old story.
          </p>
        </div>
      </section>

      {/* Main Listing Area */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* 1. FILTER SIDEBAR (Desktop) */}
          <aside className="hidden lg:col-span-3 lg:block space-y-8 select-none">
            <div className="flex items-center justify-between border-b border-[#B8860B]/20 pb-4">
              <span className="font-display text-base tracking-wider text-[#8B0000] font-bold uppercase flex items-center gap-2">
                <SlidersHorizontal size={15} /> Filters
              </span>
              {(activeCategory !== 'All' || search || priceRange !== 2000) && (
                <button onClick={clearFilters} className="text-[10px] tracking-wider text-[#B8860B] hover:text-[#8B0000] font-bold uppercase transition-colors">
                  Reset All
                </button>
              )}
            </div>

            {/* Category Selector */}
            <div className="space-y-4">
              <h4 className="font-display text-sm tracking-widest text-[#8B0000] font-bold uppercase">Collections</h4>
              <div className="flex flex-col gap-1.5">
                {['All', ...categories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat)
                      setSearchParams(cat === 'All' ? {} : { category: cat })
                    }}
                    className={`text-left text-xs tracking-wider py-2.5 px-4 rounded-xl transition-all ${
                      activeCategory === cat
                        ? 'bg-[#8B0000] text-[#FFFDF8] font-bold shadow-md shadow-red-950/10'
                        : 'text-[#3A2D23]/70 hover:text-[#8B0000] hover:bg-[#F5E6C8]/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-display text-sm tracking-widest text-[#8B0000] font-bold uppercase">Max Price</h4>
                <span className="font-display text-sm text-[#B8860B] font-bold">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min={200}
                max={2000}
                step={50}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#8B0000]"
              />
              <div className="flex justify-between text-[10px] text-[#3A2D23]/40 font-body">
                <span>₹200</span>
                <span>₹2000</span>
              </div>
            </div>

            {/* Quality Guarantee badge */}
            <div className="border border-[#B8860B]/15 rounded-2xl p-6 bg-white shadow-sm select-none">
              <span className="text-[9px] text-[#B8860B] font-bold uppercase tracking-widest block">Boutique Promise</span>
              <h5 className="font-display text-sm text-[#8B0000] mt-2 font-bold flex items-center gap-1.5">
                <Award size={14} className="text-[#B8860B]" /> Guaranteed Freshness
              </h5>
              <p className="text-[10px] text-[#3A2D23]/60 leading-relaxed mt-2">
                All order batches are vacuum packed within 1 hour of preparation and shipped in insulated boxes.
              </p>
            </div>
          </aside>

          {/* 2. PRODUCT GRID CONTAINER */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Header controls toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B8860B]/10 pb-6 select-none">
              
              {/* Search Bar */}
              <div className="relative w-full sm:max-w-xs">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A2D23]/40" />
                <input
                  type="text"
                  placeholder="SEARCH SELECTION..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#B8860B]/20 bg-white text-xs tracking-wider placeholder-[#3A2D23]/30 focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] transition-all"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3A2D23]/40 hover:text-[#8B0000]">
                    <X size={12} />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                
                {/* Sort selection */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-widest text-[#3A2D23]/40 uppercase font-bold">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs tracking-wider text-[#3A2D23]/80 focus:outline-none uppercase border-b border-[#B8860B]/20 pb-0.5"
                  >
                    <option value="popular">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                {/* Grid View toggle controls */}
                <div className="flex items-center gap-1.5 border border-[#B8860B]/15 rounded-xl p-1 bg-white">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#8B0000] text-white shadow-sm' : 'text-[#3A2D23]/50 hover:text-[#8B0000]'}`}
                    title="Grid View"
                  >
                    <Grid size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#8B0000] text-white shadow-sm' : 'text-[#3A2D23]/50 hover:text-[#8B0000]'}`}
                    title="List View"
                  >
                    <List size={14} />
                  </button>
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFiltersMobile(true)}
                  className="lg:hidden flex items-center gap-1.5 border border-[#B8860B]/20 bg-white rounded-xl px-3 py-2 text-xs text-[#3A2D23]/80 hover:border-[#8B0000]"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>
              </div>

            </div>

            {/* Active filters summary */}
            {(activeCategory !== 'All' || search || priceRange !== 2000) && (
              <div className="flex items-center gap-2 flex-wrap select-none">
                <span className="text-[10px] text-[#3A2D23]/40 font-bold uppercase">Active:</span>
                {activeCategory !== 'All' && (
                  <span className="text-[10px] bg-[#8B0000]/5 text-[#8B0000] px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#B8860B]/10 font-bold">
                    {activeCategory}
                    <button onClick={() => { setActiveCategory('All'); setSearchParams({}) }}><X size={10} /></button>
                  </span>
                )}
                {search && (
                  <span className="text-[10px] bg-[#8B0000]/5 text-[#8B0000] px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#B8860B]/10 font-bold">
                    Query: {search}
                    <button onClick={() => setSearch('')}><X size={10} /></button>
                  </span>
                )}
                {priceRange !== 2000 && (
                  <span className="text-[10px] bg-[#8B0000]/5 text-[#8B0000] px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#B8860B]/10 font-bold">
                    Under ₹{priceRange}
                    <button onClick={() => setPriceRange(2000)}><X size={10} /></button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-[#B8860B]/20 rounded-3xl bg-white select-none shadow-sm">
                <p className="font-display text-lg italic text-[#8B0000] font-bold">No Confections Found</p>
                <p className="text-xs text-[#3A2D23]/50 mt-2">Adjust your filters or try a different search keyword.</p>
                <button onClick={clearFilters} className="btn-primary mt-6">
                  Show All Confections
                </button>
              </div>
            ) : (
              /* GRID OR LIST VIEW RENDERING */
              <motion.div
                layout
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                    : 'space-y-6'
                }
              >
                {products.map((product) => {
                  if (viewMode === 'grid') {
                    return <SweetCard key={product.id} product={product} onAdd={() => handleAdd(product)} />
                  } else {
                    /* Custom Luxury List Item Card */
                    return (
                      <motion.div
                        layout
                        key={product.id}
                        className="bg-white border border-[#B8860B]/10 hover:border-[#B8860B]/30 rounded-3xl p-5 flex flex-col sm:flex-row gap-6 hover:shadow-[0_16px_48px_rgba(184,134,11,0.08)] transition-all duration-400 relative group"
                      >
                        {product.bestseller && (
                          <span className="absolute top-4 left-4 z-10 bg-[#8B0000] text-white text-[7px] font-bold uppercase tracking-[0.25em] px-2.5 py-1 rounded-full shadow-md">
                            ★ Bestseller
                          </span>
                        )}

                        <div className="w-full sm:w-44 h-32 rounded-2xl overflow-hidden shrink-0 bg-[#F5E6C8]/40 border border-[#B8860B]/10">
                          <Link to={`/products/${product.id}`} className="block h-full">
                            <ReliableImage
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                          </Link>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <span className="text-[9px] uppercase tracking-[0.25em] text-[#B8860B] font-bold">
                                  {product.category}
                                </span>
                                <Link to={`/products/${product.id}`}>
                                  <h3 className="font-display text-base md:text-lg text-[#8B0000] font-bold mt-1 hover:text-[#B8860B] transition-colors leading-snug">
                                    {product.name}
                                  </h3>
                                </Link>
                              </div>
                              <p className="font-display text-lg font-bold text-[#8B0000] shrink-0 text-right">
                                ₹{product.price}
                                <span className="text-[10px] text-[#3A2D23]/40 font-body font-normal block"> / {product.unit}</span>
                              </p>
                            </div>
                            {product.description && (
                              <p className="text-xs text-[#3A2D23]/60 leading-relaxed mt-2 max-w-xl">
                                {product.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-[#B8860B]/10">
                            <div className="flex items-center gap-1 mt-1">
                              <Star size={11} fill="#B8860B" className="text-[#B8860B]" />
                              <span className="text-[10px] text-[#3A2D23]/50 font-bold">{product.rating} Rating</span>
                            </div>
                            
                            <div className="flex gap-3">
                              <Link
                                to={`/products/${product.id}`}
                                className="btn-outline !py-2 !px-4 text-[10px] flex items-center justify-center font-bold tracking-widest"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => handleAdd(product)}
                                className="btn-primary !py-2 !px-4 text-[10px] flex items-center justify-center font-bold tracking-widest"
                              >
                                Add to box
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  }
                })}
              </motion.div>
            )}
          </div>

        </div>
      </section>

      {/* MOBILE FILTERS DRAWER */}
      <AnimatePresence>
        {showFiltersMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersMobile(false)}
              className="fixed inset-0 z-50 bg-black lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-[#FFFDF8] p-6 flex flex-col justify-between lg:hidden shadow-luxury"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-[#B8860B]/15 pb-4">
                  <span className="font-display text-lg tracking-wider text-[#8B0000] font-bold uppercase">Filters</span>
                  <button onClick={() => setShowFiltersMobile(false)} className="p-1"><X size={18} /></button>
                </div>

                {/* Mobile Categories */}
                <div className="space-y-3">
                  <h4 className="font-display text-sm tracking-widest text-[#8B0000] font-bold uppercase">Collections</h4>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...categories].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat)
                          setSearchParams(cat === 'All' ? {} : { category: cat })
                          setShowFiltersMobile(false)
                        }}
                        className={`text-xs tracking-wider px-3.5 py-1.5 rounded-full border transition-all ${
                          activeCategory === cat ? 'bg-[#8B0000] text-[#FFFDF8] border-[#8B0000] font-bold' : 'border-[#B8860B]/20 text-[#3A2D23]/80'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Price */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h4 className="font-display text-sm tracking-widest text-[#8B0000] font-bold uppercase">Max Price</h4>
                    <span className="font-display text-sm text-[#B8860B] font-bold">₹{priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={2000}
                    step={50}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#8B0000]"
                  />
                </div>
              </div>

              <button onClick={() => setShowFiltersMobile(false)} className="btn-primary w-full text-center py-3">
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
