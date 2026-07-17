import { useEffect, useState } from 'react'
import { IndianRupee, ShoppingBag, Users, Package } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import StatCard from '../../components/admin/StatCard'
import SalesChart from '../../components/admin/SalesChart'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    adminService.getDashboardStats().then(setStats)
  }, [])

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'total', label: 'Total', render: (r) => `₹${r.total}` },
    { key: 'status', label: 'Status' },
  ]

  return (
    <AdminLayout>
      <div className="mb-8 select-none">
        <h2 className="font-display text-3xl font-light text-maroon-dark">Dashboard Overview</h2>
        <p className="font-body text-xs text-charcoal/50 mt-1">Real-time boutique metrics and recent sales performance.</p>
      </div>

      {!stats ? (
        <div className="py-20 text-center font-body text-xs text-charcoal/50">
          Loading boutique stats...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} icon={IndianRupee} trend="+12% this month" />
            <StatCard label="Total Orders" value={stats.totalOrders} icon={ShoppingBag} trend="Active sales" />
            <StatCard label="Total Customers" value={stats.totalCustomers} icon={Users} trend="Loyal audience" />
            <StatCard label="Total Products" value={stats.totalProducts} icon={Package} trend="In boutique catalog" />
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SalesChart data={stats.salesTrend} />
            </div>
            <div>
              <h3 className="font-display text-lg text-maroon font-semibold mb-6 uppercase tracking-wider select-none">Recent Orders</h3>
              <DataTable columns={columns} rows={stats.recentOrders} />
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
