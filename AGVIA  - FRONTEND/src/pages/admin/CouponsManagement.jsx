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

  const handleToggleStatus = async (id, code, currentActive) => {
    try {
      const res = await adminService.toggleCouponStatus(id)
      const nowActive = res.active ?? !currentActive
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: nowActive } : c))
      if (nowActive) {
        toast.success(`Coupon "${code}" implemented & activated for customers!`, {
          style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
        })
      } else {
        toast.success(`Coupon "${code}" stopped and paused from checkout.`, {
          style: { background: '#2A201A', color: '#FFFDF8', borderRadius: '12px' }
        })
      }
    } catch (err) {
      console.error(err)
      toast.error('Could not update offer status.')
    }
  }

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Permanently remove promo coupon "${code}"?`)) return
    try {
      await adminService.deleteCoupon(id)
      toast.success(`Coupon ${code} removed.`)
      setCoupons(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error(err)
      toast.error('Could not remove coupon.')
    }
  }

  const columns = [
    {
      key: 'code',
      label: 'Coupon Code',
      render: (r) => (
        <div>
          <span className="font-mono font-bold text-xs bg-[#B8860B]/10 text-[#8B0000] px-2.5 py-1 rounded-lg border border-[#B8860B]/20 block w-fit">
            {r.code}
          </span>
          <span className="text-[10px] text-[#3A2D23]/50 block mt-1">Min: ₹{r.minOrderAmount || 0}</span>
        </div>
      )
    },
    { 
      key: 'title', 
      label: 'Promo Name & Terms',
      render: (r) => (
        <div>
          <span className="font-bold text-xs text-[#3A2D23] block">{r.title}</span>
          <span className="text-[10px] text-[#3A2D23]/50 block">Redeemed: {r.usedCount || 0} times</span>
        </div>
      )
    },
    {
      key: 'discount',
      label: 'Benefit',
      render: (r) => <span className="font-bold text-green-700">{r.discount} OFF</span>
    },
    { key: 'expires', label: 'Valid Until' },
    {
      key: 'active',
      label: 'Storefront Status',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${row.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
          {row.active ? 'Active in Store' : 'Stopped / Paused'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Action Controls',
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.active ? (
            <button
              onClick={() => handleToggleStatus(r.id, r.code, r.active)}
              className="px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 text-[10px] font-bold transition-all shadow-xs"
              title="Stop / Pause this offer"
            >
              Stop Offer
            </button>
          ) : (
            <button
              onClick={() => handleToggleStatus(r.id, r.code, r.active)}
              className="px-2.5 py-1 rounded-lg border border-green-200 bg-green-50 text-green-800 hover:bg-green-100 text-[10px] font-bold transition-all shadow-xs"
              title="Implement / Activate this offer"
            >
              Implement
            </button>
          )}

          <button
            onClick={() => handleDelete(r.id, r.code)}
            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            title="Delete Coupon"
          >
            <Trash2 size={13} />
          </button>
        </div>
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
