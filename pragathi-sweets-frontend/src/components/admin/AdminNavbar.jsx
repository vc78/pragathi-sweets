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
    <header className="h-20 bg-white/95 backdrop-blur-md border-b border-[#B8860B]/15 flex items-center justify-between px-4 sm:px-6 md:px-10 sticky top-0 z-30 select-none">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-[#3A2D23]/80 hover:text-[#8B0000] transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="font-display text-base sm:text-xl md:text-2xl text-[#8B0000] font-bold leading-tight">
            Welcome, <span className="text-[#B8860B]">{user?.name || 'Admin'}</span>
          </h1>
          <p className="text-[9px] text-[#3A2D23]/40 tracking-wider uppercase font-bold mt-0.5 hidden sm:block">
            Workspace Session Active
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6">
        <button className="p-2.5 rounded-full hover:bg-[#8B0000]/5 text-[#8B0000] hover:text-[#B8860B] transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#B8860B] rounded-full" />
        </button>
        <button 
          onClick={handleLogout} 
          className="btn-outline !py-2.5 !px-4 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5"
        >
          <LogOut size={12} /> Logout
        </button>
      </div>
    </header>
  )
}
