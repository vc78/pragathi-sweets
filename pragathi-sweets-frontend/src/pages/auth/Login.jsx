import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { authService } from '../../services/authService'
import { credentialsReceived } from '../../store/authSlice'
import { ArrowLeft } from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { user, token } = await authService.login(form)
      dispatch(credentialsReceived({ user, token }))
      toast.success(`Welcome back, ${user.name}!`, {
        style: { background: '#8B0000', color: '#FFFDF8', borderRadius: '12px' }
      })
      navigate('/')
    } catch (err) {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-center items-center px-4 font-body relative">
      <Link to="/" className="absolute top-6 left-6 text-xs text-[#B8860B] hover:text-[#8B0000] font-bold uppercase flex items-center gap-1.5 transition-colors">
        <ArrowLeft size={14} /> Back to Store
      </Link>

      <div className="w-full max-w-md p-8 bg-white border border-[#B8860B]/15 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B0000] via-[#B8860B] to-[#8B0000]" />

        <Link to="/" className="flex flex-col items-center mb-8 select-none group">
          <span className="font-display text-2xl tracking-[0.18em] font-bold uppercase text-[#8B0000] leading-none group-hover:text-[#B8860B] transition-colors duration-300">
            PRAGATHI
          </span>
          <span className="font-body text-[8px] tracking-[0.38em] uppercase text-[#B8860B] font-semibold mt-1.5 pl-[1px]">
            SWEETS & SAVOURIES
          </span>
        </Link>
        
        <h1 className="font-display text-2xl text-center text-[#8B0000] font-bold mb-1">Welcome back</h1>
        <p className="text-center text-[#3A2D23]/50 mb-6 text-xs leading-relaxed">Log in to your client account to continue shopping.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="Email address" className="input-field" />
          <input name="password" type="password" required value={form.password} onChange={handleChange} placeholder="Password" className="input-field" />
          
          <button type="submit" disabled={loading} className="btn-primary w-full text-xs font-bold tracking-widest py-4">
            {loading ? 'Entering Boutique...' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center text-xs text-[#3A2D23]/60 mt-6 font-body">
          New here? <Link to="/register" className="text-[#B8860B] hover:text-[#8B0000] font-bold underline decoration-[#B8860B]/30 transition-colors">Create an account</Link>
        </p>
        <p className="text-center text-[9px] text-[#3A2D23]/40 mt-4 font-body">
          <Link to="/admin/login" className="hover:text-[#8B0000] transition-colors uppercase tracking-widest font-bold">Access Admin Panel →</Link>
        </p>
      </div>
    </div>
  )
}
