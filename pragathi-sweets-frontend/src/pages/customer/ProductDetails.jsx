import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Star, Minus, Plus, ArrowLeft, ShieldCheck, Heart, Truck, HelpCircle, ChevronDown } from 'lucide-react'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import SweetCard from '../../components/customer/SweetCard'
import { productService } from '../../services/productService'
import { useCart } from '../../hooks/useCart'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [reviews, setReviews] = useState([])
  const [related, setRelated] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const { addToCart } = useCart()

  // Review submission state
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)

  // Accordion details mapping
  const [accordionOpen, setAccordionOpen] = useState({ ingredients: true, nutrition: false, shipping: false })

  useEffect(() => {
    window.scrollTo(0, 0)
    productService.getById(id).then((prod) => {
      setProduct(prod)
      if (prod) {
        productService.getAll().then((list) => {
          setRelated(list.filter((p) => p.category === prod.category && String(p.id) !== String(id)).slice(0, 4))
        })
      }
    })
    productService.getReviews(id).then(setReviews)
  }, [id])

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between font-body">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 select-none">
          <div className="w-12 h-12 border-2 border-[#B8860B] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-display text-sm italic text-[#B8860B]/80 font-bold">Loading heritage recipe details...</p>
        </div>
        <Footer />
      </div>
    )
  }

  const handleAdd = () => {
    addToCart(product, qty)
    toast.success(`${qty} × ${product.name} added to cart!`, {
      style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
    })
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) {
      toast.error('Please write a comment.')
      return
    }
    setSubmitting(true)
    try {
      const saved = await productService.submitReview(id, {
        customer: 'Customer Guest',
        rating: newRating,
        comment: newComment,
        date: new Date().toISOString().slice(0, 10),
      })
      setReviews([saved, ...reviews])
      setNewComment('')
      toast.success('Thank you for sharing your experience!')
    } catch {
      toast.error('Could not submit review.')
    } finally {
      setSubmitting(false)
    }
  }

  // Mock luxury recipe details
  const detailsMock = {
    ingredients: 'Premium organic cashews (70%), cold-pressed pure cow ghee, sulfur-free refined cane sugar, edible organic silver leaves (varq), green cardamom essence.',
    nutrition: 'Serving size: 50g. Energy: 240 kcal | Protein: 5g | Carbohydrates: 28g | Total Fat: 12g (Saturated Fat: 4g) | Dietary Fiber: 1g | Sodium: 10mg.',
    shipping: 'Prepared fresh every morning. Insulated box delivery across Hyderabad within 4-6 hours. Ships with ice-chilled gel packs to preserve texture and consistency.',
  }

  const toggleAccordion = (tab) => {
    setAccordionOpen({ ...accordionOpen, [tab]: !accordionOpen[tab] })
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#3A2D23] font-body">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-12 pb-16">
        
        {/* Navigation Breadcrumb */}
        <Link to="/products" className="flex items-center gap-1.5 text-[#B8860B] hover:text-[#8B0000] text-[10px] tracking-[0.25em] font-bold uppercase mb-10 w-fit transition-colors">
          <ArrowLeft size={12} /> Back to Boutique Collection
        </Link>

        {/* Product Details Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Premium Zoom Image Gallery */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-[#B8860B]/15 shadow-md bg-[#F5E6C8]/25 relative group">
              <img
                src={product.image || '/images/pexels-gaurav-kumar-1281378-18488298.jpg'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => { e.target.src = '/images/pexels-gaurav-kumar-1281378-18488298.jpg' }}
              />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#3A2D23] hover:text-red-700 transition-colors shadow-sm"
              >
                <Heart size={16} fill={isFavorite ? '#8B0000' : 'none'} className={isFavorite ? 'text-[#8B0000]' : ''} />
              </button>
            </div>
            
            <div className="flex gap-4 mt-6">
              {[product.image || '/images/pexels-gaurav-kumar-1281378-18488298.jpg', product.image || '/images/pexels-gaurav-kumar-1281378-18488298.jpg'].map((img, idx) => (
                <div key={idx} className="w-24 h-16 rounded-2xl overflow-hidden border-2 border-[#B8860B]/20 relative cursor-pointer hover:border-[#B8860B] transition-all bg-[#F5E6C8]/40">
                  <img
                    src={img}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/pexels-gaurav-kumar-1281378-18488298.jpg' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Sweet Descriptions & Purchase */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-[9px] text-[#B8860B] font-bold tracking-[0.3em] uppercase block">
                {product.category}
              </span>
              <h1 className="font-display text-3xl md:text-5xl text-[#8B0000] mt-2 font-bold leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mt-4 text-xs text-[#B8860B]">
                <div className="flex text-[#B8860B]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill={i < Math.round(product.rating) ? '#B8860B' : 'none'} className="text-[#B8860B]" />
                  ))}
                </div>
                <span className="text-[#3A2D23]/50 font-bold">({product.rating} / 5 based on {reviews.length} experiences)</span>
              </div>

              <p className="text-xs leading-relaxed text-[#3A2D23]/70 mt-6 tracking-wide">
                {product.description}
              </p>

              <div className="flex items-baseline gap-4 mt-8 pb-6 border-b border-[#B8860B]/10">
                <span className="font-display text-3xl md:text-4xl text-[#8B0000] font-bold">₹{product.price}</span>
                <span className="text-xs text-[#3A2D23]/40">per {product.unit} box</span>
                <span className="ml-auto text-[9px] bg-green-50 text-green-700 border border-green-200/50 px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                  {product.stock > 10 ? 'In Stock' : 'Limited Batch Available'}
                </span>
              </div>
            </div>

            {/* Qty & Add to Box */}
            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[9px] tracking-widest uppercase text-[#B8860B] font-bold block mb-2">Select Quantity</span>
                  <div className="flex items-center border border-[#B8860B]/30 rounded-full bg-white w-fit overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="p-3 hover:bg-[#F5E6C8]/40 text-[#3A2D23]/70 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-5 font-display font-bold text-sm text-[#3A2D23]">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="p-3 hover:bg-[#F5E6C8]/40 text-[#3A2D23]/70 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 pt-5">
                  <button onClick={handleAdd} className="btn-primary w-full text-center flex items-center justify-center gap-2">
                    Add to selection box <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[10px] text-[#3A2D23]/50 font-bold pt-2">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#B8860B]" /> 100% Pure Ghee Guarantee</span>
                <span className="flex items-center gap-1.5"><Truck size={14} className="text-[#B8860B]" /> Same-day fresh dispatch</span>
              </div>
            </div>

            {/* Product Details Accordion */}
            <div className="mt-10 border-t border-[#B8860B]/15 pt-6 space-y-4">
              {[
                { id: 'ingredients', label: 'Artisanal Ingredients' },
                { id: 'nutrition', label: 'Nutritional Values' },
                { id: 'shipping', label: 'Delivery & Storage' }
              ].map((acc) => (
                <div key={acc.id} className="border-b border-[#B8860B]/10 pb-4">
                  <button
                    onClick={() => toggleAccordion(acc.id)}
                    className="flex justify-between items-center w-full text-left font-display text-sm tracking-wider text-[#8B0000] font-bold uppercase py-1"
                  >
                    <span>{acc.label}</span>
                    <ChevronDown size={14} className={`transform transition-transform text-[#B8860B] ${accordionOpen[acc.id] ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {accordionOpen[acc.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-[#3A2D23]/60 leading-relaxed pt-3">
                          {detailsMock[acc.id]}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 border-t border-[#B8860B]/15 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Reviews list */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display text-2xl md:text-3xl text-[#8B0000] font-bold mb-8">Client Experiences</h2>
            {reviews.length === 0 ? (
              <p className="text-xs italic text-[#3A2D23]/40">No experiences listed yet. Be the first to share your thoughts.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border border-[#B8860B]/10 rounded-2xl p-5 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#3A2D23]">{r.customer}</span>
                      <span className="text-[10px] text-[#3A2D23]/40">{r.date}</span>
                    </div>
                    <div className="flex text-[#B8860B] mt-1.5 mb-3">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={11} fill="#B8860B" className="text-[#B8860B]" />
                      ))}
                    </div>
                    <p className="text-xs text-[#3A2D23]/70 leading-relaxed">
                      {r.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write review form */}
          <div className="lg:col-span-5 bg-[#F5E6C8]/10 rounded-3xl p-6 md:p-8 border border-[#B8860B]/10 h-fit">
            <h3 className="font-display text-xl text-[#8B0000] font-bold mb-6">Write an Experience</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <span className="text-[9px] tracking-widest uppercase text-[#B8860B] font-bold block mb-2">Your Rating</span>
                <div className="flex gap-1 text-[#B8860B]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewRating(idx + 1)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star size={18} fill={idx < newRating ? '#B8860B' : 'none'} className="text-[#B8860B]" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[9px] tracking-widest uppercase text-[#B8860B] font-bold block mb-2">Your Thoughts</span>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details of flavor profile, packaging freshness, ghee aroma..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="input-field bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full text-center disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Experience'}
              </button>
            </form>
          </div>

        </div>

        {/* Related sweets */}
        {related.length > 0 && (
          <div className="mt-24 border-t border-[#B8860B]/15 pt-16">
            <h2 className="font-display text-2xl md:text-3xl text-[#8B0000] font-bold mb-10 text-center">Related Delicacies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <SweetCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  )
}
