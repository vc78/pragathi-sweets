import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'
import { Trash2, RefreshCw, Layers } from 'lucide-react'

export default function CategoriesManagement() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await adminService.getCategories()
      setCats(data.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description || '—',
        count: c.productCount ?? 0,
        active: c.active ? 'Active' : 'Inactive'
      })))
    } catch (err) {
      console.error(err)
      toast.error('Could not load categories from server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await adminService.createCategory({ name, description })
      toast.success('Category created successfully!', {
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
      setName('')
      setDescription('')
      loadCategories()
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Failed to create category.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to deactivate "${catName}"?`)) return
    try {
      await adminService.deleteCategory(id)
      toast.success('Category removed successfully.')
      setCats(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error(err)
      toast.error('Failed to remove category.')
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'name',
      label: 'Category Name',
      render: (r) => <span className="font-display font-bold text-[#8B0000]">{r.name}</span>
    },
    { key: 'description', label: 'Description' },
    {
      key: 'count',
      label: 'Products',
      render: (r) => <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#B8860B]/10 text-[#8B0000]">{r.count} confections</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <button
          onClick={() => handleDelete(r.id, r.name)}
          className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          title="Delete Category"
        >
          <Trash2 size={14} />
        </button>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 select-none font-body">
        <div>
          <h2 className="font-display text-3xl font-bold text-[#8B0000]">Categories Hub</h2>
          <p className="text-xs text-[#3A2D23]/50 mt-1">Manage luxury confection groups and collections in real-time.</p>
        </div>
        <button
          onClick={loadCategories}
          disabled={loading}
          className="btn-outline !py-2 !px-4 text-xs font-bold tracking-widest flex items-center gap-2"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh Categories
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-xs text-[#3A2D23]/50 animate-pulse font-body">
              Syncing categories from catalog...
            </div>
          ) : (
            <DataTable columns={columns} rows={cats} emptyMessage="No categories created yet." />
          )}
        </div>

        <div className="lg:col-span-4 bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm h-fit select-none">
          <h3 className="font-display text-lg text-[#8B0000] font-bold mb-4 flex items-center gap-2">
            <Layers size={18} className="text-[#B8860B]" /> Add New Category
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#B8860B] uppercase tracking-wider block">Category Title</label>
              <input
                required
                placeholder="e.g. Traditional Halwas"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#B8860B] uppercase tracking-wider block">Description</label>
              <textarea
                rows={3}
                placeholder="Brief summary of couture silhouette, fabrics, and styling..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
              />
            </div>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="btn-primary w-full disabled:opacity-60 text-xs font-bold tracking-widest"
            >
              {saving ? 'Creating Category...' : 'Save Category'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
