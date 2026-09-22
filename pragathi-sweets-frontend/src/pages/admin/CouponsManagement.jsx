import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'
import { Trash2, RefreshCw, Tag } from 'lucide-react'

export default function CouponsManagement() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    expires: ''
  })

  const loadCoupons = async () => {
    setLoading(true)
    try {
      const data = await adminService.getCoupons()
      setCoupons(data)
    } catch (err) {
      console.error(err)
      toast.error('Could not load promo coupons from server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCoupons()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.code.trim() || !form.discountValue) return
    setSaving(true)
    try {
      await adminService.createCoupon(form)
      toast.success('Coupon code activated successfully!', {
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
      setForm({
        title: '',
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderAmount: '',
        expires: ''
      })
      loadCoupons()
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Failed to create coupon.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Deactivate promo coupon "${code}"?`)) return
    try {
      await adminService.deleteCoupon(id)
      toast.success(`Coupon ${code} deactivated.`)
      setCoupons(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error(err)
      toast.error('Could not deactivate coupon.')
    }
  }

  const columns = [
    {
      key: 'code',
      label: 'Coupon Code',
      render: (r) => <span className="font-mono font-bold text-xs bg-[#B8860B]/10 text-[#8B0000] px-2.5 py-1 rounded-lg border border-[#B8860B]/20">{r.code}</span>
    },
    { key: 'title', label: 'Promo Name' },
    {
      key: 'discount',
      label: 'Discount Benefit',
      render: (r) => <span className="font-bold text-green-700">{r.discount}</span>
    },
    { key: 'expires', label: 'Expiration' },
    {
      key: 'active',
      label: 'Status',
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${row.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
          {row.active ? 'Active' : 'Expired'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <button
          onClick={() => handleDelete(r.id, r.code)}
          className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          title="Deactivate Coupon"
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
          <h2 className="font-display text-3xl font-bold text-[#8B0000]">Coupons & Campaigns</h2>
          <p className="text-xs text-[#3A2D23]/50 mt-1">Manage discounts, checkout promo codes, and campaign offers.</p>
        </div>
        <button
          onClick={loadCoupons}
          disabled={loading}
          className="btn-outline !py-2 !px-4 text-xs font-bold tracking-widest flex items-center gap-2"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh Coupons
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-xs text-[#3A2D23]/50 animate-pulse font-body">
              Syncing coupons from database...
            </div>
          ) : (
            <DataTable columns={columns} rows={coupons} emptyMessage="No coupons registered yet." />
          )}
        </div>

        <div className="lg:col-span-4 bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm h-fit select-none">
          <h3 className="font-display text-lg text-[#8B0000] font-bold mb-4 flex items-center gap-2">
            <Tag size={18} className="text-[#B8860B]" /> Create Promo Code
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#B8860B] uppercase tracking-wider block">Promo Title</label>
              <input
                required
                placeholder="Diwali Grand Celebration"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#B8860B] uppercase tracking-wider block">Code</label>
              <input
                required
                placeholder="DIWALI25"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="input-field uppercase font-mono font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#B8860B] uppercase tracking-wider block">Type</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  className="input-field bg-white"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FLAT">Flat Rate (₹)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#B8860B] uppercase tracking-wider block">Value</label>
                <input
                  required
                  type="number"
                  min="1"
                  placeholder="20"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#B8860B] uppercase tracking-wider block">Min Order Amount (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="499 (optional)"
                value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#B8860B] uppercase tracking-wider block">Expiration Date</label>
              <input
                required
                type="date"
                value={form.expires}
                onChange={(e) => setForm({ ...form, expires: e.target.value })}
                className="input-field text-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full disabled:opacity-60 text-xs font-bold tracking-widest"
            >
              {saving ? 'Creating Promo...' : 'Save & Publish Coupon'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
