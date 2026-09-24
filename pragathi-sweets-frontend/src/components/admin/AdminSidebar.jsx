import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, Package, PlusSquare, ClipboardList, Users, Boxes, Tag, Star, BarChart3, Crown, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Couture Edits', icon: Package },
  { to: '/admin/products/add', label: 'Add Silhouette', icon: PlusSquare },
  { to: '/admin/orders', label: 'Atelier Orders', icon: ClipboardList },
  { to: '/admin/customers', label: 'Patrons', icon: Users },
  { to: '/admin/subscriptions', label: 'Atelier Circle', icon: Crown },
  { to: '/admin/inventory', label: 'Fabric & Stock', icon: Boxes },
  { to: '/admin/offers', label: 'Curations & Offers', icon: Tag },
  { to: '/admin/coupons', label: 'Privilege Codes', icon: Tag },
  { to: '/admin/reviews', label: 'Patron Reviews', icon: Star },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function AdminSidebar({ isOpen, onClose }) {
  const content = (
    <div className="flex flex-col h-full bg-[#1A0B10] text-[#FAF7F2]">
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-[#C9A45C]/20 bg-[#1A0B10]/95 select-none">
        <Link to="/" className="flex items-center gap-3" onClick={onClose}>
          <img src="/images/agvia-logo.png" alt="AGVIA" className="h-9 w-auto object-contain brightness-110" />
          <div className="flex flex-col">
            <span className="font-serif text-lg tracking-[0.2em] font-bold uppercase text-[#FAF7F2] leading-none">
              AGVIA
            </span>
            <span className="font-sans text-[8px] tracking-[0.32em] uppercase text-[#C9A45C] font-semibold mt-1">
              ATELIER ADMIN
            </span>
          </div>
        </Link>
        <button className="lg:hidden text-white/60 hover:text-white p-1" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <span className="block font-sans text-[9px] font-bold text-[#C9A45C] tracking-[0.25em] uppercase px-3 mb-3 select-none">
          Atelier Management
        </span>
        
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-sans tracking-wider uppercase transition-all duration-300 ${
                isActive 
                  ? 'bg-[#5A1020] text-[#FAF7F2] border-r-4 border-[#C9A45C] shadow-md font-semibold' 
                  : 'hover:bg-white/5 text-white/70 hover:text-white'
              }`
            }
          >
            <Icon size={16} className="text-[#C9A45C] shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/10 text-center select-none bg-[#14060B]">
        <span className="font-sans text-[8px] tracking-widest text-white/40 uppercase block">
          AGVIA ATELIER ERP v2.0
        </span>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Permanent on lg screens) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[#C9A45C]/20 sticky top-0 h-screen overflow-hidden">
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
