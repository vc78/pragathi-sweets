import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function OrdersManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    adminService.getOrders()
      .then(setOrders)
      .catch(err => {
        console.error(err)
        setError('Failed to load orders. Please verify backend connection.')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (id, status) => {
    try {
      await adminService.updateOrderStatus(id, status)
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)))
      toast.success(`Order status marked as ${status}`, {
        style: { background: '#6E1E1E', color: '#FFF8F1' }
      })
    } catch (err) {
      console.error(err)
      toast.error('Failed to update order status.')
    }
  }

  const columns = [
    {
      key: 'orderNumber',
      label: 'Order ID',
      render: (r) => <span className="font-display font-bold text-maroon-dark text-sm">{r.orderNumber}</span>
    },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date' },
    { key: 'items', label: 'Items' },
    { key: 'total', label: 'Total', render: (r) => <span className="font-semibold text-maroon">₹{Number(r.total ?? 0).toLocaleString('en-IN')}</span> },
    { key: 'payment', label: 'Payment' },
    {
      key: 'status', label: 'Status Action', render: (r) => (
        <select
          value={r.status}
          onChange={(e) => handleStatusChange(r.id, e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-gold/30 bg-white text-charcoal focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon font-body text-xs font-semibold cursor-pointer"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="mb-8 select-none">
        <h2 className="font-display text-3xl font-light text-maroon-dark">Order Dispatch Hub</h2>
        <p className="font-body text-xs text-charcoal/50 mt-1">Monitor storefront transactions, status tracking, and dispatch settings.</p>
      </div>
      {loading ? (
        <div className="py-20 text-center font-body text-xs text-charcoal/50 animate-pulse">
          Loading orders...
        </div>
      ) : error ? (
        <div className="py-20 text-center font-body text-sm text-red-600 font-semibold border border-red-200/20 bg-red-50/10 rounded-3xl">
          {error}
        </div>
      ) : (
        <DataTable columns={columns} rows={orders} emptyMessage="No orders placed yet." />
      )}
    </AdminLayout>
  )
}
