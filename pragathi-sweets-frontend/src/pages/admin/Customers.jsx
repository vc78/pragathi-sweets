import { useEffect, useState, useCallback, useRef } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'

const POLL_INTERVAL = 15000 // 15 seconds

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const intervalRef = useRef(null)

  const fetchCustomers = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setIsRefreshing(true)
    try {
      const data = await adminService.getCustomers()
      setCustomers(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      console.error(err)
      if (!silent) setError('Failed to load customers. Please verify backend connection.')
    } finally {
      if (!silent) setLoading(false)
      else setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers(false)

    intervalRef.current = setInterval(() => {
      fetchCustomers(true)
    }, POLL_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchCustomers])

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'phone', label: 'Phone',
      render: (r) => r.phone || <span className="text-charcoal/30 italic text-xs">—</span>
    },
    {
      key: 'orders', label: 'Orders',
      render: (r) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-maroon-light/10 text-maroon-dark font-semibold text-sm">
          {r.orders}
        </span>
      )
    },
    {
      key: 'spent', label: 'Total Spent',
      render: (r) => (
        <span className="font-semibold text-emerald-700">
          ₹{(r.spent || 0).toLocaleString('en-IN')}
        </span>
      )
    },
    { key: 'joined', label: 'Joined' },
    {
      key: 'status', label: 'Status',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          r.orders > 0
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-amber-100 text-amber-700'
        }`}>
          {r.orders > 0 ? 'Active' : 'New'}
        </span>
      )
    },
  ]

  return (
    <AdminLayout>
      <div className="mb-6 flex items-start justify-between select-none">
        <div>
          <h2 className="font-display text-3xl font-light text-maroon-dark">Loyal Clients</h2>
          <p className="font-body text-xs text-charcoal/50 mt-1">
            Register of AGVIA atelier patrons, lifetime wardrobe purchases, and account details.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => fetchCustomers(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-maroon-light/20 text-xs text-maroon-dark bg-white hover:bg-maroon-light/5 transition-colors disabled:opacity-50"
          >
            <span className={`text-sm ${isRefreshing ? 'animate-spin' : ''}`}>↻</span>
            {isRefreshing ? 'Refreshing…' : 'Refresh'}
          </button>
          {lastUpdated && (
            <span className="text-[10px] text-charcoal/40">
              Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
          <span className="text-[10px] text-charcoal/30">Auto-refreshes every 15s</span>
        </div>
      </div>

      {/* Summary Cards */}
      {!loading && !error && customers.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-maroon-light/10 p-4 shadow-sm">
            <p className="text-xs text-charcoal/50 font-body mb-1">Total Customers</p>
            <p className="text-2xl font-semibold text-maroon-dark">{customers.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-maroon-light/10 p-4 shadow-sm">
            <p className="text-xs text-charcoal/50 font-body mb-1">Active Buyers</p>
            <p className="text-2xl font-semibold text-emerald-700">
              {customers.filter(c => c.orders > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-maroon-light/10 p-4 shadow-sm">
            <p className="text-xs text-charcoal/50 font-body mb-1">Total Revenue</p>
            <p className="text-2xl font-semibold text-maroon-dark">
              ₹{customers.reduce((s, c) => s + (c.spent || 0), 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center font-body text-xs text-charcoal/50 animate-pulse">
          Loading client directory…
        </div>
      ) : error ? (
        <div className="py-20 text-center font-body text-sm text-red-600 font-semibold border border-red-200/20 bg-red-50/10 rounded-3xl">
          {error}
        </div>
      ) : (
        <DataTable columns={columns} rows={customers} emptyMessage="No customers yet." />
      )}
    </AdminLayout>
  )
}
