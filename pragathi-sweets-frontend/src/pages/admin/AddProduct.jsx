import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminService } from '../../services/adminService'
import { Image, Sparkles, Loader2, Wand2 } from 'lucide-react'

const IMAGE_PRESETS = [
  { label: 'Kaju Katli', url: '/images/pexels-gaurav-kumar-1281378-18488298.jpg' },
  { label: 'Motichoor Ladoo', url: '/images/pexels-divigraphy-8624624.jpg' },
  { label: 'Rasgulla / Gulab Jamun', url: '/images/pexels-gaurav-kumar-1281378-18488316.jpg' },
  { label: 'Spicy Mixture / Savouries', url: '/images/pexels-kailashkumarphotography-11887844.jpg' },
  { label: 'Festival Gift Box', url: '/images/pexels-jonathanborba-19863265.jpg' },
]

export default function AddProduct() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loadingCats, setLoadingCats] = useState(true)
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    category: '',
    price: '',
    discountPrice: '',
    unit: 'kg',
    stock: '50',
    description: '',
    image: IMAGE_PRESETS[0].url,
    sku: '',
  })
  const [saving, setSaving] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)

  useEffect(() => {
    adminService.getCategories()
      .then(cats => {
        setCategories(cats)
        if (cats.length > 0) {
          setForm(prev => ({
            ...prev,
            categoryId: cats[0].id,
            category: cats[0].name
          }))
        }
      })
      .catch(err => {
        console.error('Failed to load categories:', err)
        // Fallback default categories if backend had no categories yet
        const defaultCats = [
          { id: 1, name: 'Dry Fruit Sweets' },
          { id: 2, name: 'Milk Sweets' },
          { id: 3, name: 'Bengali Sweets' },
          { id: 4, name: 'Savouries' },
          { id: 5, name: 'Festival Hampers' }
        ]
        setCategories(defaultCats)
        setForm(prev => ({ ...prev, categoryId: 1, category: defaultCats[0].name }))
      })
      .finally(() => setLoadingCats(false))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'categoryId') {
      const selected = categories.find(c => String(c.id) === String(value))
      setForm(prev => ({
        ...prev,
        categoryId: value,
        category: selected ? selected.name : prev.category
      }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Please specify a product name.')
      return
    }
    if (!form.categoryId) {
      toast.error('Please select a valid category.')
      return
    }
    if (Number(form.price) <= 0) {
      toast.error('Price must be greater than 0.')
      return
    }
    if (Number(form.stock) < 0) {
      toast.error('Stock quantity cannot be negative.')
      return
    }

    setSaving(true)
    try {
      await adminService.createProduct({
        name: form.name.trim(),
        categoryId: Number(form.categoryId),
        category: form.category,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        stock: Number(form.stock),
        unit: form.unit,
        description: form.description,
        image: form.image,
        sku: form.sku.trim() || undefined,
      })
      toast.success('Product added successfully to boutique catalogue!', {
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
      navigate('/admin/products')
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Could not add product. Please verify fields.')
    } finally {
      setSaving(false)
    }
  }

  const handleAiGenerate = async () => {
    if (!form.name.trim()) {
      toast.error('Enter a product name first so AI can generate its content.')
      return
    }
    setAiGenerating(true)
    try {
      const selectedCat = categories.find(c => String(c.id) === String(form.categoryId))
      const result = await adminService.generateAiProductContent({
        name: form.name.trim(),
        category: selectedCat?.name || form.category || '',
        price: form.price ? `₹${form.price}` : '',
        weight: form.unit || '',
        ingredients: '',
        characteristics: '',
      })
      if (result?.description) {
        setForm(prev => ({ ...prev, description: result.description }))
        toast.success('AI description applied! Review and edit before saving.', {
          style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
        })
      } else {
        toast.error('AI did not return a description. Try again.')
      }
    } catch (err) {
      toast.error('AI generation failed. Check your network or GEMINI_API_KEY.')
    } finally {
      setAiGenerating(false)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8 select-none font-body">
        <h2 className="font-display text-3xl font-bold text-[#8B0000]">Add New Confection</h2>
        <p className="text-xs text-[#3A2D23]/50 mt-1">Introduce a new handcrafted luxury confection to the boutique catalogue.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-body">
        <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white border border-[#B8860B]/15 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Confection Title *</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Royal Pistachio Kaju Katli"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">
                Category * {loadingCats && '(Loading...)'}
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="input-field bg-white font-medium cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Unit Measure</label>
              <select name="unit" value={form.unit} onChange={handleChange} className="input-field bg-white cursor-pointer">
                <option value="kg">Per kg</option>
                <option value="500g">500g box</option>
                <option value="box">Gift Box</option>
                <option value="piece">Per Piece</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Price (₹) *</label>
              <input
                name="price"
                type="number"
                min="1"
                step="0.01"
                required
                value={form.price}
                onChange={handleChange}
                className="input-field"
                placeholder="650"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Stock Quantity *</label>
              <input
                name="stock"
                type="number"
                min="0"
                required
                value={form.stock}
                onChange={handleChange}
                className="input-field"
                placeholder="50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Special Offer Price (₹)</label>
              <input
                name="discountPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.discountPrice}
                onChange={handleChange}
                className="input-field"
                placeholder="Optional promotional price"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">SKU Code</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className="input-field uppercase font-mono"
                placeholder="e.g. PRG-KATLI-01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Image Source</label>
              <span className="text-[10px] text-[#3A2D23]/50">Choose a luxury preset or enter a custom URL</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {IMAGE_PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, image: p.url }))}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    form.image === p.url
                      ? 'bg-[#8B0000] text-white border-[#8B0000]'
                      : 'bg-[#B8860B]/5 hover:bg-[#B8860B]/15 border-[#B8860B]/20 text-[#3A2D23]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="input-field text-xs font-mono"
              placeholder="/images/... or https://..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Description & Heritage</label>
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={aiGenerating}
                className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#B8860B]/40 text-[#B8860B] hover:bg-[#B8860B] hover:text-white transition-all disabled:opacity-50 select-none"
              >
                {aiGenerating
                  ? <><Loader2 size={11} className="animate-spin" /> Generating...</>
                  : <><Wand2 size={11} /> Generate with AI</>}
              </button>
            </div>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="input-field"
              placeholder="Detail the pure A2 ghee, organic dry fruits, traditional simmering process, and taste profile..."
            />
            <p className="text-[9px] text-[#3A2D23]/40">AI-generated content is a starting point — always review before publishing.</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full sm:w-auto disabled:opacity-60 text-xs font-bold tracking-widest uppercase"
            >
              {saving ? 'Registering Confection...' : 'Publish Sweet to Catalogue'}
            </button>
          </div>
        </form>

        {/* Live Preview Panel */}
        <div className="lg:col-span-4 select-none">
          <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm space-y-4 sticky top-28">
            <h3 className="font-display text-sm tracking-widest uppercase font-bold text-[#8B0000] flex items-center gap-1.5 border-b border-[#B8860B]/10 pb-3">
              <Sparkles size={14} className="text-[#B8860B]" /> Live Storefront Preview
            </h3>

            <div className="rounded-2xl overflow-hidden bg-[#F5E6C8]/40 border border-[#B8860B]/10 h-44 flex items-center justify-center relative">
              {form.image ? (
                <img
                  src={form.image}
                  alt={form.name || 'Preview'}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/images/pexels-gaurav-kumar-1281378-18488298.jpg' }}
                />
              ) : (
                <div className="text-center text-[#3A2D23]/40 flex flex-col items-center">
                  <Image size={24} className="mb-1" />
                  <span className="text-[10px]">No image selected</span>
                </div>
              )}
              {form.discountPrice && Number(form.discountPrice) < Number(form.price) && (
                <span className="absolute top-2 left-2 bg-[#8B0000] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                  OFFER
                </span>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[9px] tracking-widest uppercase font-bold text-[#B8860B] block">
                {form.category || 'Category'}
              </span>
              <h4 className="font-display text-base font-bold text-[#8B0000] truncate">
                {form.name || 'Confection Title'}
              </h4>
              <p className="text-[11px] text-[#3A2D23]/60 line-clamp-2">
                {form.description || 'Crafted with premium ingredients...'}
              </p>
            </div>

            <div className="flex items-baseline justify-between pt-2 border-t border-[#B8860B]/10">
              <div>
                <span className="font-display text-lg font-bold text-[#8B0000]">
                  ₹{form.discountPrice ? form.discountPrice : (form.price || '0')}
                </span>
                {form.discountPrice && (
                  <span className="text-xs text-[#3A2D23]/40 line-through ml-1.5">
                    ₹{form.price}
                  </span>
                )}
                <span className="text-[10px] text-[#3A2D23]/50 ml-1">/ {form.unit}</span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                Number(form.stock) > 10 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {Number(form.stock) > 10 ? `${form.stock} in stock` : 'Low Stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
