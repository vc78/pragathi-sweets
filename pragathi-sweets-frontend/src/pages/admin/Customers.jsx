import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { adminService } from '../../services/adminService'

export default function Customers() {
  const [customers, setCustomers] = useState([])

  useEffect(() => { adminService.getCustomers().then(setCustomers) }, [])

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'orders', label: 'Orders' },
    { key: 'spent', label: 'Total Spent', render: (r) => `₹${r.spent.toLocaleString('en-IN')}` },
    { key: 'joined', label: 'Joined' },
  ]

  return (
    <AdminLayout>
      <div className="mb-8 select-none">
        <h2 className="font-display text-3xl font-light text-maroon-dark">Loyal Clients</h2>
        <p className="font-body text-xs text-charcoal/50 mt-1">Register of sweet storefront clients, lifetime purchases, and account details.</p>
      </div>
      <DataTable columns={columns} rows={customers} emptyMessage="No customers yet." />
    </AdminLayout>
  )
}
