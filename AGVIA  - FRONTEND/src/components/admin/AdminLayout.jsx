import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminNavbar from './AdminNavbar'

export default function AdminLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#FFFDF8] font-body text-[#3A2D23]">
      {/* Desktop Sidebar */}
      <AdminSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      
      <div className="flex-1 min-w-0">
        <AdminNavbar onMenuToggle={() => setMobileSidebarOpen(true)} />
        <main className="p-3.5 sm:p-5 md:p-6">{children}</main>
      </div>
    </div>
  )
}
