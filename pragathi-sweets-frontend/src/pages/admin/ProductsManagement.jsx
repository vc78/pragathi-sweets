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
        toast.error('Failed to load atelier collection.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate "${name}" from the atelier catalogue?`)) return
    try {
      await adminService.deleteProduct(id)
      toast.success('Silhouette deactivated successfully', {
        style: { background: '#5A1020', color: '#FAF7F2', borderRadius: '12px' }
      })
      setProducts((p) => p.filter((prod) => prod.id !== id))
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete silhouette.')
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
          className="w-12 h-16 rounded-lg object-cover border border-[#C9A45C]/20 shadow-sm"
          onError={(e) => { e.target.src = '/images/pexels-gaurav-kumar-1281378-18488298.jpg' }}
        />
      ),
    },
    {
      key: 'name',
      label: 'Silhouette Name',
      render: (r) => <span className="font-serif font-semibold text-[#5A1020] text-sm">{r.name}</span>,
    },
    { key: 'category', label: 'Couture Line' },
    {
      key: 'price',
      label: 'Price',
      render: (r) => (
        <div>
          <span className="font-semibold text-[#5A1020]">₹{r.price?.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-[#211D1E]/50 ml-1">/ {r.unit || 'piece'}</span>
          {r.discountPrice && (
            <span className="block text-[10px] text-green-700 font-semibold">Offer: ₹{r.discountPrice?.toLocaleString('en-IN')}</span>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      label: 'Atelier Stock',
      render: (r) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
          Number(r.stock) > 10 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {r.stock} in stock
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
            className="p-1.5 rounded-xl bg-[#C9A45C]/15 text-[#5A1020] hover:bg-[#C9A45C]/30 border border-[#C9A45C]/30 transition-all inline-flex items-center justify-center"
            title="Edit Silhouette"
          >
            <Pencil size={13} />
          </Link>
          <button
            onClick={() => handleDelete(r.id, r.name)}
            className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-all"
            title="Deactivate Silhouette"
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
          <h2 className="font-serif text-3xl font-bold text-[#5A1020]">Atelier Catalogue</h2>
          <p className="text-xs text-[#211D1E]/60 mt-1">Manage luxury garments, sarees, and couture in the AGVIA collection.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            disabled={loading}
            className="btn-outline !py-2.5 !px-4 text-xs font-bold tracking-widest flex items-center gap-2"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Sync Collection
          </button>
          <Link
            to="/admin/products/add"
            className="btn-primary !py-2.5 !px-5 text-[10px] tracking-wider uppercase flex items-center gap-1.5"
          >
            <PlusSquare size={14} className="shrink-0" /> Add New Silhouette
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="py-20 text-center text-xs text-[#211D1E]/50 animate-pulse font-body">
          Syncing atelier collection...
        </div>
      ) : (
        <DataTable columns={columns} rows={products} emptyMessage="No silhouettes yet — add your first couture piece." />
      )}
    </AdminLayout>
  )
}
