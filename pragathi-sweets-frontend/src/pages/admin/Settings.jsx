import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'

export default function Settings() {
  const [form, setForm] = useState({
    boutiqueName: 'Pragathi Sweets & Savouries',
    supportPhone: '+91 98490 12345',
    supportEmail: 'info@pragathisweets.com',
    minimumOrderValue: '200',
    freeDeliveryThreshold: '999',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success("Boutique preferences saved successfully!")
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <AdminLayout>
      <div className="mb-8 select-none font-body">
        <h2 className="font-display text-3xl font-bold text-[#8B0000]">System Settings</h2>
        <p className="text-xs text-[#3A2D23]/50 mt-1">Configure global boutique defaults, shipping tariffs, and contacts.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 md:p-8 max-w-2xl space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Boutique Name</label>
          <input name="boutiqueName" required value={form.boutiqueName} onChange={handleChange} className="input-field" />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Support Contact Number</label>
            <input name="supportPhone" required value={form.supportPhone} onChange={handleChange} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Support Email</label>
            <input name="supportEmail" type="email" required value={form.supportEmail} onChange={handleChange} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Minimum Checkout Value (₹)</label>
            <input name="minimumOrderValue" type="number" required value={form.minimumOrderValue} onChange={handleChange} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase block select-none">Free Delivery Target (₹)</label>
            <input name="freeDeliveryThreshold" type="number" required value={form.freeDeliveryThreshold} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" className="btn-primary w-full sm:w-auto">
            Save Preferences
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
