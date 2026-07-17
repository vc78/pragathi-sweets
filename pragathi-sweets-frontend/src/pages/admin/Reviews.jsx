import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Star, Check, X } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'

export default function Reviews() {
  const [reviews, setReviews] = useState([])

  useEffect(() => { adminService.getReviews().then(setReviews) }, [])

  const handleModerate = async (id, approved) => {
    await adminService.moderateReview(id, approved)
    setReviews((list) => list.map((r) => (r.id === id ? { ...r, approved } : r)))
    toast.success(approved ? 'Review approved for display' : 'Review rejected successfully', {
      style: { background: '#6E1E1E', color: '#FFF8F1' }
    })
  }

  const columns = [
    { key: 'product', label: 'Product' },
    { key: 'customer', label: 'Customer' },
    { key: 'rating', label: 'Rating', render: (r) => (
      <span className="flex items-center gap-1 text-gold font-body font-semibold text-xs">
        <Star size={14} fill="currentColor" /> {r.rating.toFixed(1)}
      </span>
    ) },
    { key: 'comment', label: 'Comment' },
    {
      key: 'status', label: 'Status', render: (r) => (
        r.approved
          ? <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-cardamom/10 text-cardamom border-cardamom/20">Approved</span>
          : (
            <div className="flex gap-2">
              <button 
                onClick={() => handleModerate(r.id, true)} 
                className="p-1.5 rounded-xl bg-cardamom/10 text-cardamom hover:bg-cardamom/20 border border-cardamom/20 transition-all"
                title="Approve Review"
              >
                <Check size={14} />
              </button>
              <button 
                onClick={() => handleModerate(r.id, false)} 
                className="p-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-100 transition-all"
                title="Reject Review"
              >
                <X size={14} />
              </button>
            </div>
          )
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="mb-8 select-none">
        <h2 className="font-display text-3xl font-light text-maroon-dark">Client Reviews</h2>
        <p className="font-body text-xs text-charcoal/50 mt-1">Moderate client reviews, comments, and rating scores submitted to the storefront.</p>
      </div>
      <DataTable columns={columns} rows={reviews} emptyMessage="No reviews submitted yet." />
    </AdminLayout>
  )
}
