import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LogOut, Bell, Menu } from 'lucide-react'
import { loggedOut } from '../../store/authSlice'

export default function AdminNavbar({ onMenuToggle }) {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(loggedOut())
    navigate('/admin/login')
  }

  return (
    <header className="h-20 bg-white/95 backdrop-blur-md border-b border-[#C9A45C]/20 flex items-center justify-between px-4 sm:px-6 md:px-10 sticky top-0 z-30 select-none">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-[#211D1E]/80 hover:text-[#5A1020] transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="font-serif text-base sm:text-xl md:text-2xl text-[#5A1020] font-bold leading-tight">
            Welcome, <span className="text-[#C9A45C]">{user?.name || 'Atelier Director'}</span>
          </h1>
          <p className="text-[9px] text-[#211D1E]/50 tracking-wider uppercase font-bold mt-0.5 hidden sm:block">
            AGVIA Boutique Workspace Active
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6">
        <button className="p-2.5 rounded-full hover:bg-[#5A1020]/5 text-[#5A1020] hover:text-[#C9A45C] transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#C9A45C] rounded-full" />
        </button>
        <button 
          onClick={handleLogout} 
          className="btn-outline !py-2.5 !px-4 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 !border-[#5A1020]/30 hover:!bg-[#5A1020] hover:!text-white"
        >
          <LogOut size={12} /> Logout
        </button>
      </div>
    </header>
  )
}
