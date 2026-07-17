import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'

export default function Offers() {
  const [offers, setOffers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', code: '', discount: '', expires: '' })

  const load = () => adminService.getOffers().then(setOffers)
  useEffect(() => { load() }, [])

  const handleToggle = async (id) => {
    await adminService.toggleOffer(id)
    setOffers((list) => list.map((o) => (o.id === id ? { ...o, active: !o.active } : o)))
    toast.success('Offer status updated', {
      style: { background: '#6E1E1E', color: '#FFF8F1' }
    })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const offer = await adminService.createOffer({ ...form, active: true })
    setOffers((list) => [offer, ...list])
    toast.success('Offer created successfully', {
      style: { background: '#6E1E1E', color: '#FFF8F1' }
    })
    setForm({ title: '', code: '', discount: '', expires: '' })
    setShowForm(false)
  }

  const columns = [
    { key: 'title', label: 'Offer' },
    { key: 'code', label: 'Code' },
    { key: 'discount', label: 'Discount' },
    { key: 'expires', label: 'Expires' },
    {
      key: 'active', label: 'Status', render: (r) => (
        <button
          onClick={() => handleToggle(r.id)}
          className={`px-3 py-1 rounded-full text-[10px] font-semibold border transition-all duration-300 ${
            r.active 
              ? 'bg-cardamom/10 text-cardamom border-cardamom/20' 
              : 'bg-gray-50 text-charcoal/40 border-gray-100'
          }`}
        >
          {r.active ? 'Active' : 'Inactive'}
        </button>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 select-none">
        <div>
          <h2 className="font-display text-3xl font-light text-maroon-dark">Festival Offers</h2>
          <p className="font-body text-xs text-charcoal/50 mt-1">Manage active boutique discount coupons, seasonal offers, and holiday specials.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary !py-2.5 !px-5 text-[10px] tracking-wider uppercase">
          <Plus size={14} className="shrink-0" /> {showForm ? 'Close Form' : 'New Offer'}
        </button>
      </div>

      {showForm && (
        <motion.form 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreate} 
          className="card-luxury max-w-2xl mb-8 space-y-4"
        >
          <h3 className="font-display text-sm font-semibold text-maroon tracking-wider uppercase border-b border-gold/15 pb-2">
            Create Promotional Offer
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gold tracking-widest uppercase font-body select-none">Offer Title</label>
              <input required placeholder="e.g. Independence Day Special" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gold tracking-widest uppercase font-body select-none">Coupon Code</label>
              <input required placeholder="e.g. AZADI15" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gold tracking-widest uppercase font-body select-none">Discount Value</label>
              <input required placeholder="e.g. 15% or ₹200 off" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="input-field" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gold tracking-widest uppercase font-body select-none">Expiry Date</label>
              <input required type="date" value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="pt-2">
            <button type="submit" className="btn-primary w-full sm:w-auto">Create Offer</button>
          </div>
        </motion.form>
      )}

      <DataTable columns={columns} rows={offers} emptyMessage="No offers created yet." />
    </AdminLayout>
  )
}
