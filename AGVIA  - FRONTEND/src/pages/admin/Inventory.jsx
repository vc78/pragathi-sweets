import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'
import { RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function Inventory() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminService.getInventory()
      .then(setInventory)
      .catch((err) => {
        console.error(err)
        toast.error('Failed to load inventory.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleUpdate = async (id, value) => {
    const stock = Number(value)
    if (Number.isNaN(stock) || stock < 0) {
      toast.error('Stock must be a valid non-negative number.')
      return
    }
    try {
      await adminService.updateStock(id, stock)
      setInventory((list) => list.map((i) => (i.id === id ? { ...i, stock } : i)))
      toast.success('Stock level updated successfully', {
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
    } catch (err) {
      console.error(err)
      toast.error('Failed to update stock in database.')
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Product Confection',
      render: (r) => <span className="font-display font-semibold text-[#8B0000]">{r.name}</span>
    },
    {
      key: 'stock',
      label: 'Current Stock Level',
      render: (r) => (
        <div className="flex items-center gap-2">
          <input
            type="number"
            defaultValue={r.stock}
            min="0"
            onBlur={(e) => {
              if (Number(e.target.value) !== r.stock) {
                handleUpdate(r.id, e.target.value)
              }
            }}
            className="w-24 px-3 py-1.5 rounded-xl border border-[#B8860B]/30 bg-white text-[#3A2D23] font-semibold focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] text-xs font-mono"
          />
          <span className="text-[10px] text-[#3A2D23]/50">units</span>
        </div>
      ),
    },
    { key: 'unit', label: 'Unit Pack' },
    {
      key: 'status',
      label: 'Inventory Health',
      render: (r) => (
        r.stock <= (r.lowStockThreshold || 10) ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-red-50 text-red-700 border-red-200">
            <AlertTriangle size={10} /> Low Stock Warning
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 size={10} /> Optimal Stock
          </span>
        )
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 select-none font-body">
        <div>
          <h2 className="font-display text-3xl font-bold text-[#8B0000]">Stock & Inventory Control</h2>
          <p className="text-xs text-[#3A2D23]/50 mt-1">Real-time inventory levels, pack sizes, and low stock threshold alerts.</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="btn-outline !py-2.5 !px-4 text-xs font-bold tracking-widest flex items-center gap-2"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Sync Inventory
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-[#3A2D23]/50 animate-pulse font-body">
          Syncing inventory balances...
        </div>
      ) : (
        <DataTable columns={columns} rows={inventory} emptyMessage="No inventory records found." />
      )}
    </AdminLayout>
  )
}
