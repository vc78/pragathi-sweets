import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    adminService.getCustomers()
      .then(setCustomers)
      .catch(err => {
        console.error(err)
        setError('Failed to load customers. Please verify backend connection.')
      })
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'orders', label: 'Orders' },
    { key: 'spent', label: 'Total Spent', render: (r) => `₹${(r.spent || 0).toLocaleString('en-IN')}` },
    { key: 'joined', label: 'Joined' },
  ]

  return (
    <AdminLayout>
      <div className="mb-8 select-none">
        <h2 className="font-display text-3xl font-light text-maroon-dark">Loyal Clients</h2>
        <p className="font-body text-xs text-charcoal/50 mt-1">Register of sweet storefront clients, lifetime purchases, and account details.</p>
      </div>
      {loading ? (
        <div className="py-20 text-center font-body text-xs text-charcoal/50 animate-pulse">
          Loading client directory...
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
