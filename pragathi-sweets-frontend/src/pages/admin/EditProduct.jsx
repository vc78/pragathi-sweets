import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminService } from '../../services/adminService'
import { productService } from '../../services/productService'
import { CATEGORIES } from '../../services/mockData'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', category: CATEGORIES[0], price: '', unit: 'kg', stock: '', description: '', image: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    productService.getById(id).then((prod) => {
      if (prod) {
        setForm({
          name: prod.name,
          category: prod.category,
          price: prod.price,
          unit: prod.unit,
          stock: prod.stock || 50,
          description: prod.description || '',
          image: prod.image || ''
        })
      }
    })
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminService.updateProduct(id, { ...form, price: Number(form.price), stock: Number(form.stock) })
      toast.success('Product updated successfully', {
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
      navigate('/admin/products')
    } catch (err) {
      toast.error('Could not update product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8 select-none font-body">
        <h2 className="font-display text-3xl font-bold text-[#8B0000]">Edit Product</h2>
        <p className="text-xs text-[#3A2D23]/50 mt-1">Update details of this handcrafted boutique confection.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 md:p-8 max-w-2xl space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Product Name</label>
          <input name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="e.g. Premium Kaju Katli" />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field bg-white">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Unit</label>
            <select name="unit" value={form.unit} onChange={handleChange} className="input-field bg-white">
              <option value="kg">kg</option>
              <option value="box">box</option>
              <option value="piece">piece</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Price (₹)</label>
            <input name="price" type="number" min="0" required value={form.price} onChange={handleChange} className="input-field" placeholder="620" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Stock Quantity</label>
            <input name="stock" type="number" min="0" required value={form.stock} onChange={handleChange} className="input-field" placeholder="50" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Image URL</label>
          <input name="image" value={form.image} onChange={handleChange} className="input-field" placeholder="https://images.unsplash.com/..." />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Description</label>
          <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="input-field" placeholder="Detail the premium ingredients, traditional process..." />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
            {saving ? 'Updating Sweet...' : 'Update Product'}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
