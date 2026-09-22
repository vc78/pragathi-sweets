import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Pencil, Trash2, PlusSquare, RefreshCw } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'

export default function ProductsManagement() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminService.getProducts()
      .then(setProducts)
      .catch((err) => {
        console.error(err)
        toast.error('Failed to load products.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate "${name}" from the catalogue?`)) return
    try {
      await adminService.deleteProduct(id)
      toast.success('Product deactivated successfully', {
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
      setProducts((p) => p.filter((prod) => prod.id !== id))
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete product.')
    }
  }

  const columns = [
    {
      key: 'image',
      label: '',
      render: (r) => (
        <img
          src={r.image || '/images/pexels-gaurav-kumar-1281378-18488298.jpg'}
          alt={r.name}
          className="w-12 h-12 rounded-xl object-cover border border-[#B8860B]/15 shadow-sm"
          onError={(e) => { e.target.src = '/images/pexels-gaurav-kumar-1281378-18488298.jpg' }}
        />
      ),
    },
    {
      key: 'name',
      label: 'Confection Name',
      render: (r) => <span className="font-display font-semibold text-[#8B0000] text-sm">{r.name}</span>,
    },
    { key: 'category', label: 'Category' },
    {
      key: 'price',
      label: 'Price Rate',
      render: (r) => (
        <div>
          <span className="font-semibold text-[#8B0000]">₹{r.price}</span>
          <span className="text-[10px] text-[#3A2D23]/50 ml-1">/ {r.unit}</span>
          {r.discountPrice && (
            <span className="block text-[10px] text-green-700 font-semibold">Offer: ₹{r.discountPrice}</span>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      label: 'Stock Level',
      render: (r) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
          Number(r.stock) > 10 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {r.stock} units
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <Link
            to={`/admin/products/edit/${r.id}`}
            className="p-1.5 rounded-xl bg-[#B8860B]/10 text-[#8B0000] hover:bg-[#B8860B]/20 border border-[#B8860B]/20 transition-all inline-flex items-center justify-center"
            title="Edit Sweet"
          >
            <Pencil size={13} />
          </Link>
          <button
            onClick={() => handleDelete(r.id, r.name)}
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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 select-none font-body">
        <div>
          <h2 className="font-display text-3xl font-bold text-[#8B0000]">Boutique Catalogue</h2>
          <p className="text-xs text-[#3A2D23]/50 mt-1">Add, edit, or remove confections in the Pragathi Sweets catalogue.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            disabled={loading}
            className="btn-outline !py-2.5 !px-4 text-xs font-bold tracking-widest flex items-center gap-2"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Sync Catalogue
          </button>
          <Link
            to="/admin/products/add"
            className="btn-primary !py-2.5 !px-5 text-[10px] tracking-wider uppercase flex items-center gap-1.5"
          >
            <PlusSquare size={14} className="shrink-0" /> Add New Confection
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="py-20 text-center text-xs text-[#3A2D23]/50 animate-pulse font-body">
          Syncing catalogue confections...
        </div>
      ) : (
        <DataTable columns={columns} rows={products} emptyMessage="No products yet — add your first sweet." />
      )}
    </AdminLayout>
  )
}
