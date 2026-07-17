import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Pencil, Trash2, PlusSquare } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'

export default function ProductsManagement() {
  const [products, setProducts] = useState([])

  const load = () => adminService.getProducts().then(setProducts)
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this sweet from the catalogue?')) return
    await adminService.deleteProduct(id)
    toast.success('Product removed successfully', {
      style: { background: '#6E1E1E', color: '#FFF8F1' }
    })
    setProducts((p) => p.filter((prod) => prod.id !== id))
  }

  const columns = [
    { key: 'image', label: '', render: (r) => <img src={r.image || '/images/pexels-gaurav-kumar-1281378-18488298.jpg'} alt={r.name} className="w-12 h-12 rounded-xl object-cover border border-gold/10 shadow-sm" onError={(e) => { e.target.src = '/images/pexels-gaurav-kumar-1281378-18488298.jpg' }} /> },
    { key: 'name', label: 'Confection Name', render: (r) => <span className="font-display font-semibold text-maroon-dark text-sm">{r.name}</span> },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price Rate', render: (r) => <span className="font-semibold text-maroon">₹{r.price} / {r.unit}</span> },
    { key: 'stock', label: 'Stock Level' },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <div className="flex gap-2">
          <button 
            className="p-1.5 rounded-xl bg-gold/10 text-gold-dark hover:bg-gold/20 border border-gold/10 transition-all"
            title="Edit Sweet"
          >
            <Pencil size={13} />
          </button>
          <button 
            onClick={() => handleDelete(r.id)} 
            className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-all"
            title="Delete Sweet"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 select-none">
        <div>
          <h2 className="font-display text-3xl font-light text-maroon-dark">Boutique Catalogue</h2>
          <p className="font-body text-xs text-charcoal/50 mt-1">Add, edit, or remove confections in the Pragathi Sweets catalogue.</p>
        </div>
        <Link to="/admin/products/add" className="btn-primary !py-2.5 !px-5 text-[10px] tracking-wider uppercase flex items-center gap-1.5">
          <PlusSquare size={14} className="shrink-0" /> Add New Product
        </Link>
      </div>
      <DataTable columns={columns} rows={products} emptyMessage="No products yet — add your first sweet." />
    </AdminLayout>
  )
}
