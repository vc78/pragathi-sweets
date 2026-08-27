import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import AdminLayout from '../../components/admin/AdminLayout'
import SalesChart from '../../components/admin/SalesChart'
import { adminService } from '../../services/adminService'

const COLORS = ['#6E1E1E', '#C79A3B', '#2D1A12', '#4E7D58', '#A67D28']

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    adminService.getAnalytics()
      .then(setData)
      .catch(err => {
        console.error(err)
        setError('Failed to compile business analytics. Please verify backend connection.')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20 text-center font-body text-xs text-charcoal/50 animate-pulse">
          Compiling business analytics...
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="py-20 text-center font-body text-sm text-red-600 font-semibold border border-red-200/20 bg-red-50/10 rounded-3xl">
          {error}
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-8 select-none">
        <h2 className="font-display text-3xl font-light text-maroon-dark">Boutique Analytics</h2>
        <p className="font-body text-xs text-charcoal/50 mt-1">Detailed review of category performance, popular confections, and revenue metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <SalesChart data={data.salesTrend} title="Revenue Over Time" />
        </div>
        <div className="bg-white border border-gold/15 rounded-3xl p-6 shadow-sm flex flex-col justify-between select-none">
          <h3 className="font-display text-lg text-maroon font-semibold mb-6 uppercase tracking-wider">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie 
                data={data.categoryBreakdown} 
                dataKey="value" 
                nameKey="name" 
                innerRadius={50} 
                outerRadius={80} 
                paddingAngle={3}
              >
                {data.categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: '#FFF8F1', 
                  border: '1px solid #C79A3B', 
                  borderRadius: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '11px'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'Poppins, sans-serif' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-gold/15 rounded-3xl p-6 shadow-sm select-none">
        <h3 className="font-display text-lg text-maroon font-semibold mb-6 uppercase tracking-wider">Top Rated Products</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {data.topProducts.map((p) => (
            <div 
              key={p.id} 
              className="bg-beige/25 border border-gold/10 hover:border-gold/30 hover:bg-beige/40 rounded-2xl p-4 text-center transition-all duration-300"
            >
              <img 
                src={p.image} 
                alt={p.name} 
                className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border border-gold/20 shadow-sm" 
              />
              <p className="font-display text-sm font-bold text-maroon-dark truncate">{p.name}</p>
              <p className="font-body text-[10px] text-gold mt-1 font-semibold">
                ★ {p.rating.toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
