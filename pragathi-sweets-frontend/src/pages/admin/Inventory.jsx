import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'

export default function Inventory() {
  const [inventory, setInventory] = useState([])

  useEffect(() => { adminService.getInventory().then(setInventory) }, [])

  const handleUpdate = async (id, value) => {
    const stock = Number(value)
    if (Number.isNaN(stock) || stock < 0) return
    await adminService.updateStock(id, stock)
    setInventory((list) => list.map((i) => (i.id === id ? { ...i, stock } : i)))
    toast.success('Stock updated successfully', {
      style: { background: '#6E1E1E', color: '#FFF8F1' }
    })
  }

  const columns = [
    { key: 'name', label: 'Product' },
    {
      key: 'stock', label: 'Stock Level', render: (r) => (
        <input
          type="number"
          defaultValue={r.stock}
          min="0"
          onBlur={(e) => handleUpdate(r.id, e.target.value)}
          className="w-24 px-3 py-1.5 rounded-xl border border-gold/30 bg-transparent text-charcoal focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon font-body text-xs"
        />
      ),
    },
    { key: 'unit', label: 'Unit' },
    {
      key: 'status', label: 'Status', render: (r) => (
        r.stock <= r.lowStockThreshold
          ? <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-red-50 text-red-700 border-red-100">Low Stock</span>
          : <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-cardamom/10 text-cardamom border-cardamom/20">In Stock</span>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="mb-8 select-none">
        <h2 className="font-display text-3xl font-light text-maroon-dark">Stock Inventory</h2>
        <p className="font-body text-xs text-charcoal/50 mt-1">Manage current sweet inventory levels, pack sizes, and low stock thresholds.</p>
      </div>
      <DataTable columns={columns} rows={inventory} emptyMessage="No inventory records found." />
    </AdminLayout>
  )
}
