import { useEffect, useState, useRef } from 'react'
import { IndianRupee, ShoppingBag, Users, Package, RefreshCw, Radio } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import StatCard from '../../components/admin/StatCard'
import SalesChart from '../../components/admin/SalesChart'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [liveSync, setLiveSync] = useState(true)
  const [lastSyncTime, setLastSyncTime] = useState(new Date())
  const pollRef = useRef(null)

  const loadStats = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const data = await adminService.getDashboardStats()
      setStats(data)
      setError(null)
      setLastSyncTime(new Date())
    } catch (err) {
      console.error(err)
      if (!silent) {
        setError('Failed to load dashboard metrics. Please verify backend connection.')
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    if (liveSync) {
      pollRef.current = setInterval(() => {
        loadStats(true)
      }, 12000)
    } else {
      if (pollRef.current) clearInterval(pollRef.current)
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [liveSync])

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (r) => <span className="font-mono font-bold text-xs text-[#5A1020]">{r.id}</span>
    },
    { key: 'customer', label: 'Patron' },
    {
      key: 'total',
      label: 'Total',
      render: (r) => <span className="font-bold text-[#5A1020]">₹{Number(r.total).toLocaleString('en-IN')}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          {r.status}
        </span>
      )
    },
  ]

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 select-none font-body">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#5A1020]">Atelier Overview</h2>
          <p className="text-xs text-[#211D1E]/60 mt-1">Real-time boutique metrics, patron activity, and atelier order performance.</p>
        </div>

        <div className="flex items-center gap-3">
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
            onClick={() => loadStats(false)}
            disabled={loading}
            className="btn-outline !py-2 !px-4 text-xs font-bold tracking-widest flex items-center gap-2"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      <div className="text-[10px] text-[#211D1E]/40 font-mono mb-4 text-right select-none">
        Metrics synchronized: {lastSyncTime.toLocaleTimeString()}
      </div>

      {loading ? (
        <div className="py-20 text-center font-body text-xs text-[#211D1E]/50 animate-pulse">
          Retrieving live atelier metrics...
        </div>
      ) : error ? (
        <div className="py-20 text-center font-body text-sm text-red-600 font-semibold border border-red-200/20 bg-red-50/10 rounded-3xl p-6">
          <p className="mb-3">{error}</p>
          <button onClick={() => loadStats(false)} className="btn-primary text-xs">Reconnect</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Revenue" value={`₹${Number(stats.totalRevenue).toLocaleString('en-IN')}`} icon={IndianRupee} trend="+14% this month" />
            <StatCard label="Atelier Orders" value={stats.totalOrders} icon={ShoppingBag} trend="Active couture bookings" />
            <StatCard label="Registered Patrons" value={stats.totalCustomers} icon={Users} trend="Loyal clientele" />
            <StatCard label="Active Silhouettes" value={stats.totalProducts} icon={Package} trend="Live atelier collection" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SalesChart data={stats.salesTrend} />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#5A1020] font-bold mb-4 uppercase tracking-wider select-none">Recent Orders</h3>
              <DataTable columns={columns} rows={stats.recentOrders} emptyMessage="No recent transactions." />
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
