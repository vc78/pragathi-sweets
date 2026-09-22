import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'
import { RefreshCw, Radio, CheckCircle, Clock, Truck, Package, XCircle } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  { value: 'PROCESSING', label: 'Processing', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  { value: 'PREPARING', label: 'Preparing', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
  { value: 'SHIPPED', label: 'Shipped', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-50 text-green-800 border-green-200' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-50 text-red-800 border-red-200' }
]

export default function OrdersManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [liveSync, setLiveSync] = useState(true)
  const [lastSyncTime, setLastSyncTime] = useState(new Date())
  const pollTimerRef = useRef(null)

  const loadOrders = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const data = await adminService.getOrders()
      setOrders(data)
      setError(null)
      setLastSyncTime(new Date())
    } catch (err) {
      console.error(err)
      if (!silent) {
        setError('Failed to load orders. Please verify backend connectivity.')
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  // Live polling effect
  useEffect(() => {
    if (liveSync) {
      pollTimerRef.current = setInterval(() => {
        loadOrders(true)
      }, 10000)
    } else {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
    }
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
    }
  }, [liveSync])

  const handleStatusChange = async (id, status) => {
    try {
      await adminService.updateOrderStatus(id, status)
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: status.toUpperCase() } : o)))
      toast.success(`Order marked as ${status}`, {
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
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
      render: (r) => (
        <span className="font-mono font-bold text-xs bg-[#B8860B]/10 text-[#8B0000] px-2.5 py-1 rounded-lg border border-[#B8860B]/15">
          {r.orderNumber}
        </span>
      )
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (r) => (
        <div>
          <span className="font-bold text-xs text-[#3A2D23] block">{r.customer}</span>
        </div>
      )
    },
    { key: 'date', label: 'Placement Date' },
    {
      key: 'items',
      label: 'Items',
      render: (r) => <span className="text-xs font-semibold text-[#3A2D23]/80">{r.items} box(es)</span>
    },
    {
      key: 'total',
      label: 'Order Total & Billing',
      render: (r) => (
        <div>
          <span className="font-bold text-sm text-[#8B0000] block">₹{Number(r.total ?? 0).toLocaleString('en-IN')}</span>
          {r.couponCode && Number(r.discountAmount || 0) > 0 && (
            <span className="text-[9px] font-mono font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 block w-fit mt-0.5">
              {r.couponCode} (-₹{r.discountAmount})
            </span>
          )}
        </div>
      )
    },
    {
      key: 'payment',
      label: 'Payment',
      render: (r) => (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          String(r.payment).toUpperCase().includes('SUCCESS') || String(r.payment).toUpperCase().includes('PAID')
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          {r.payment}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status Action',
      render: (r) => {
        const currentUpper = String(r.status || 'PENDING').toUpperCase()
        const matchOption = STATUS_OPTIONS.find(o => o.value === currentUpper) || STATUS_OPTIONS[0]
        return (
          <select
            value={currentUpper}
            onChange={(e) => handleStatusChange(r.id, e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${matchOption.color}`}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )
      },
    },
  ]

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 select-none font-body">
        <div>
          <h2 className="font-display text-3xl font-bold text-[#8B0000]">Order Dispatch Hub</h2>
          <p className="text-xs text-[#3A2D23]/50 mt-1">Real-time storefront order tracking, payment confirmation, and status dispatch.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Sync Indicator */}
          <button
            onClick={() => setLiveSync(!liveSync)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all ${
              liveSync
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-gray-100 border-gray-200 text-gray-500'
            }`}
          >
            <Radio size={12} className={liveSync ? 'animate-pulse text-green-600' : ''} />
            {liveSync ? 'Live Sync: ON' : 'Live Sync: OFF'}
          </button>

          <button
            onClick={() => loadOrders(false)}
            disabled={loading}
            className="btn-outline !py-2 !px-4 text-xs font-bold tracking-widest flex items-center gap-2"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Sync Now
          </button>
        </div>
      </div>

      <div className="text-[10px] text-[#3A2D23]/40 font-mono mb-4 text-right select-none">
        Last updated: {lastSyncTime.toLocaleTimeString()}
      </div>

      {loading ? (
        <div className="py-20 text-center font-body text-xs text-[#3A2D23]/50 animate-pulse">
          Connecting to dispatch queue...
        </div>
      ) : error ? (
        <div className="py-16 text-center font-body text-sm text-red-600 font-semibold border border-red-200 bg-red-50/50 rounded-3xl p-6">
          <p className="mb-3">{error}</p>
          <button onClick={() => loadOrders(false)} className="btn-primary text-xs">Retry Connection</button>
        </div>
      ) : (
        <DataTable columns={columns} rows={orders} emptyMessage="No customer orders recorded yet." />
      )}
    </AdminLayout>
  )
}
