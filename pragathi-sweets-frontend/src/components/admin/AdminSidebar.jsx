import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, Package, PlusSquare, ClipboardList, Users, Boxes, Tag, Star, BarChart3, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/products/add', label: 'Add Product', icon: PlusSquare },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { to: '/admin/offers', label: 'Offers', icon: Tag },
  { to: '/admin/coupons', label: 'Coupons', icon: Tag },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function AdminSidebar({ isOpen, onClose }) {
  const content = (
    <div className="flex flex-col h-full bg-[#1F1F1F] text-[#FFFDF8]">
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-[#B8860B]/15 bg-[#1F1F1F]/95 select-none">
        <Link to="/" className="flex flex-col items-start" onClick={onClose}>
          <span className="font-display text-lg tracking-[0.18em] font-bold uppercase text-white leading-none">
            PRAGATHI
          </span>
          <span className="font-body text-[8px] tracking-[0.38em] uppercase text-[#B8860B] font-semibold mt-1.5 pl-[1px]">
            BOUTIQUE ADMIN
          </span>
        </Link>
        <button className="lg:hidden text-white/60 hover:text-white p-1" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <span className="block font-body text-[9px] font-bold text-[#B8860B] tracking-[0.2em] uppercase px-3 mb-3 select-none">
          Management
        </span>
        
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-body tracking-wider uppercase transition-all duration-300 ${
                isActive 
                  ? 'bg-[#8B0000] text-white border-r-4 border-[#B8860B] shadow-md font-semibold' 
                  : 'hover:bg-white/5 text-white/70 hover:text-white'
              }`
            }
          >
            <Icon size={16} className="text-[#B8860B] shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/10 text-center select-none bg-[#1F1F1F]/85">
        <span className="font-body text-[8px] tracking-widest text-white/30 uppercase block">
          PRAGATHI SWEETS v1.0
        </span>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Permanent on lg screens) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[#B8860B]/15 sticky top-0 h-screen overflow-hidden">
        {content}
      </aside>

      {/* Mobile Drawer (Only visible on mobile/tablet when open) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-black lg:hidden"
            />
            {/* Sidebar Slide-in */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden shadow-lg"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
