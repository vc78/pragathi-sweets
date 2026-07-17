import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminService } from '../../services/adminService'
import { CATEGORIES } from '../../services/mockData'

export default function AddProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', category: CATEGORIES[0], price: '', unit: 'kg', stock: '', description: '', image: '',
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminService.createProduct({ ...form, price: Number(form.price), stock: Number(form.stock) })
      toast.success('Product added successfully', {
        style: { background: '#6E1E1E', color: '#FFF8F1' }
      })
      navigate('/admin/products')
    } catch (err) {
      toast.error('Could not add product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8 select-none">
        <h2 className="font-display text-3xl font-light text-maroon-dark">Add New Product</h2>
        <p className="font-body text-xs text-charcoal/50 mt-1">Introduce a new handcrafted luxury confection to the boutique catalogue.</p>
      </div>

      <form onSubmit={handleSubmit} className="card-luxury max-w-2xl space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gold tracking-widest uppercase font-body select-none">Product Name</label>
          <input name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="e.g. Premium Kaju Katli" />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gold tracking-widest uppercase font-body select-none">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field !bg-white">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gold tracking-widest uppercase font-body select-none">Unit</label>
            <select name="unit" value={form.unit} onChange={handleChange} className="input-field !bg-white">
              <option value="kg">kg</option>
              <option value="box">box</option>
              <option value="piece">piece</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gold tracking-widest uppercase font-body select-none">Price (₹)</label>
            <input name="price" type="number" min="0" required value={form.price} onChange={handleChange} className="input-field" placeholder="620" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gold tracking-widest uppercase font-body select-none">Stock Quantity</label>
            <input name="stock" type="number" min="0" required value={form.stock} onChange={handleChange} className="input-field" placeholder="50" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gold tracking-widest uppercase font-body select-none">Image URL</label>
          <input name="image" value={form.image} onChange={handleChange} className="input-field" placeholder="https://images.unsplash.com/..." />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gold tracking-widest uppercase font-body select-none">Description</label>
          <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="input-field" placeholder="Detail the premium ingredients, traditional process, and texture profile..." />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
            {saving ? 'Saving Sweet...' : 'Save Product to Catalogue'}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
