import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { CATEGORIES } from '../../services/mockData'
import toast from 'react-hot-toast'

export default function CategoriesManagement() {
  const [cats, setCats] = useState(CATEGORIES.map((c, i) => ({ id: i + 1, name: c, count: 12 + i })))
  const [newCat, setNewCat] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newCat.trim()) return
    setCats([...cats, { id: cats.length + 1, name: newCat, count: 0 }])
    toast.success("Category added successfully!")
    setNewCat('')
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Category Name' },
    { key: 'count', label: 'Associated Products count' }
  ]

  return (
    <AdminLayout>
      <div className="mb-8 select-none font-body">
        <h2 className="font-display text-3xl font-bold text-[#8B0000]">Categories Management</h2>
        <p className="text-xs text-[#3A2D23]/50 mt-1">Manage boutique product categories and groups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm">
          <DataTable columns={columns} rows={cats} />
        </div>

        <div className="lg:col-span-4 bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm h-fit">
          <h3 className="font-display text-lg text-[#8B0000] font-bold mb-4">Add Category</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <input 
              required 
              placeholder="e.g. Sugar Free Sweets" 
              value={newCat} 
              onChange={(e) => setNewCat(e.target.value)} 
              className="input-field" 
            />
            <button type="submit" className="btn-primary w-full">Save Category</button>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
