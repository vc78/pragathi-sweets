import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { authService } from '../../services/authService'
import { credentialsReceived } from '../../store/authSlice'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { user, token } = await authService.adminLogin(form)
      dispatch(credentialsReceived({ user, token }))
      toast.success('Welcome back to the admin console', {
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error('Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] flex flex-col justify-center items-center px-4 font-body relative">
      <Link to="/login" className="absolute top-6 left-6 text-xs text-[#B8860B] hover:text-white font-bold uppercase flex items-center gap-1.5 transition-colors">
        <ArrowLeft size={14} /> Back to Client Login
      </Link>

      <div className="w-full max-w-md p-8 bg-[#FFFDF8] border border-[#B8860B]/25 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B0000] via-[#B8860B] to-[#8B0000]" />
        
        <div className="flex flex-col items-center mb-8 select-none">
          <div className="w-14 h-14 rounded-2xl bg-[#8B0000]/10 text-[#8B0000] border border-[#8B0000]/10 flex items-center justify-center mb-3">
            <ShieldCheck size={24} />
          </div>
          <span className="font-display text-2xl tracking-[0.18em] font-bold uppercase text-[#8B0000] leading-none">
            PRAGATHI
          </span>
          <span className="font-body text-[8px] tracking-[0.38em] uppercase text-[#B8860B] font-semibold mt-1.5 pl-[1px]">
            BOUTIQUE ADMIN PANEL
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="Admin email" className="input-field !bg-white" />
          <input name="password" type="password" required value={form.password} onChange={handleChange} placeholder="Password" className="input-field !bg-white" />
          
          <button type="submit" disabled={loading} className="btn-primary w-full text-xs font-bold tracking-widest py-4">
            {loading ? 'Verifying Admin...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[10px] text-[#3A2D23]/40 mt-6 font-body">
          SECURED CONNECTION ESTABLISHED
        </p>
      </div>
    </div>
  )
}
