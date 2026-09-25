import { useEffect, useState, useRef, useCallback } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from 'recharts'
import {
  IndianRupee, ShoppingBag, TrendingUp, Package,
  RefreshCw, Radio, AlertTriangle, CalendarDays,
  Star, Award,
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminService } from '../../services/adminService'
import api from '../../services/api'
import { SALES_TREND } from '../../services/mockData'

const COLORS = ['#6E1E1E', '#C79A3B', '#4A0D1A', '#4E7D58', '#A67D28', '#2D5A8C', '#7A4C1A']

// ── Stat Card ───────────────────────────────────────────────
function StatTile({ label, value, sub, icon: Icon, accent = '#6E1E1E', pulse = false }) {
  return (
    <div className="bg-white border border-[#C79A3B]/15 rounded-2xl p-5 shadow-sm flex flex-col gap-2 select-none hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[10px] text-[#211D1E]/50 tracking-widest uppercase font-semibold">{label}</span>
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${accent}18` }}>
          <Icon size={15} style={{ color: accent }} />
        </div>
      </div>
      <p className="font-serif text-2xl font-bold" style={{ color: accent }}>{value ?? '—'}</p>
      {sub && (
        <p className={`font-sans text-[10px] text-[#211D1E]/45 tracking-wide ${pulse ? 'animate-pulse text-green-600' : ''}`}>
          {sub}
        </p>
      )}
    </div>
  )
}

// ── Custom Tooltip ───────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#FFF8F1] border border-[#C79A3B]/40 rounded-2xl px-4 py-3 shadow-lg">
      <p className="font-serif font-bold text-[#6E1E1E] text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-sans text-xs" style={{ color: p.color }}>
          {p.name}: <span className="font-bold">₹{Number(p.value).toLocaleString('en-IN')}</span>
        </p>
      ))}
    </div>
  )
}

// ── Build monthly sales from orders array ────────────────────
function buildMonthlySales(orders = []) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const totals = {}
  orders.forEach(o => {
    if (o.createdAt) {
      const m = monthNames[new Date(o.createdAt).getMonth()]
      const amt = o.finalAmount ?? o.totalAmount ?? 0
      totals[m] = (totals[m] || 0) + amt
    }
  })
  const result = Object.entries(totals).map(([month, sales]) => ({ month, sales: Math.round(sales) }))
  return result.length >= 2 ? result : SALES_TREND
}

// ── Build category breakdown from products + categories ──────
function buildCategoryBreakdown(products = [], categories = []) {
  if (categories.length > 0) {
    const breakdown = categories.map(c => ({
      name: c.name,
      value: products.filter(p =>
        p.categoryId === c.id || p.categoryName === c.name || p.category === c.name
      ).length
    })).filter(c => c.value > 0)
    if (breakdown.length > 0) return breakdown
  }
  return [
    { name: 'Sarees', value: 30 },
    { name: 'Lehengas', value: 25 },
    { name: 'Anarkalis & Kurtas', value: 20 },
    { name: 'Dresses & Gowns', value: 12 },
    { name: 'Western Wear', value: 8 },
    { name: 'Kurtis', value: 5 },
  ]
}

export default function Analytics() {
  const [data, setData] = useState(null)
  const [dashStats, setDashStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [liveSync, setLiveSync] = useState(true)
  const [lastSync, setLastSync] = useState(new Date())
  const [topProducts, setTopProducts] = useState([])
  const [salesTrend, setSalesTrend] = useState(SALES_TREND)
  const [categoryBreakdown, setCategoryBreakdown] = useState([])
  const [orderStatusBreakdown, setOrderStatusBreakdown] = useState([])
  const pollRef = useRef(null)

  const loadAnalytics = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      // ── 1. Dashboard stats from dedicated endpoint ──────────
      const dashRes = await api.get('/admin/analytics/dashboard')
      const dash = dashRes.data?.data || {}
      setDashStats(dash)

      // ── 2. Sales report for current year ───────────────────
      const year = new Date().getFullYear()
      const startDate = `${year}-01-01`
      const endDate   = new Date().toISOString().split('T')[0]
      let salesReport = null
      try {
        const srRes = await api.get(`/admin/analytics/sales-report?startDate=${startDate}&endDate=${endDate}`)
        salesReport = srRes.data?.data || null
      } catch (_) { /* fallback to orders */ }

      // ── 3. Parallel data fetches ────────────────────────────
      const [productsRes, ordersRes, categoriesRes] = await Promise.allSettled([
        api.get('/admin/products'),
        api.get('/admin/orders'),
        api.get('/admin/categories'),
      ])

      const products   = productsRes.status === 'fulfilled'   ? (productsRes.value.data?.data?.content   || []) : []
      const orders     = ordersRes.status === 'fulfilled'     ? (ordersRes.value.data?.data?.content     || []) : []
      const categories = categoriesRes.status === 'fulfilled' ? (categoriesRes.value.data?.data          || []) : []

      // ── Sales trend ─────────────────────────────────────────
      if (salesReport?.topSellingProducts?.length > 0) {
        // Use top-selling products from sales report for a bar chart if available
        setTopProducts(
          salesReport.topSellingProducts.slice(0, 5).map((p, i) => ({
            id: i,
            name: p.productName,
            unitsSold: p.unitsSold,
            rating: 0,
            image: '/images/classic_silk_saree.jpg',
          }))
        )
      } else {
        // Fallback: top rated products from product list
        const { normalizeProduct } = await import('../../services/productService')
        const rated = products
          .map(normalizeProduct)
          .filter(p => p.rating > 0)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5)
        setTopProducts(rated.length > 0 ? rated : products.slice(0, 5).map((p, i) => ({
          id: p.id || i,
          name: p.name,
          rating: p.rating || 0,
          image: p.imageUrl || p.image || '/images/classic_silk_saree.jpg',
        })))
      }

      setSalesTrend(buildMonthlySales(orders))
      setCategoryBreakdown(buildCategoryBreakdown(products, categories))

      // ── Order status breakdown ──────────────────────────────
      const statusCounts = {}
      orders.forEach(o => {
        const s = o.status || 'PENDING'
        statusCounts[s] = (statusCounts[s] || 0) + 1
      })
      setOrderStatusBreakdown(
        Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
      )

      setData({ dash, orders, products })
      setLastSync(new Date())
    } catch (err) {
      console.error('Analytics load error:', err)
      if (!silent) setError('Failed to load analytics. Please verify the backend connection.')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => { loadAnalytics(false) }, [loadAnalytics])

  // Live polling every 15s
  useEffect(() => {
    if (liveSync) {
      pollRef.current = setInterval(() => loadAnalytics(true), 15000)
    } else {
      clearInterval(pollRef.current)
    }
    return () => clearInterval(pollRef.current)
  }, [liveSync, loadAnalytics])

  // ── Render helpers ───────────────────────────────────────────
  if (loading) {
    return (
      <AdminLayout>
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-[#6E1E1E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-sans text-xs text-[#211D1E]/50 animate-pulse tracking-wider">Compiling real-time boutique analytics…</p>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="py-20 text-center border border-red-200/30 bg-red-50/10 rounded-3xl p-8">
          <AlertTriangle size={28} className="text-red-400 mx-auto mb-3" />
          <p className="font-sans text-sm text-red-600 font-semibold mb-4">{error}</p>
          <button onClick={() => loadAnalytics(false)} className="inline-flex items-center gap-2 bg-[#6E1E1E] text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-[#8B0000] transition-colors">
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      </AdminLayout>
    )
  }

  const d = dashStats || {}
  const totalRevenue  = d.totalRevenue  ?? 0
  const todayRevenue  = d.todayRevenue  ?? 0
  const totalOrders   = d.totalOrders   ?? 0
  const todayOrders   = d.todayOrders   ?? 0
  const pendingOrders = d.pendingOrders ?? 0
  const lowStock      = d.lowStockProducts ?? 0
  const totalProducts = d.totalProducts ?? 0
  const totalUsers    = d.totalUsers    ?? 0

  return (
    <AdminLayout>
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 select-none">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#5A1020]">Boutique Analytics</h2>
          <p className="font-sans text-xs text-[#211D1E]/50 mt-1">
            Real-time category performance, revenue metrics and atelier order insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLiveSync(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all ${
              liveSync
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-gray-100 border-gray-200 text-gray-500'
            }`}
          >
            <Radio size={12} className={liveSync ? 'animate-pulse text-green-600' : ''} />
            {liveSync ? 'Live: ON' : 'Live: OFF'}
          </button>
          <button
            onClick={() => loadAnalytics(false)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#C79A3B]/40 text-[#6E1E1E] text-[11px] font-bold hover:bg-[#FFF8F1] transition-colors"
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      {/* Last sync */}
      <div className="text-[10px] text-[#211D1E]/40 font-mono mb-6 text-right select-none">
        Last sync: {lastSync.toLocaleTimeString()} {liveSync && <span className="text-green-500">● Live</span>}
      </div>

      {/* ── KPI Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <StatTile label="Total Revenue"    value={`₹${Number(totalRevenue).toLocaleString('en-IN')}`} sub="All-time sales"         icon={IndianRupee}  accent="#6E1E1E" />
        <StatTile label="Today's Revenue"  value={`₹${Number(todayRevenue).toLocaleString('en-IN')}`} sub="Since midnight"        icon={TrendingUp}   accent="#C79A3B" pulse={liveSync} />
        <StatTile label="Total Orders"     value={totalOrders}    sub="Cumulative orders"              icon={ShoppingBag}          accent="#4A0D1A" />
        <StatTile label="Today's Orders"   value={todayOrders}    sub="Orders placed today"            icon={CalendarDays}         accent="#C79A3B" pulse={liveSync} />
        <StatTile label="Pending Orders"   value={pendingOrders}  sub="Awaiting processing"           icon={AlertTriangle}         accent={pendingOrders > 5 ? '#DC2626' : '#C79A3B'} />
        <StatTile label="Total Products"   value={totalProducts}  sub="Active silhouettes"            icon={Package}               accent="#4E7D58" />
        <StatTile label="Low Stock Items"  value={lowStock}       sub="≤ 10 units remaining"          icon={Package}               accent={lowStock > 0 ? '#DC2626' : '#4E7D58'} />
        <StatTile label="Registered Patrons" value={totalUsers}   sub="Total clientele"              icon={Award}                 accent="#6E1E1E" />
      </div>

      {/* ── Revenue Trend + Category Pie ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Area Chart */}
        <div className="lg:col-span-2 bg-white border border-[#C79A3B]/15 rounded-3xl p-6 shadow-sm">
          <h3 className="font-serif text-lg text-[#6E1E1E] font-semibold mb-6 uppercase tracking-wider">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#6E1E1E" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#6E1E1E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#C79A3B22" vertical={false} />
              <XAxis dataKey="month" stroke="#2B2B2B" opacity={0.4} fontSize={10} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#2B2B2B" opacity={0.4} fontSize={10} tickLine={false} axisLine={false} dx={-10}
                tickFormatter={v => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sales" name="Revenue" stroke="#6E1E1E" strokeWidth={2} fill="url(#revFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="bg-white border border-[#C79A3B]/15 rounded-3xl p-6 shadow-sm flex flex-col">
          <h3 className="font-serif text-lg text-[#6E1E1E] font-semibold mb-4 uppercase tracking-wider">
            Category Mix
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={3}
                >
                  {categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#FFF8F1', border: '1px solid #C79A3B',
                    borderRadius: '16px', fontFamily: 'sans-serif', fontSize: '11px'
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 10, fontFamily: 'sans-serif', marginTop: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Order Status + Top Products ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status Bar */}
        <div className="bg-white border border-[#C79A3B]/15 rounded-3xl p-6 shadow-sm">
          <h3 className="font-serif text-lg text-[#6E1E1E] font-semibold mb-6 uppercase tracking-wider">
            Order Status Breakdown
          </h3>
          {orderStatusBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={orderStatusBreakdown} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#C79A3B18" vertical={false} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} stroke="#211D1E" opacity={0.5} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="#211D1E" opacity={0.4} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#FFF8F1', border: '1px solid #C79A3B',
                    borderRadius: '14px', fontFamily: 'sans-serif', fontSize: '11px'
                  }}
                />
                <Bar dataKey="value" name="Orders" radius={[6, 6, 0, 0]}>
                  {orderStatusBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="font-sans text-xs text-[#211D1E]/40 text-center py-10">No order data yet.</p>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white border border-[#C79A3B]/15 rounded-3xl p-6 shadow-sm">
          <h3 className="font-serif text-lg text-[#6E1E1E] font-semibold mb-6 uppercase tracking-wider">
            Top Silhouettes
          </h3>
          <div className="space-y-3">
            {topProducts.length > 0 ? topProducts.map((p, i) => (
              <div
                key={p.id ?? i}
                className="flex items-center gap-4 p-3 rounded-xl bg-[#FFF8F1]/60 hover:bg-[#FFF8F1] border border-[#C79A3B]/10 hover:border-[#C79A3B]/25 transition-all"
              >
                <span className="font-mono font-bold text-[#C79A3B] text-sm w-5 shrink-0">#{i + 1}</span>
                <img
                  src={p.image || p.imageUrl || '/images/classic_silk_saree.jpg'}
                  alt={p.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#C79A3B]/20 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm font-bold text-[#5A1020] truncate">{p.name}</p>
                  {p.unitsSold != null ? (
                    <p className="font-sans text-[10px] text-[#C79A3B] font-semibold">{p.unitsSold} units sold</p>
                  ) : p.rating > 0 ? (
                    <p className="font-sans text-[10px] text-[#C79A3B] font-semibold flex items-center gap-1">
                      <Star size={10} className="fill-[#C79A3B]" /> {Number(p.rating).toFixed(1)}
                    </p>
                  ) : null}
                </div>
              </div>
            )) : (
              <p className="font-sans text-xs text-[#211D1E]/40 text-center py-8">No product data yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Stats Strip ─────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#5A1020] via-[#6E1E1E] to-[#4A0D1A] rounded-3xl p-6 text-white select-none shadow-xl">
        <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-[#C79A3B] mb-4">
          ✦ Live Atelier Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Avg Order Value', value: totalOrders > 0 ? `₹${Math.round(totalRevenue / totalOrders).toLocaleString('en-IN')}` : '₹0' },
            { label: 'Pending Fulfilment', value: pendingOrders },
            { label: 'Low Stock Alert', value: lowStock > 0 ? `${lowStock} items` : 'All Good ✓' },
            { label: 'Active Products', value: totalProducts },
          ].map(({ label, value }, i) => (
            <div key={i} className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <p className="font-sans text-[9px] tracking-widest uppercase text-[#C79A3B]/80 mb-1">{label}</p>
              <p className="font-serif text-lg font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
