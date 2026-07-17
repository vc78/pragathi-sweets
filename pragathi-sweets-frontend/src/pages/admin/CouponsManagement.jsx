import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { OFFERS } from '../../services/mockData'
import toast from 'react-hot-toast'

export default function CouponsManagement() {
  const [coupons, setCoupons] = useState(OFFERS)
  const [form, setForm] = useState({ title: '', code: '', discount: '', active: true, expires: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setCoupons([...coupons, { id: coupons.length + 1, ...form }])
    toast.success("Coupon code created successfully!")
    setForm({ title: '', code: '', discount: '', active: true, expires: '' })
  }

  const columns = [
    { key: 'code', label: 'Coupon Code' },
    { key: 'title', label: 'Promo Name' },
    { key: 'discount', label: 'Reduction' },
    { key: 'expires', label: 'Expiration' },
    { key: 'active', label: 'Status', render: (row) => row.active ? 'Active' : 'Expired' }
  ]

  return (
    <AdminLayout>
      <div className="mb-8 select-none font-body">
        <h2 className="font-display text-3xl font-bold text-[#8B0000]">Coupons & Offers</h2>
        <p className="text-xs text-[#3A2D23]/50 mt-1">Manage discounts, checkout promo codes, and campaign offers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm">
          <DataTable columns={columns} rows={coupons} />
        </div>

        <div className="lg:col-span-4 bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm h-fit">
          <h3 className="font-display text-lg text-[#8B0000] font-bold mb-4">Create Promo Code</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Promo Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
            <input required placeholder="Coupon Code (e.g. FESTIVE20)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input-field uppercase" />
            <input required placeholder="Discount (e.g. 15% or ₹150)" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="input-field" />
            <input required type="date" value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} className="input-field text-gray-500" />
            <button type="submit" className="btn-primary w-full">Save Coupon</button>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
